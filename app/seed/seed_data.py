"""Run `python -m app.seed.seed_data` to create a compact, realistic demo dataset."""
from datetime import date, timedelta
from app.database import Base, SessionLocal, engine
from app.auth import hash_password
from app.models import Category, FounderMeet, Post, Registration, Speaker, Summit, User

def seed():
    Base.metadata.create_all(engine); db=SessionLocal()
    if db.query(User).first(): print('Database already has data; skipping.'); return
    users=[User(name='Admin User',email='admin@techtalk.dev',password_hash=hash_password('AdminPass123'),role='admin')]
    users += [User(name=f'Community Member {i}',email=f'user{i}@techtalk.dev',password_hash=hash_password('UserPass123')) for i in range(1,10)]
    categories=[Category(name=n,slug=n.lower().replace(' ','-')) for n in ['AI','Startups','Cloud','Web Development','Career']]
    db.add_all(users+categories);db.flush()
    db.add_all([Post(author_id=users[i%10].id,category_id=categories[i%5].id,title=f'{topic}: practical lessons {i+1}',content=f'A practical TechTalk discussion about {topic}.',status='published' if i%2 else 'draft') for i,topic in enumerate(['AI','Cloud','Startups','Web Development','Career']*3)])
    speakers=[Speaker(name=f'Speaker {i}',designation='Technology Leader',company='NexziByte',expertise='AI, cloud, startups') for i in range(1,9)];db.add_all(speakers);db.flush()
    summits=[Summit(title=f'TechTalk Summit {i}',date=date.today()+timedelta(days=i*30),location='Hyderabad',venue='NexziByte Hub',is_published=True) for i in range(1,4)]
    meets=[FounderMeet(title=f'Founder Meet {i}',date=date.today()+timedelta(days=i*45),location='Hyderabad',networking_info='Founder networking session',is_published=True) for i in range(1,3)]
    db.add_all(summits+meets);db.flush()
    for i,e in enumerate(summits):e.speakers=speakers[i:i+3]
    for i,e in enumerate(meets):e.speakers=speakers[i+3:i+6]
    db.add_all([Registration(user_id=users[i%10].id,event_type='summit' if i%2 else 'founder_meet',event_id=(summits if i%2 else meets)[(i//10) % (3 if i%2 else 2)].id) for i in range(20)])
    db.commit();db.close();print('Seeded users, posts, events, speakers, and registrations.')
if __name__=='__main__':seed()
