from fastapi import APIRouter, HTTPException, Depends, Request, status
from pydantic import BaseModel, EmailStr, constr
from sqlalchemy import Column, Integer, String, create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import time
from typing_extensions import Annotated
import resend
from jinja2 import Template
from fastapi.security import OAuth2PasswordBearer




load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")

# SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./users.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT config
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30 * 12

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# SQLAlchemy User model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    recipes = relationship("SavedRecipe", back_populates="user")



class SavedRecipe(Base):
    __tablename__ = "saved_recipes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    image = Column(String)
    source_url = Column(String)

    user = relationship("User", back_populates="recipes")

# Pydantic schemas
class SignupRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

PasswordType = Annotated[str, constr(min_length=8)]
class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: PasswordType
    confirm_password: PasswordType

Base.metadata.create_all(bind=engine)

# Router
router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    if req.password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(req.password)
    new_user = User(
        first_name=req.first_name,
        last_name=req.last_name,
        email=req.email,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not pwd_context.verify(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token}


@router.post("/request-password-reset")
def request_password_reset(req: PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=15))
    reset_url = f"https://lassen.arryan.xyz/auth/reset-password?token={token}"

    # Load and render the template
    with open("app/templates/forgot_password_email.html", "r") as file:
        print("hitting")
        template = Template(file.read())
        rendered_html = template.render(reset_url=reset_url)

    resend.Emails.send({
        "from": "noreply@lassen.arryan.xyz",
        "to": [req.email],
        "subject": "Reset your Lassen Account Password",
        "html": rendered_html
    })

    return {"message": "Password reset email sent"}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # or "/auth/login" if that’s your route

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print("🔐 Raw token received:", token)  # 👈 Add this

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("📬 Decoded payload:", payload)  # 👈 Add this

        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError as e:
        print("❌ JWT decode error:", str(e))  # 👈 Add this
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        print("❌ No user found for email:", email)  # 👈 Add this
        raise credentials_exception

    print("✅ Authenticated user:", user.email)  # 👈 Add this
    return user


@router.post("/reset-password")
def reset_password(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = pwd_context.hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.post("/save-recipe")
def save_recipe(data: dict, db: Session = Depends(get_db), user=Depends(get_current_user)):
    recipe = SavedRecipe(
        user_id=user.id,
        title=data["title"],
        image=data["image"],
        source_url=data["source_url"]
    )
    db.add(recipe)
    db.commit()
    return {"message": "Recipe saved successfully"}

@router.get("/recipes")
def get_saved_recipes(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(SavedRecipe).filter(SavedRecipe.user_id == user.id).all()
