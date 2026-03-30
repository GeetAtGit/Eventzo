# 🎉 Eventzo – Event Management System

A full-stack microservices-based **Event Management Platform** built using **React, Node.js, Express, MongoDB, and Spring Boot**.

---

## 🚀 Project Overview

Eventzo simplifies event planning by providing:

- Event & venue browsing  
- Booking management  
- Budget and expense tracking  
- Admin dashboard with analytics  

The system is designed using a **microservices architecture** for scalability and modularity.

---

## 🧱 Architecture

### 🔹 Microservices

| Service | Tech | Port | Description |
|--------|------|------|------------|
| Auth Service | Node.js | 5001 | Authentication & JWT |
| Catalog Service | Node.js | 5002 | Events & Venues |
| Booking Service | Node.js | 5003 | Booking logic |
| Budget Service | Spring Boot | 8081 | Budget & Expenses |
| Frontend | React (Vite) | 5173 | UI |

---

## 🛠️ Tech Stack

### Frontend
- React + Vite  
- Tailwind CSS  
- Axios  

### Backend
- Node.js + Express  
- MongoDB Atlas  
- JWT Authentication  

### Microservice (Budget)
- Spring Boot (Java 21)  
- MongoDB  

### DevOps
- Docker  
- Docker Compose  

---

## ✨ Features

### 🔐 Authentication
- User registration & login  
- JWT-based authorization  
- Role-based access (Admin/User)  

### 📅 Events & Venues
- Browse events and venues  
- Admin CRUD operations  

### 🧾 Booking System
- Event & venue booking  
- Booking history  
- Revenue tracking  

### 💰 Budget Service (Spring Boot)
- Create event budget  
- Add categorized expenses  
- Track spent & remaining amount  
- Prevent overspending  

### 📊 Admin Dashboard
- Total users, events, bookings  
- Revenue analytics  
- Booking status tracking  
- Expense charts visualization  

### ✅ Validation
- Email & strong password validation (frontend)  
- Form validations across modules  

---

## 🧪 Testing

### Functional Testing
- All core flows tested:
  - Authentication  
  - Event & venue management  
  - Booking system  
  - Budget & expense tracking  
  - Dashboard analytics  

### API Testing
- Postman collection created  
- Status codes validated  
- JWT-protected endpoints tested  

### UI Testing
- Form validation  
- Navigation flows  
- Dashboard & charts  
- Screenshot-based validation  

---

## 🐳 Docker Setup

### 🔹 Prerequisites
- Docker installed  
- Docker Compose installed  

---

### 🔹 Run the project

```bash
docker compose up --build

```

---

🔹 Services will run on:

```
Frontend → http://localhost:5173
Auth → http://localhost:5001
Catalog → http://localhost:5002
Booking → http://localhost:5003
Budget → http://localhost:8081
```
---
🔹 Stop containers
```
docker compose down
```
---
🔑 Environment Variables

Each service uses its own .env file.

Example (Auth Service)
```
PORT=5001
JWT_SECRET=your_secret
MONGO_URI=your_mongodb_uri
```
---
Budget Service
```
SERVER_PORT=8081
SPRING_DATA_MONGODB_URI=your_mongodb_uri
```
---
📡 API Endpoints
Auth

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
  
   Events
  
- GET /api/events
- POST /api/events

 Venues
 
- GET /api/venues
- POST /api/venues
  
 Bookings

- POST /api/bookings
- GET /api/bookings/my
  
 Budget Service
 
- POST /api/budgets
- GET /api/budgets/event/{eventId}
- POST /api/budgets/expense
- GET /api/budgets/expenses/event/{eventId}
---
⭐ Project Highlights

- Microservices architecture
- Full-stack implementation
- Real-time budget tracking
- Dashboard analytics with charts
- Dockerized deployment


