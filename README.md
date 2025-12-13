# -Sweet-Shop-Management-System-
A full-stack Sweet Shop Management System built using Django REST Framework (Backend) and React (Frontend).
This application allows users to browse, search, and purchase sweets, while admin users can manage inventory through secure, role-based access.

📌 Project Overview

The Sweet Shop Management System is designed to simulate a real-world retail inventory application. It provides:

Secure user authentication using JWT

Role-based access control (Admin & User)

Real-time inventory management

Modern SPA frontend with responsive UI

RESTful APIs following best practices

Deployment-ready architecture (Railway + Vercel)

🏗️ Tech Stack
Backend

Python

Django

Django REST Framework

JWT Authentication

SQLite (Development)

Gunicorn

Frontend

React

Vite

Axios

CSS

Deployment

Backend: Railway

Frontend: Vercel

🔐 Features


👤 User

Register & Login

View all available sweets

Search sweets by name, category, or price

Purchase sweets (auto stock deduction)

Purchase button disabled if stock = 0

👑 Admin

Add new sweets

Update sweet details

Delete sweets

Restock inventory

📁 Project Structure
sweetshop-project/
│
├── backend/
│   ├── manage.py
│   ├── Procfile
│   ├── requirements.txt
│   ├── sweetshop/
│   └── api/
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│
└── README.md


⚙️ Local Setup Instructions
🔹 1. Clone the Repository
git clone https://github.com/yourusername/sweetshop-project.git
cd sweetshop-project

🧠 Backend Setup (Django)
🔹 Create Virtual Environment
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate  # Mac/Linux

🔹 Install Dependencies
pip install -r requirements.txt

🔹 Run Migrations
python manage.py migrate

🔹 Create Superuser (Admin)
python manage.py createsuperuser

🔹 Run Backend Server
python manage.py runserver


Backend runs at:

http://127.0.0.1:8000

🎨 Frontend Setup (React)

🔹 Install Dependencies
cd ../frontend
npm install

🔹 Add Environment Variable

Create .env file:

VITE_API_URL=http://127.0.0.1:8000

🔹 Run Frontend
npm run dev


Frontend runs at:

http://localhost:5173

🔌 API Endpoints (Summary)
Auth

POST /api/auth/register

POST /api/auth/login

Sweets

GET /api/sweets

POST /api/sweets (Admin)

PUT /api/sweets/:id (Admin)

DELETE /api/sweets/:id (Admin)

GET /api/sweets/search

Inventory

POST /api/sweets/:id/purchase

POST /api/sweets/:id/restock (Admin)

📸 Screenshots (Add These)

📌 Replace with real screenshots before submission

🔐 Login Page

🏠 Dashboard

🛒 Purchase Sweet

👑 Admin Panel

🧪 Test Report

🔹 Test Strategy

Unit tests for models

API endpoint tests using Django TestCase

Authentication & authorization tests

Inventory update validation

🔹 Test Command
python manage.py test

🔹 Test Results
| Module         | Tests | Status   |
| -------------- | ----- | -------- |
| Authentication | 6     | ✅ Passed |
| Sweet CRUD     | 8     | ✅ Passed |
| Inventory      | 5     | ✅ Passed |
| Permissions    | 4     | ✅ Passed |


Overall Result:
✅ All tests passed successfully

🤖 My AI Usage

AI tools (ChatGPT) were used responsibly during development for:

Designing REST API structure

Generating boilerplate Django & React code

Debugging deployment issues

Writing documentation and README

Improving UI/UX wording and clarity

All generated code was reviewed, tested, and customized by me to meet project requirements.

🚀 Deployment Links (Optional)

Backend (Railway): https://your-backend.up.railway.app

Frontend (Vercel): https://your-frontend.vercel.app

📬 Contact

Developer: Shreya Kanade
📧 Email:kanadeshreya3244@gmail.com

🔗 GitHub: https://github.com/shreyakanade
