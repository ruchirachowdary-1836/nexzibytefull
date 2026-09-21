import os
import importlib

os.environ['DB_URL'] = 'sqlite:///./test_techtalk.db'

from fastapi.testclient import TestClient
from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.main import app
from app.models import User
from app.config import settings
main_module = importlib.import_module("app.main")

client = TestClient(app)
STRONG_ADMIN_PASSWORD = 'NexziByte!Adm1n#2026'
STRONG_USER_PASSWORD = 'Violet!Q7zM2#rT9xL4'
UPDATED_USER_PASSWORD = 'Mango!River#Pass7X'


def setup_module():
    settings.smtp_host = "smtp.test.invalid"
    settings.smtp_port = 587
    settings.smtp_user = "test@example.com"
    settings.smtp_password = "test-password"
    settings.mail_from = "TechTalk <test@example.com>"
    main_module.send_verification_email_background = lambda user_id: None
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    db = SessionLocal()
    db.add(User(name='Admin', email='admin@example.com', password_hash=hash_password(STRONG_ADMIN_PASSWORD), role='admin'))
    db.commit()
    db.close()


def token(email, password):
    response = client.post('/auth/login', data={'username': email, 'password': password})
    assert response.status_code == 200
    if response.json().get('verification_required'):
        db = SessionLocal()
        user = db.query(User).filter_by(email=email).one()
        code = user.verification_token
        db.close()
        verification = client.post('/auth/verify-email', json={'code': code})
        assert verification.status_code == 200
        return {'Authorization': 'Bearer ' + verification.json()['access_token']}
    return {'Authorization': f"Bearer {response.json()['access_token']}"}


def register_and_verify(name, email, password):
    response = client.post('/auth/register', json={
        'name': name,
        'email': email,
        'password': password,
        'accept_terms': True,
    })
    assert response.status_code == 201
    assert response.json()['email_verification_required'] is True
    assert 'access_token' not in response.json()
    pending_login = client.post('/auth/login', data={'username': email, 'password': password})
    assert pending_login.status_code == 200
    assert pending_login.json()['verification_required'] is True
    db = SessionLocal()
    pending_user = db.query(User).filter_by(email=email).one()
    assert pending_user.is_active is False
    assert pending_user.email_verified is False
    code = pending_user.verification_token
    db.close()
    verification = client.post('/auth/verify-email', json={'email': email, 'code': code})
    assert verification.status_code == 200
    assert verification.json()['access_token']
    assert verification.json()['refresh_token']
    return verification.json()


def test_auth_and_user_profile():
    assert client.get('/').json()['docs'] == '/docs'
    assert client.get('/health').json() == {'status': 'ok'}
    response = register_and_verify('Test User', 'test@example.com', STRONG_USER_PASSWORD)
    assert 'password_hash' not in response['user']
    profile = client.get('/users/me', headers=token('test@example.com', STRONG_USER_PASSWORD))
    assert profile.status_code == 200
    assert 'password_hash' not in profile.json()


def test_auth_profile_routes_and_home_data():
    profile_email = 'profile-user@example.com'
    register_and_verify('Profile User', profile_email, STRONG_USER_PASSWORD)
    auth = token(profile_email, STRONG_USER_PASSWORD)
    me = client.get('/auth/me', headers=auth)
    assert me.status_code == 200
    assert me.json()['email'] == profile_email

    updated = client.put('/auth/profile', json={
        'name': 'Updated User',
        'bio': 'Product and AI leader',
        'location': 'Hyderabad',
        'professional_role': 'AI Product Lead',
        'profile_image': 'https://example.com/avatar.png',
    }, headers=auth)
    assert updated.status_code == 200
    assert updated.json()['name'] == 'Updated User'
    assert updated.json()['profile_image'] == 'https://example.com/avatar.png'

    password_change = client.put('/auth/change-password', json={
        'current_password': STRONG_USER_PASSWORD,
        'new_password': UPDATED_USER_PASSWORD,
    }, headers=auth)
    assert password_change.status_code == 200

    home = client.get('/home')
    assert home.status_code == 200
    assert 'featured_posts' in home.json()
    assert 'trending_categories' in home.json()
    assert 'upcoming_events' in home.json()
    assert 'featured_speakers' in home.json()

    assert client.post('/auth/login', data={'username': profile_email, 'password': UPDATED_USER_PASSWORD}).status_code == 200


