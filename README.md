# Senior Care Companion App

A service-based full-stack starter project for a senior citizen care mobile-friendly web app.

## Technology Stack

- Backend: FastAPI
- ORM: SQLAlchemy 2.0 style
- Database: MySQL 8
- Auth: JWT access token
- Frontend: React + Vite + Tailwind CSS
- Architecture: Router → Service → Repository → Model

## Main Modules

1. Authentication and roles
2. Senior profile management
3. Exercise / yoga activities
4. Prayer / spiritual support
5. Medicine reminders
6. Daily check-ins
7. Emergency SOS alerts
8. Doctor / home-care requests
9. Caregiver dashboard

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Docker Setup

```bash
docker compose up --build
```

Backend: http://localhost:8000/docs  
Frontend: http://localhost:5173

## Architecture Rule

Routers do not contain database logic. They only accept requests and call services.
Services contain business rules.
Repositories contain SQLAlchemy queries.
Models define database tables.
