# Sukudha Academy Backend API

Backend API for Sukudha Academy - Course Management System built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Courses Management** - CRUD operations for courses
- **Instructors Management** - CRUD operations for instructors
- **Contact Information** - Manage company contact details
- **Overview Dashboard** - Get statistics and analytics
- **Swagger Documentation** - Auto-generated API docs
- **CORS Enabled** - Accessible from any origin
- **Validation** - Request validation using express-validator
- **Pagination** - Built-in pagination support

## 📁 Project Structure

```
SUKUHADHA-ACADEMY-BACKEND/
├── db/
│   └── connection.js           # MongoDB connection
├── features/
│   ├── courses/
│   │   ├── course.schema.js
│   │   ├── course.validation.js
│   │   ├── course.service.js
│   │   ├── course.middleware.js
│   │   └── course.routes.js
│   ├── instructors/
│   │   ├── instructor.schema.js
│   │   ├── instructor.validation.js
│   │   ├── instructor.service.js
│   │   ├── instructor.middleware.js
│   │   └── instructor.routes.js
│   ├── contact-info/
│   │   ├── contact-info.schema.js
│   │   ├── contact-info.validation.js
│   │   ├── contact-info.service.js
│   │   ├── contact-info.middleware.js
│   │   └── contact-info.routes.js
│   ├── overview/
│   │   └── overview.routes.js
│   └── transactions/
│       └── transaction.schema.js
├── routes/
│   └── index.js                # Centralized routes
├── utils/
│   ├── constants.js
│   ├── status-codes.js
│   ├── error-messages.js
│   └── pagination.js
├── .env
├── .gitignore
├── package.json
├── server.js                   # Entry point
└── swagger.js                  # Swagger configuration

```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment**
The `.env` file is already created with default values:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sukudha-academy
JWT_SECRET=sukudha_academy_secret_key_2026_change_in_production
JWT_EXPIRE=7d
ALLOWED_ORIGINS=*
```

3. **Generate Swagger Documentation**
```bash
npm run swagger
```

4. **Start the Server**

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Courses
- `GET /api/courses` - Get all courses (with pagination & filters)
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/courses/stats` - Get course statistics

### Instructors
- `GET /api/instructors` - Get all instructors (with pagination & filters)
- `GET /api/instructors/:id` - Get instructor by ID
- `POST /api/instructors` - Create new instructor
- `PUT /api/instructors/:id` - Update instructor
- `DELETE /api/instructors/:id` - Delete instructor
- `GET /api/instructors/stats` - Get instructor statistics

### Contact Info
- `GET /api/contact-info` - Get contact information
- `PUT /api/contact-info` - Update contact information

### Overview
- `GET /api/overview` - Get dashboard overview statistics

### Health Check
- `GET /api/health` - API health check

## 📖 API Documentation

Once the server is running, access the Swagger documentation at:
```
http://localhost:5000/api-docs
```

## 🔍 Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Courses Filters
- `category` - Filter by category
- `level` - Filter by level (Beginner, Intermediate, Advanced)
- `instructorId` - Filter by instructor ID
- `bestseller` - Filter bestsellers (true/false)
- `free` - Filter free courses (true/false)

### Instructors Filters
- `role` - Filter by role

## 📝 Example Requests

### Create a Course
```bash
POST http://localhost:5000/api/courses
Content-Type: application/json

{
  "id": "web-dev-101",
  "title": "Web Development Fundamentals",
  "category": "Web Development",
  "level": "Beginner",
  "price": 29999,
  "originalPrice": 49999,
  "instructor": "John Doe",
  "instructorId": "instructor-001",
  "duration": "30h",
  "lectures": 120,
  "description": "Learn web development from scratch",
  "rating": 4.5,
  "reviews": 100,
  "students": 500,
  "highlights": ["HTML", "CSS", "JavaScript"],
  "bestseller": false,
  "free": false
}
```

### Get All Courses with Filters
```bash
GET http://localhost:5000/api/courses?page=1&limit=10&category=Web Development&level=Beginner
```

### Update Contact Info
```bash
PUT http://localhost:5000/api/contact-info
Content-Type: application/json

{
  "email": "contact@sukudhaedu.com",
  "phone": "1234567890",
  "address": "New Address"
}
```

## 🔒 CORS Configuration

CORS is configured to allow all origins (`*`). This means the API can be accessed from any frontend application.

## 🐛 Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## 📊 Database Schema

### Course Schema
- id, title, slug, category, level
- rating, reviews, students
- price, originalPrice
- instructor, instructorId
- duration, lectures
- description, highlights, curriculum
- bestseller, free
- timestamps

### Instructor Schema
- id, name, role, bio
- color, rating
- courses, students
- specializations
- social (linkedin, twitter, website)
- image
- timestamps

### Contact Info Schema
- companyName, companyLegalName, description
- email, phone, phoneLabel
- phone2, phone2Label
- address, floor, city, state, zip
- supportEmail, salesEmail
- officeHours (weekdays, weekend)
- timestamps

## 🚀 Deployment

For production deployment:

1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use a process manager like PM2
4. Set up MongoDB Atlas or production MongoDB instance
5. Configure proper CORS origins

## 📄 License

MIT

## 👨‍💻 Author

Sukudha Academy Team

---

**Note:** Make sure MongoDB is running before starting the server!