def test_neon_session_exchange_returns_fastapi_tokens():
    response = register_and_verify('Neon Bridge User', 'neon-bridge@example.com', STRONG_USER_PASSWORD)
    exchange = client.post('/auth/neon-session', headers={
        'Authorization': 'Bearer ' + response['access_token'],
    })
    assert exchange.status_code == 200
    assert exchange.json()['access_token']
    assert exchange.json()['refresh_token']


def test_cors_preflight_for_frontend():
    response = client.options('/posts', headers={
        'Origin': 'https://techtalk-frontend-acvb.onrender.com',
        'Access-Control-Request-Method': 'GET',
    })
    assert response.status_code == 200
    assert response.headers['access-control-allow-origin'] == 'https://techtalk-frontend-acvb.onrender.com'


def test_post_and_community_lifecycle():
    admin = token('admin@example.com', STRONG_ADMIN_PASSWORD)
    user = token('test@example.com', STRONG_USER_PASSWORD)
    category = client.post('/categories', json={'name': 'AI', 'slug': 'ai'}, headers=admin)
    assert category.status_code == 201
    post = client.post('/posts', json={'title': 'Building with FastAPI', 'content': 'A useful article.', 'category_id': category.json()['id']}, headers=user)
    assert post.status_code == 201
    post_id = post.json()['id']
    assert client.patch(f'/posts/{post_id}/publish', headers=user).json()['status'] == 'published'
    updated = client.put(f'/posts/{post_id}', json={'title': 'Updated FastAPI article', 'content': 'Updated content.', 'category_id': category.json()['id']}, headers=user)
    assert updated.status_code == 200
    assert client.post(f'/posts/{post_id}/comments', json={'content': 'Great post'}, headers=user).status_code == 201
    assert client.post(f'/posts/{post_id}/reactions', headers=user).json()['reacted'] is True
    assert client.post(f'/posts/{post_id}/reactions', headers=user).json()['reacted'] is False
    assert client.post(f'/posts/{post_id}/save', headers=user).status_code == 200
    assert len(client.get('/users/me/saved-posts', headers=user).json()) == 1
    assert client.delete(f'/posts/{post_id}', headers=user).status_code == 200


def test_event_publish_and_duplicate_registration_prevention():
    admin = token('admin@example.com', STRONG_ADMIN_PASSWORD)
    user = token('test@example.com', STRONG_USER_PASSWORD)
    speaker = client.post('/speakers', json={'name': 'Asha Rao', 'designation': 'Founder'}, headers=admin)
    assert speaker.status_code == 201
    summit = client.post('/summits', json={'title': 'AI Summit', 'date': '2030-01-10', 'location': 'Hyderabad', 'speaker_ids': [speaker.json()['id']]}, headers=admin)
    assert summit.status_code == 201
    summit_id = summit.json()['id']
    assert client.patch(f'/summits/{summit_id}/publish', headers=admin).json()['is_published'] is True
    body = {'event_type': 'summit', 'event_id': summit_id}
    registration = client.post('/registrations', json=body, headers=user)
    assert registration.status_code == 201
    qr = client.post('/qr/verify', json={'token': registration.json()['qr_data']}, headers=user)
    assert qr.status_code == 200
    assert qr.json()['status'] == 'VALID'
    assert qr.json()['attendee'] == 'Test User'
    assert qr.json()['event'] == 'AI Summit'
    assert qr.json()['pass_id'] == registration.json()['pass_id']
    assert client.post('/registrations', json=body, headers=user).status_code == 409
    assert client.patch(f"/registrations/{registration.json()['id']}/cancel", headers=user).json()['status'] == 'cancelled'
    assert client.patch(f'/summits/{summit_id}/archive', headers=admin).json()['status'] == 'past'


