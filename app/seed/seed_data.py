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
    categories=[Category(name=n,slug=n.lower().replace(' ','-')) for n in ['Python Engineering','Cloud Computing','AI Automation','Web Applications','Career Technology']]
    db.add_all(users+categories);db.flush()
    topics=['Python engineering','cloud transformation','AI automation','web applications','career technology']
    db.add_all([Post(author_id=users[i%10].id,category_id=categories[i%5].id,title=f'{topic.title()}: practical lessons {i+1}',content=f'A Nexzibyte TechTalk discussion about {topic}, secure delivery and future-ready opportunities.',status='published' if i%2 else 'draft') for i,topic in enumerate(topics*3)])
    speakers=[Speaker(name=f'Nexzibyte Technology Leader {i}',designation='Technology Leader',company='Nexzibyte Solutions',expertise='Python, cloud, AI automation, digital transformation') for i in range(1,9)];db.add_all(speakers);db.flush()
    summits=[Summit(title=title,date=date.today()+timedelta(days=i*30),location='Hyderabad',venue='Nexzibyte Innovation Hub',description=description,is_published=True) for i,(title,description) in enumerate([
        ('TechTalks: GPACTS 2026 Field Notes','Mapping healthcare, pharma and industrial automation challenges at the world’s biggest Pharma AI & IT Summit.'),
        ('Nexzibyte AI & Cloud Engineering Forum','Practical conversations on LLM workflows, predictive systems and elastic cloud infrastructure.'),
        ('TechTalks Future-Ready Careers','An open knowledge exchange for developers, students and recruiters bridging the upskilling gap.'),
    ],1)]
    meets=[FounderMeet(title=title,date=date.today()+timedelta(days=i*45),location='Hyderabad',networking_info='Nexzibyte ecosystem networking session',is_published=True) for i,title in enumerate(['Client Collaboration & MoU Briefing','TechTalks Developer Exchange'],1)]
    db.add_all(summits+meets);db.flush()
    for i,e in enumerate(summits):e.speakers=speakers[i:i+3]
    for i,e in enumerate(meets):e.speakers=speakers[i+3:i+6]
    db.add_all([Registration(user_id=users[i%10].id,event_type='summit' if i%2 else 'founder_meet',event_id=(summits if i%2 else meets)[(i//10) % (3 if i%2 else 2)].id) for i in range(20)])
    db.commit();db.close();print('Seeded users, posts, events, speakers, and registrations.')
if __name__=='__main__':seed()
