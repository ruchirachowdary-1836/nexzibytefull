from datetime import date, datetime, time
import datetime as datetime_module
from contextlib import asynccontextmanager
from typing import Literal
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from .models import *
from .auth import create_access_token, get_current_user, hash_password, require_admin, verify_password

@asynccontextmanager
async def lifespan(_: FastAPI):
    # Migrations own schema changes; this only bootstraps a brand-new database.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title='NexziByte TechTalk API', version='1.0.0', lifespan=lifespan)

@app.exception_handler(HTTPException)
async def http_error(_, exc): return JSONResponse(status_code=exc.status_code, content={'detail': exc.detail})

class RegisterIn(BaseModel): name: str = Field(min_length=1, max_length=120); email: EmailStr; password: str = Field(min_length=8, max_length=128)
class CategoryIn(BaseModel): name: str = Field(min_length=1, max_length=100); slug: str = Field(min_length=1, max_length=120); description: str | None = None
class PostIn(BaseModel): title: str = Field(min_length=1, max_length=200); content: str = Field(min_length=1); category_id: int; tags: str | None = None; cover_image: str | None = None
class CommentIn(BaseModel): content: str = Field(min_length=1, max_length=5000)
class SpeakerIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    designation: str = Field(min_length=1, max_length=150)
    photo: str | None = None
    company: str | None = None
    expertise: str | None = None
    biography: str | None = None
    professional_links: str | None = None

    @field_validator('photo', 'professional_links')
    @classmethod
    def validate_urls(cls, value: str | None):
        if value is None or not value.strip():
            return value
        for url in value.split(','):
            HttpUrl(url.strip())
        return value
class EventIn(BaseModel):
    title: str = Field(min_length=1, max_length=200); description: str | None = None; banner: str | None = None; date: date; time: datetime_module.time | None = None; location: str | None = None; agenda: str | None = None; speaker_ids: list[int] = []
    venue: str | None = None; founder_information: str | None = None; networking_info: str | None = None
class RegistrationIn(BaseModel): event_type: Literal['summit', 'founder_meet']; event_id: int

def item(obj):
    data = {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
    return data
def user_item(user):
    return {c.name: getattr(user, c.name) for c in user.__table__.columns if c.name != 'password_hash'}
def one(db, cls, ident):
    obj = db.get(cls, ident)
    if not obj: raise HTTPException(404, detail=f'{cls.__name__} not found')
    return obj
def admin_or_owner(user, owner_id):
    if user.role != 'admin' and user.id != owner_id: raise HTTPException(403, detail='Not permitted')
def set_values(obj, values, allowed):
    for key, value in values.items():
        if key in allowed and value is not None: setattr(obj, key, value)
def attach_speakers(db, event, speaker_ids):
    speakers = [one(db, Speaker, sid) for sid in speaker_ids]
    event.speakers = speakers
def get_event(db, event_type, event_id): return one(db, Summit if event_type == 'summit' else FounderMeet, event_id)

@app.get('/health')
def health(): return {'status': 'ok'}

@app.post('/auth/register', status_code=201)
def register(body: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter_by(email=body.email).first(): raise HTTPException(409, detail='Email already registered')
    user = User(name=body.name, email=body.email, password_hash=hash_password(body.password))
    db.add(user); db.commit(); db.refresh(user); return user_item(user)
@app.post('/auth/login')
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=form.username).first()
    if not user or not verify_password(form.password, user.password_hash): raise HTTPException(401, detail='Incorrect email or password')
    return {'access_token': create_access_token(user.email), 'token_type': 'bearer'}
@app.get('/users/me')
def me(user: User = Depends(get_current_user)): return user_item(user)

@app.get('/users')
def users(search: str | None = None, limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_admin)):
    q = db.query(User)
    if search: q = q.filter(or_(User.name.ilike(f'%{search}%'), User.email.ilike(f'%{search}%')))
    return {'total': q.count(), 'items': [user_item(x) for x in q.offset(offset).limit(limit)]}
