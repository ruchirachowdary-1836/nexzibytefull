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
    assert client.get('/health').json() == {'status': 'ok'}
    response = client.post('/auth/register', json={'name': 'Test User', 'email': 'test@example.com', 'password': 'Password123'})
    assert response.status_code == 201
    assert client.get('/users/me', headers=token('test@example.com', 'Password123')).status_code == 200


def test_post_and_community_lifecycle():
    admin = token('admin@example.com', 'AdminPass123')
    user = token('test@example.com', 'Password123')
    category = client.post('/categories', json={'name': 'AI', 'slug': 'ai'}, headers=admin)
    assert category.status_code == 201
    post = client.post('/posts', json={'title': 'Building with FastAPI', 'content': 'A useful article.', 'category_id': category.json()['id']}, headers=user)
    assert post.status_code == 201
    post_id = post.json()['id']
    assert client.patch(f'/posts/{post_id}/publish', headers=user).json()['status'] == 'published'
    assert client.post(f'/posts/{post_id}/comments', json={'content': 'Great post'}, headers=user).status_code == 201
    assert client.post(f'/posts/{post_id}/reactions', headers=user).json()['reacted'] is True
    assert client.post(f'/posts/{post_id}/reactions', headers=user).json()['reacted'] is False
    assert client.post(f'/posts/{post_id}/save', headers=user).status_code == 200
    assert len(client.get('/users/me/saved-posts', headers=user).json()) == 1


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
    assert client.post('/registrations', json=body, headers=user).status_code == 201
    assert client.post('/registrations', json=body, headers=user).status_code == 409
