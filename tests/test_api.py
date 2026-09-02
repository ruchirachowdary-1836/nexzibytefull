import os

os.environ['DB_URL'] = 'sqlite:///./test_techtalk.db'

from fastapi.testclient import TestClient
from app.auth import hash_password
from app.database import Base, SessionLocal, engine
from app.main import app
from app.models import User

client = TestClient(app)


def setup_module():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    db = SessionLocal()
    db.add(User(name='Admin', email='admin@example.com', password_hash=hash_password('AdminPass123'), role='admin'))
    db.commit()
    db.close()


def token(email, password):
    response = client.post('/auth/login', data={'username': email, 'password': password})
    assert response.status_code == 200
    return {'Authorization': f"Bearer {response.json()['access_token']}"}


def test_auth_and_user_profile():
    assert client.get('/').json()['docs'] == '/docs'
    assert client.get('/health').json() == {'status': 'ok'}
    response = client.post('/auth/register', json={'name': 'Test User', 'email': 'test@example.com', 'password': 'Password123'})
    assert response.status_code == 201
    assert 'password_hash' not in response.json()
    profile = client.get('/users/me', headers=token('test@example.com', 'Password123'))
    assert profile.status_code == 200
    assert 'password_hash' not in profile.json()


def test_cors_preflight_for_frontend():
    response = client.options('/posts', headers={
        'Origin': 'https://frontend.example',
        'Access-Control-Request-Method': 'GET',
    })
    assert response.status_code == 200
    assert response.headers['access-control-allow-origin'] == '*'


def test_post_and_community_lifecycle():
    admin = token('admin@example.com', 'AdminPass123')
    user = token('test@example.com', 'Password123')
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
    admin = token('admin@example.com', 'AdminPass123')
    user = token('test@example.com', 'Password123')
    speaker = client.post('/speakers', json={'name': 'Asha Rao', 'designation': 'Founder'}, headers=admin)
    assert speaker.status_code == 201
    summit = client.post('/summits', json={'title': 'AI Summit', 'date': '2030-01-10', 'location': 'Hyderabad', 'speaker_ids': [speaker.json()['id']]}, headers=admin)
    assert summit.status_code == 201
    summit_id = summit.json()['id']
    assert client.patch(f'/summits/{summit_id}/publish', headers=admin).json()['is_published'] is True
    body = {'event_type': 'summit', 'event_id': summit_id}
    registration = client.post('/registrations', json=body, headers=user)
    assert registration.status_code == 201
    assert client.post('/registrations', json=body, headers=user).status_code == 409
    assert client.patch(f"/registrations/{registration.json()['id']}/cancel", headers=user).json()['status'] == 'cancelled'
    assert client.patch(f'/summits/{summit_id}/archive', headers=admin).json()['status'] == 'past'


def test_summit_management_fields_unpublish_and_status_filtering():
    admin = token('admin@example.com', 'AdminPass123')
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
    admin = token('admin@example.com', 'AdminPass123')
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
    admin = token('admin@example.com', 'AdminPass123')
    users = client.get('/users', headers=admin)
    assert users.status_code == 200
    assert all('password_hash' not in user for user in users.json()['items'])
    invalid = client.post('/speakers', json={'name': 'Invalid Link', 'designation': 'Founder', 'professional_links': 'not-a-url'}, headers=admin)
    assert invalid.status_code == 422
    status_update = client.patch('/users/1/status?active=false', headers=admin)
    assert status_update.status_code == 200
    assert 'password_hash' not in status_update.json()