@app.get('/users/{user_id}')
def user_detail(user_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)): return user_item(one(db, User, user_id))
@app.patch('/users/{user_id}/status')
def user_status(user_id: int, active: bool, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    u = one(db, User, user_id); u.is_active = active; db.commit(); return user_item(u)

@app.post('/categories', status_code=201)
def create_category(body: CategoryIn, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if db.query(Category).filter(or_(Category.name == body.name, Category.slug == body.slug)).first(): raise HTTPException(409, detail='Category name or slug exists')
    x = Category(**body.model_dump()); db.add(x); db.commit(); db.refresh(x); return item(x)
@app.get('/categories')
def list_categories(db: Session = Depends(get_db)): return [item(x) for x in db.query(Category).filter_by(is_archived=False)]
@app.put('/categories/{category_id}')
def update_category(category_id: int, body: CategoryIn, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    x = one(db, Category, category_id); set_values(x, body.model_dump(), {'name','slug','description'}); db.commit(); return item(x)
@app.delete('/categories/{category_id}')
def archive_category(category_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    x = one(db, Category, category_id); x.is_archived=True; db.commit(); return {'detail':'Category archived'}

@app.post('/posts', status_code=201)
def create_post(body: PostIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    one(db, Category, body.category_id); x=Post(author_id=user.id, **body.model_dump()); db.add(x); db.commit(); db.refresh(x); return item(x)
@app.get('/posts')
def list_posts(category: int | None=None, status: str | None=None, author: int | None=None, db: Session=Depends(get_db)):
    q=db.query(Post).filter_by(is_archived=False)
    if category: q=q.filter(Post.category_id==category)
    if status: q=q.filter(Post.status==status)
    if author: q=q.filter(Post.author_id==author)
    return [item(x) for x in q.order_by(Post.created_at.desc())]
@app.get('/posts/{post_id}')
def post_detail(post_id:int, db:Session=Depends(get_db)): return item(one(db,Post,post_id))
@app.put('/posts/{post_id}')
def update_post(post_id:int, body:PostIn, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    x=one(db,Post,post_id); admin_or_owner(user,x.author_id); one(db,Category,body.category_id); set_values(x,body.model_dump(),{'title','content','category_id','tags','cover_image'}); db.commit(); return item(x)
@app.patch('/posts/{post_id}/{action}')
def post_action(post_id:int, action:Literal['publish','unpublish'], db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    x=one(db,Post,post_id); admin_or_owner(user,x.author_id); x.status='published' if action=='publish' else 'draft'; db.commit(); return item(x)
@app.delete('/posts/{post_id}')
def archive_post(post_id:int, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    x=one(db,Post,post_id); admin_or_owner(user,x.author_id); x.is_archived=True; db.commit(); return {'detail':'Post archived'}

@app.post('/posts/{post_id}/comments', status_code=201)
def comment(post_id:int, body:CommentIn, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    one(db,Post,post_id); x=Comment(post_id=post_id,user_id=user.id,content=body.content); db.add(x);db.commit();db.refresh(x);return item(x)
@app.get('/posts/{post_id}/comments')
def comments(post_id:int,db:Session=Depends(get_db)): return [item(x) for x in db.query(Comment).filter_by(post_id=post_id).order_by(Comment.created_at)]
@app.delete('/comments/{comment_id}')
def delete_comment(comment_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    x=one(db,Comment,comment_id); admin_or_owner(user,x.user_id);db.delete(x);db.commit();return {'detail':'Comment deleted'}
@app.post('/posts/{post_id}/reactions')
def toggle_reaction(post_id:int,reaction_type:Literal['like','upvote']='like',db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    one(db,Post,post_id);x=db.query(Reaction).filter_by(post_id=post_id,user_id=user.id).first()
    if x: db.delete(x);db.commit();return {'reacted':False}
    x=Reaction(post_id=post_id,user_id=user.id,reaction_type=reaction_type);db.add(x);db.commit();return {'reacted':True,'reaction':item(x)}
@app.post('/posts/{post_id}/save')
def save_post(post_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    one(db,Post,post_id)
    if db.query(SavedPost).filter_by(post_id=post_id,user_id=user.id).first(): raise HTTPException(409,detail='Post already saved')
    db.add(SavedPost(post_id=post_id,user_id=user.id));db.commit();return {'detail':'Post saved'}
@app.delete('/posts/{post_id}/save')
def unsave_post(post_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    x=db.query(SavedPost).filter_by(post_id=post_id,user_id=user.id).first()
    if not x: raise HTTPException(404,detail='Saved post not found')
    db.delete(x);db.commit();return {'detail':'Post unsaved'}
@app.get('/users/me/saved-posts')
def saved_posts(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    ids=[x.post_id for x in db.query(SavedPost).filter_by(user_id=user.id)];return [item(x) for x in db.query(Post).filter(Post.id.in_(ids))] if ids else []

@app.post('/speakers', status_code=201)
def create_speaker(body: SpeakerIn, db: Session=Depends(get_db), _:User=Depends(require_admin)):
    x=Speaker(**body.model_dump());db.add(x);db.commit();db.refresh(x);return item(x)
@app.get('/speakers')
def list_speakers(db:Session=Depends(get_db)): return [item(x) for x in db.query(Speaker)]
@app.get('/speakers/{speaker_id}')
def speaker_detail(speaker_id:int,db:Session=Depends(get_db)): return item(one(db,Speaker,speaker_id))
@app.put('/speakers/{speaker_id}')
def update_speaker(speaker_id:int,body:SpeakerIn,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    x=one(db,Speaker,speaker_id);set_values(x,body.model_dump(),set(body.model_dump()));db.commit();return item(x)
@app.delete('/speakers/{speaker_id}')
def delete_speaker(speaker_id:int,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    x=one(db,Speaker,speaker_id);db.delete(x);db.commit();return {'detail':'Speaker deleted'}
@app.get('/speakers/{speaker_id}/events')
def speaker_events(speaker_id:int,db:Session=Depends(get_db)):
    x=one(db,Speaker,speaker_id);return {'summits':[item(e) for e in x.summits], 'founder_meets':[item(e) for e in x.founder_meets]}

def event_response(event):
    result=item(event);result['speakers']=[item(s) for s in event.speakers];return result
def list_events(db, cls, status):
    q=db.query(cls)
    if status:
        if status not in ('upcoming','past'): raise HTTPException(422,detail='status must be upcoming or past')
        compare=cls.date >= date.today() if status=='upcoming' else cls.date < date.today();q=q.filter(compare)
    return [event_response(x) for x in q.order_by(cls.date)]
def make_event(db, cls, body):
    data=body.model_dump(exclude={'speaker_ids','venue','founder_information','networking_info'})
    if cls is Summit: data['venue']=body.venue
    else: data.update(founder_information=body.founder_information,networking_info=body.networking_info)
    x=cls(**data);attach_speakers(db,x,body.speaker_ids);db.add(x);db.commit();db.refresh(x);return event_response(x)
def update_event(db, cls, ident, body):
    x=one(db,cls,ident); data=body.model_dump(exclude={'speaker_ids'});set_values(x,data,set(data));attach_speakers(db,x,body.speaker_ids);db.commit();return event_response(x)
def event_state(db, cls, ident, action):
    x=one(db,cls,ident);x.is_published=action=='publish';
    if action=='archive': x.status='past'
    db.commit();return event_response(x)

@app.post('/summits',status_code=201)
def create_summit(body:EventIn,db:Session=Depends(get_db),_:User=Depends(require_admin)): return make_event(db,Summit,body)
@app.get('/summits')
def list_summits(status:str|None=None,db:Session=Depends(get_db)): return list_events(db,Summit,status)
@app.get('/summits/{event_id}')
def summit_detail(event_id:int,db:Session=Depends(get_db)): return event_response(one(db,Summit,event_id))
@app.put('/summits/{event_id}')
def update_summit(event_id:int,body:EventIn,db:Session=Depends(get_db),_:User=Depends(require_admin)): return update_event(db,Summit,event_id,body)
@app.patch('/summits/{event_id}/{action}')
def summit_action(event_id:int,action:Literal['publish','archive'],db:Session=Depends(get_db),_:User=Depends(require_admin)): return event_state(db,Summit,event_id,action)
@app.delete('/summits/{event_id}')
def delete_summit(event_id:int,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    x=one(db,Summit,event_id);db.delete(x);db.commit();return {'detail':'Summit deleted'}

@app.post('/founder-meets',status_code=201)
def create_founder_meet(body:EventIn,db:Session=Depends(get_db),_:User=Depends(require_admin)): return make_event(db,FounderMeet,body)
@app.get('/founder-meets')
def list_founder_meets(status:str|None=None,db:Session=Depends(get_db)): return list_events(db,FounderMeet,status)
@app.get('/founder-meets/{event_id}')
def founder_meet_detail(event_id:int,db:Session=Depends(get_db)): return event_response(one(db,FounderMeet,event_id))
@app.put('/founder-meets/{event_id}')
def update_founder_meet(event_id:int,body:EventIn,db:Session=Depends(get_db),_:User=Depends(require_admin)): return update_event(db,FounderMeet,event_id,body)
@app.patch('/founder-meets/{event_id}/{action}')
def founder_meet_action(event_id:int,action:Literal['publish','archive'],db:Session=Depends(get_db),_:User=Depends(require_admin)): return event_state(db,FounderMeet,event_id,action)
@app.delete('/founder-meets/{event_id}')
def delete_founder_meet(event_id:int,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    x=one(db,FounderMeet,event_id);db.delete(x);db.commit();return {'detail':'Founder Meet deleted'}

@app.post('/registrations', status_code=201)
def create_registration(body:RegistrationIn,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    get_event(db,body.event_type,body.event_id)
    if db.query(Registration).filter_by(user_id=user.id,**body.model_dump()).first(): raise HTTPException(409,detail='Already registered for this event')
    x=Registration(user_id=user.id,**body.model_dump());db.add(x);db.commit();db.refresh(x);return item(x)
@app.patch('/registrations/{registration_id}/cancel')
def cancel_registration(registration_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    x=one(db,Registration,registration_id);admin_or_owner(user,x.user_id);x.status='cancelled';db.commit();return item(x)
@app.get('/registrations')
def list_registrations(event_type:str|None=None,event_id:int|None=None,status:str|None=None,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    q=db.query(Registration)
    if event_type:q=q.filter_by(event_type=event_type)
    if event_id:q=q.filter_by(event_id=event_id)
    if status:q=q.filter_by(status=status)
    return [item(x) for x in q]
@app.get('/events/{event_type}/{event_id}/registrations')
def event_registrations(event_type:Literal['summit','founder_meet'],event_id:int,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    get_event(db,event_type,event_id);return [item(x) for x in db.query(Registration).filter_by(event_type=event_type,event_id=event_id)]

@app.get('/dashboard/overview')
def overview(from_date:date|None=Query(None,alias='from'),to_date:date|None=Query(None,alias='to'),db:Session=Depends(get_db),_:User=Depends(require_admin)):
    rquery=db.query(Registration)
    if from_date:rquery=rquery.filter(Registration.registered_at>=datetime.combine(from_date,time.min))
    if to_date:rquery=rquery.filter(Registration.registered_at<=datetime.combine(to_date,time.max))
    return {'total_users':db.query(func.count(User.id)).scalar(),'total_posts':db.query(func.count(Post.id)).scalar(),'published_posts':db.query(func.count(Post.id)).filter(Post.status=='published').scalar(),'total_categories':db.query(func.count(Category.id)).scalar(),'upcoming_summits':db.query(func.count(Summit.id)).filter(Summit.date>=date.today()).scalar(),'upcoming_founder_meets':db.query(func.count(FounderMeet.id)).filter(FounderMeet.date>=date.today()).scalar(),'total_speakers':db.query(func.count(Speaker.id)).scalar(),'total_registrations':rquery.count()}
@app.get('/dashboard/recent-activity')
def activity(db:Session=Depends(get_db),_:User=Depends(require_admin)):
    events=sorted([*db.query(Summit).filter(Summit.date>=date.today()),*db.query(FounderMeet).filter(FounderMeet.date>=date.today())],key=lambda e:e.date)[:5]
    return {'posts':[item(x) for x in db.query(Post).order_by(Post.created_at.desc()).limit(5)],'upcoming_events':[event_response(x) for x in events],'registrations':[item(x) for x in db.query(Registration).order_by(Registration.registered_at.desc()).limit(5)]}
@app.get('/dashboard/posts-by-category')
def posts_by_category(db:Session=Depends(get_db),_:User=Depends(require_admin)):
    return [{'category':n,'count':c} for n,c in db.query(Category.name,func.count(Post.id)).outerjoin(Post).group_by(Category.id,Category.name)]
@app.get('/dashboard/registrations-by-event')
def registrations_by_event(db:Session=Depends(get_db),_:User=Depends(require_admin)):
    rows=db.query(Registration.event_type,Registration.event_id,func.count(Registration.id)).group_by(Registration.event_type,Registration.event_id).all();return [{'event_type':t,'event_id':i,'count':c} for t,i,c in rows]