def test_summit_management_fields_unpublish_and_status_filtering():
    admin = token('admin@example.com', STRONG_ADMIN_PASSWORD)
    speaker = client.post('/speakers', json={'name': 'Summit Speaker', 'designation': 'CTO'}, headers=admin)
    assert speaker.status_code == 201
    summit = client.post('/summits', json={
        'title': 'Cloud Summit',
        'description': 'A summit description',
        'banner': 'https://example.com/banner.png',
        'date': '2030-06-15',
        'time': '10:30:00',
        'location': 'Hyderabad',
        'venue': 'NexziByte Hub',
        'agenda': 'Opening; keynote',
        'speaker_ids': [speaker.json()['id']],
    }, headers=admin)
    assert summit.status_code == 201
    summit_id = summit.json()['id']
    assert summit.json()['status'] == 'upcoming'
    assert summit.json()['venue'] == 'NexziByte Hub'
    assert summit.json()['speakers'][0]['id'] == speaker.json()['id']

    published = client.patch(f'/summits/{summit_id}/publish', headers=admin)
    assert published.status_code == 200
    assert published.json()['is_published'] is True
    unpublished = client.patch(f'/summits/{summit_id}/unpublish', headers=admin)
    assert unpublished.status_code == 200
    assert unpublished.json()['is_published'] is False
    assert len(client.get('/summits?status=upcoming').json()) >= 1

    updated = client.put(f'/summits/{summit_id}', json={
        'title': 'Past Cloud Summit',
        'date': '2020-06-15',
        'speaker_ids': [],
    }, headers=admin)
    assert updated.status_code == 200
    assert updated.json()['status'] == 'past'
    assert any(event['id'] == summit_id for event in client.get('/summits?status=past').json())

    assert client.delete(f'/summits/{summit_id}', headers=admin).status_code == 200
    assert client.get(f'/summits/{summit_id}').status_code == 404


def test_founder_meet_management_fields_unpublish_and_archive():
    admin = token('admin@example.com', STRONG_ADMIN_PASSWORD)
    speaker = client.post('/speakers', json={'name': 'Founder Speaker', 'designation': 'Founder'}, headers=admin)
    assert speaker.status_code == 201
    meet = client.post('/founder-meets', json={
        'title': 'Startup Founders Circle',
        'description': 'A founder discussion',
        'banner': 'https://example.com/founders.png',
        'date': '2030-08-20',
        'time': '14:00:00',
        'location': 'Hyderabad',
        'founder_information': 'Growth-stage founders',
        'agenda': 'Introductions; roundtable',
        'networking_info': 'Structured networking',
        'speaker_ids': [speaker.json()['id']],
    }, headers=admin)
    assert meet.status_code == 201
    meet_id = meet.json()['id']
    assert meet.json()['status'] == 'upcoming'
    assert meet.json()['founder_information'] == 'Growth-stage founders'
    assert meet.json()['networking_info'] == 'Structured networking'
    assert meet.json()['speakers'][0]['id'] == speaker.json()['id']

    assert client.patch(f'/founder-meets/{meet_id}/publish', headers=admin).json()['is_published'] is True
    unpublished = client.patch(f'/founder-meets/{meet_id}/unpublish', headers=admin)
    assert unpublished.status_code == 200
    assert unpublished.json()['is_published'] is False

    updated = client.put(f'/founder-meets/{meet_id}', json={
        'title': 'Past Founders Circle',
        'date': '2020-08-20',
        'founder_information': 'Archived founders',
        'networking_info': 'Past networking',
        'speaker_ids': [],
    }, headers=admin)
    assert updated.status_code == 200
    assert updated.json()['status'] == 'past'
    assert client.patch(f'/founder-meets/{meet_id}/archive', headers=admin).json()['status'] == 'past'
    assert any(event['id'] == meet_id for event in client.get('/founder-meets?status=past').json())

    assert client.delete(f'/founder-meets/{meet_id}', headers=admin).status_code == 200
    assert client.get(f'/founder-meets/{meet_id}').status_code == 404


