from datetime import datetime

from fastapi import Header, HTTPException
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import main as main_module
from app.auth import get_current_user, get_optional_user
from app.database import Base, get_db
from app.models import Category, Comment, Post, Reaction, User, UserEducation, UserExperience, UserFollow


def make_network_client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, expire_on_commit=False)
    with session_factory() as db:
        db.add_all(
            [
                User(name="Follower", email="follower@example.com", role="user", is_active=True, email_verified=True),
                User(name="Followed", email="followed@example.com", role="user", is_active=True, email_verified=True),
                User(name="Other", email="other@example.com", role="user", is_active=True, email_verified=True),
            ]
        )
        db.add(Category(name="Engineering", slug="engineering"))
        db.commit()
        user_ids = {
            user.email: user.id
            for user in db.query(User).all()
        }
        category_id = db.query(Category.id).filter_by(slug="engineering").scalar()

    def override_db():
        with session_factory() as db:
            yield db

    def user_for_request(x_test_user_id: int = Header(default=user_ids["follower@example.com"])):
        with session_factory() as db:
            user = db.get(User, x_test_user_id)
            if user is None:
                raise HTTPException(401, detail="Unknown test user")
            db.expunge(user)
            return user

    main_module.app.dependency_overrides[get_db] = override_db
    main_module.app.dependency_overrides[get_current_user] = user_for_request
    main_module.app.dependency_overrides[get_optional_user] = user_for_request
    return TestClient(main_module.app), session_factory, engine, user_ids, category_id


def close_network_client(client, engine):
    client.close()
    main_module.app.dependency_overrides.pop(get_current_user, None)
    main_module.app.dependency_overrides.pop(get_optional_user, None)
    main_module.app.dependency_overrides.pop(get_db, None)
    engine.dispose()


def test_professional_profile_is_public_safe_and_self_editable():
    client, session_factory, engine, user_ids, _category_id = make_network_client()
    member_id = user_ids["follower@example.com"]
    other_id = user_ids["other@example.com"]
    try:
        updated = client.patch(
            "/users/me/profile",
            headers={"X-Test-User-Id": str(member_id)},
            json={
                "name": "Updated Follower",
                "headline": "Staff Engineer",
                "current_company": "Example Labs",
                "bio": "Builds reliable services.",
                "location": "Remote",
                "experiences": [
                    {
                        "title": "Staff Engineer",
                        "company": "Example Labs",
                        "start_date": "2021-01-01",
                        "end_date": None,
                        "description": "Led platform engineering.",
                    }
                ],
                "education": [
                    {"school": "Example University", "degree": "BSc", "field": "Computer Science", "year": 2019}
                ],
                "role": "admin",
                "user_id": other_id,
            },
        )
        assert updated.status_code == 200
        assert updated.json()["id"] == member_id
        assert updated.json()["headline"] == "Staff Engineer"
        assert updated.json()["current_company"] == "Example Labs"
        assert updated.json()["experiences"][0]["title"] == "Staff Engineer"
        assert updated.json()["education"][0]["year"] == 2019
        assert "email" not in updated.json()
        assert "role" not in updated.json()

        public = client.get(f"/users/{member_id}/profile")
        assert public.status_code == 200
        assert public.json()["name"] == "Updated Follower"
        assert "email" not in public.json()
        assert "phone" not in public.json()
        assert "password_hash" not in public.json()

        other_profile = client.get(f"/users/{other_id}/profile")
        assert other_profile.status_code == 200
        assert other_profile.json()["name"] == "Other"
        with session_factory() as db:
            assert db.get(User, other_id).name == "Other"
            assert db.get(User, other_id).role == "user"
            assert db.query(UserExperience).filter_by(user_id=member_id).count() == 1
            assert db.query(UserEducation).filter_by(user_id=member_id).count() == 1

        denied = client.get(f"/users/{other_id}", headers={"X-Test-User-Id": str(member_id)})
        assert denied.status_code == 403
        invalid_dates = client.patch(
            "/users/me/profile",
            headers={"X-Test-User-Id": str(member_id)},
            json={
                "experiences": [{
                    "title": "Engineer",
                    "company": "Company",
                    "start_date": "2024-01-01",
                    "end_date": "2023-01-01",
                }]
            },
        )
        assert invalid_dates.status_code == 422
    finally:
        close_network_client(client, engine)


