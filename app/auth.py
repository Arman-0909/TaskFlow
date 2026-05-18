from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
from passlib.context import CryptContext

from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin
from app.config import SECRET_KEY, ALGORITHM
from app.dependencies import admin_only

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# REGISTER
@router.post("/register", status_code=201)
def register(user: UserRegister, db: Session = Depends(get_db)):

    username = user.username.lower()

    existing_user = db.query(User).filter(
        User.username == username
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        username=username,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "User registered successfully"
    }


# LOGIN
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    username = user.username.lower()

    db_user = db.query(User).filter(
        User.username == username
    ).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode(
        {
            "username": db_user.username,
            "role": db_user.role
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "access_token": token,
        "role": db_user.role
    }


# ADMIN ROUTE
@router.get("/admin/users")
def get_all_users(
    current_user=Depends(admin_only),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()

    return users