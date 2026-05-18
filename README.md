# TaskFlow API

A scalable backend task management system built using FastAPI, PostgreSQL, and JWT Authentication with Role-Based Access Control.

## Features

- User Registration & Login
- JWT Authentication
- Role-Based Access Control (User/Admin)
- Task CRUD Operations
- PostgreSQL Database Integration (Neon)
- Protected API Routes
- Admin-only APIs
- Swagger API Documentation
- Minimal Frontend Dashboard
- Structured Project Architecture

## Tech Stack

### Backend
- FastAPI
- PostgreSQL (Neon)
- SQLAlchemy
- JWT Authentication
- Passlib

### Frontend
- HTML
- CSS
- Vanilla JavaScript

## Project Structure

TASKFLOW/

├── app/

│   ├── auth.py

│   ├── config.py

│   ├── database.py

│   ├── dependencies.py

│   ├── main.py

│   ├── models.py

│   ├── schemas.py

│   └── tasks.py

│

├── frontend/

│   ├── index.html

│   ├── dashboard.html

│   ├── style.css

│   └── app.js

│

├── .env

├── requirements.txt

└── README.md

## Installation

Clone the repository:

git clone YOUR_GITHUB_REPO

Move into project folder:

cd TASKFLOW

Install dependencies:

pip install -r requirements.txt

## Environment Variables

Create a `.env` file in root directory:

DATABASE_URL=YOUR_NEON_DATABASE_URL

SECRET_KEY=your_secret_key

ALGORITHM=HS256

## Run Backend

uvicorn app.main:app --reload

Backend URL:

http://127.0.0.1:8000

Swagger Docs:

http://127.0.0.1:8000/docs

## Run Frontend

Open:

frontend/index.html

in browser.

## API Features

### Authentication
- Register User
- Login User
- JWT Token Generation

### Tasks
- Create Task
- Read Tasks
- Update Task
- Delete Task

### Admin
- View All Users
- View All Tasks

## Role-Based Access

### User
- Manage only own tasks

### Admin
- Access all tasks
- Access all users

Admin accounts are managed manually through the database for security purposes.

## Scalability Notes

This project follows a modular backend architecture that supports future scalability.

Possible future improvements:
- Docker deployment
- Redis caching
- Microservices architecture
- Rate limiting
- CI/CD pipelines
- Load balancing
- Async background jobs

## Screenshots

Add screenshots here:
- Login Page
- Dashboard
- Swagger Documentation
- Admin Panel

## Author

Ayush