def test_follow_unfollow_and_follower_lists_prevent_self_and_duplicates():
    client, session_factory, engine, user_ids, _category_id = make_network_client()
    follower_id = user_ids["follower@example.com"]
    followed_id = user_ids["followed@example.com"]
    try:
        self_follow = client.post(
            f"/users/{follower_id}/follow",
            headers={"X-Test-User-Id": str(follower_id)},
        )
        assert self_follow.status_code == 400

        first = client.post(
            f"/users/{followed_id}/follow",
            headers={"X-Test-User-Id": str(follower_id)},
        )
        duplicate = client.post(
            f"/users/{followed_id}/follow",
            headers={"X-Test-User-Id": str(follower_id)},
        )
        assert first.status_code == duplicate.status_code == 200
        assert first.json() == {"following": True, "changed": True}
        assert duplicate.json() == {"following": True, "changed": False}
        profile = client.get(
            f"/users/{followed_id}/profile",
            headers={"X-Test-User-Id": str(follower_id)},
        )
        assert profile.json()["is_following"] is True
        assert profile.json()["followers_count"] == 1
        assert client.get(f"/users/{followed_id}/followers").json()[0]["id"] == follower_id
        assert client.get(f"/users/{follower_id}/following").json()[0]["id"] == followed_id

        unfollow = client.delete(
            f"/users/{followed_id}/follow",
            headers={"X-Test-User-Id": str(follower_id)},
        )
        assert unfollow.status_code == 200
        assert unfollow.json() == {"following": False, "changed": True}
        repeated_unfollow = client.delete(
            f"/users/{followed_id}/follow",
            headers={"X-Test-User-Id": str(follower_id)},
        )
        assert repeated_unfollow.json() == {"following": False, "changed": False}
        assert client.get(
            f"/users/{followed_id}/profile",
            headers={"X-Test-User-Id": str(follower_id)},
        ).json()["is_following"] is False
        with session_factory() as db:
            assert db.query(UserFollow).count() == 0
    finally:
        close_network_client(client, engine)


def test_personalized_feed_contains_only_own_and_followed_published_posts():
    client, session_factory, engine, user_ids, category_id = make_network_client()
    follower_id = user_ids["follower@example.com"]
    followed_id = user_ids["followed@example.com"]
    other_id = user_ids["other@example.com"]
    with session_factory() as db:
        posts = [
            Post(author_id=follower_id, category_id=category_id, title="Own", content="Own published work", status="published", created_at=datetime(2025, 1, 3)),
            Post(author_id=followed_id, category_id=category_id, title="Followed", content="Followed published work", status="published", created_at=datetime(2025, 1, 2)),
            Post(author_id=other_id, category_id=category_id, title="Unfollowed", content="Not in network", status="published", created_at=datetime(2025, 1, 4)),
            Post(author_id=followed_id, category_id=category_id, title="Draft", content="Not public", status="draft", created_at=datetime(2025, 1, 5)),
            Post(author_id=followed_id, category_id=category_id, title="Archived", content="No longer public", status="published", is_archived=True, created_at=datetime(2025, 1, 6)),
        ]
        db.add_all(posts)
        db.add(UserFollow(follower_id=follower_id, followed_id=followed_id))
        db.commit()
        expected_ids = {posts[0].id, posts[1].id}

    try:
        response = client.get("/feed", headers={"X-Test-User-Id": str(follower_id)})
        assert response.status_code == 200
        assert {post["id"] for post in response.json()} == expected_ids
        assert [post["title"] for post in response.json()] == ["Own", "Followed"]
        own_posts = client.get("/posts", params={"author": follower_id})
        assert own_posts.status_code == 200
        assert any(post["title"] == "Own" for post in own_posts.json())
        with session_factory() as db:
            assert db.query(Comment).count() == 0
            assert db.query(Reaction).count() == 0
    finally:
        close_network_client(client, engine)
