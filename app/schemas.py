from pydantic import BaseModel, Field


class UserRegister(BaseModel):
    username: str = Field(min_length=3, max_length=20)
    password: str = Field(min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class TaskCreate(BaseModel):
    title: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=2)


class TaskUpdate(BaseModel):
    title: str
    description: str
    completed: bool