def test_user_and_speaker_validation():
    admin = token('admin@example.com', STRONG_ADMIN_PASSWORD)
    users = client.get('/users', headers=admin)
    assert users.status_code == 200
    assert all('password_hash' not in user for user in users.json()['items'])
    invalid = client.post('/speakers', json={'name': 'Invalid Link', 'designation': 'Founder', 'professional_links': 'not-a-url'}, headers=admin)
    assert invalid.status_code == 422
    status_update = client.patch('/users/1/status?active=false', headers=admin)
    assert status_update.status_code == 200
    assert 'password_hash' not in status_update.json()


def test_extended_profile_notification_and_admin_routes():
    db = SessionLocal()
    admin_user = db.query(User).filter_by(email='admin@example.com').first()
    if not admin_user:
        admin_user = User(name='Admin', email='admin@example.com', password_hash=hash_password(STRONG_ADMIN_PASSWORD), role='admin', is_active=True)
        db.add(admin_user)
    else:
        admin_user.is_active = True
        admin_user.role = 'admin'
    db.commit(); db.close()

    admin = token('admin@example.com', STRONG_ADMIN_PASSWORD)
    user = token('test@example.com', STRONG_USER_PASSWORD)

    tag = client.post('/tags', json={'name': 'AI'}, headers=admin)
    assert tag.status_code == 201

    settings = client.put('/users/me/settings', json={
        'notification_preferences': {'comments': True, 'reactions': True, 'followers': True, 'event_updates': True, 'registration_updates': True},
        'privacy': {'profile_visibility': 'public'},
    }, headers=user)
    assert settings.status_code == 200
    assert client.get('/users/me/settings', headers=user).status_code == 200

    category = client.post('/categories', json={'name': 'Cybersecurity', 'slug': 'cybersecurity'}, headers=admin)
    assert category.status_code == 201
    post = client.post('/posts', json={'title': 'Security best practices', 'content': 'A long article about cybersecurity.', 'category_id': category.json()['id'], 'tags': 'AI, Security'}, headers=user)
    assert post.status_code == 201
    post_id = post.json()['id']
    assert client.patch(f'/posts/{post_id}/publish', headers=user).status_code == 200
    assert client.post(f'/posts/{post_id}/comments', json={'content': 'Nice write-up'}, headers=user).status_code == 201
    assert client.post(f'/posts/{post_id}/reactions', headers=user).json()['reacted'] is True
    assert client.get('/notifications', headers=user).status_code == 200
    assert client.get('/users/me/posts', headers=user).status_code == 200

    speaker = client.post('/speakers', json={'name': 'Event Speaker', 'designation': 'CTO', 'company': 'NexziByte'}, headers=admin)
    assert speaker.status_code == 201
    summit = client.post('/summits', json={'title': 'AI Leadership Summit', 'date': '2031-02-18', 'location': 'Bengaluru', 'speaker_ids': [speaker.json()['id']]}, headers=admin)
    assert summit.status_code == 201
    registration = client.post(f"/summits/{summit.json()['id']}/register", headers=user)
    assert registration.status_code == 201
    assert client.get('/users/me/registrations', headers=user).status_code == 200

    dashboard = client.get('/admin/dashboard', headers=admin)
    assert dashboard.status_code == 200
    assert 'Total Users' in dashboard.json()
    assert client.get('/admin/posts', headers=admin).status_code == 200
    assert client.get('/admin/registrations', headers=admin).status_code == 200
    assert client.get(f"/summits/{summit.json()['id']}/agenda", headers=admin).status_code == 200
    assert client.get(f"/summits/{summit.json()['id']}/speakers", headers=admin).status_code == 200
    assert client.get(f"/summits/{summit.json()['id']}/related", headers=admin).status_code == 200
