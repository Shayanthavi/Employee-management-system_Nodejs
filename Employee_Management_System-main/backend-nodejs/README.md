# Employee Management System - Node.js Backend

This is the Node.js backend for the Employee Management System, migrated from Spring Boot.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Features

- User authentication (Register/Login) with JWT
- Employee CRUD operations
- Department management
- Attendance tracking
- Leave request management

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend-nodejs
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env` file and update the database credentials if needed
   - Default database: `employee`
   - Default port: `8080`

4. Make sure MySQL is running and the database exists:
```sql
CREATE DATABASE IF NOT EXISTS employee;
```

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employee/:id` - Get employee by ID
- `POST /api/employee` - Create new employee
- `PATCH /api/employee/:id` - Update employee
- `DELETE /api/employee/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Add new department

### Attendance
- `GET /api/attendance` - Get all attendance records
- `GET /api/attendance/:id` - Get attendance by ID
- `POST /api/attendance` - Create attendance record
- `PATCH /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance

### Leave Requests
- `GET /api/leave` - Get all leave requests
- `GET /api/leave/:id` - Get leave by ID
- `POST /api/leave` - Create leave request
- `PATCH /api/leave/:id` - Update leave request
- `DELETE /api/leave/:id` - Delete leave request

## Database Schema

The application will automatically create/update the following tables:
- `users` - User authentication
- `employee` - Employee information
- `department` - Department data
- `attendance` - Attendance records
- `leave_request` - Leave requests

## Environment Variables

```env
PORT=8080
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=employee
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000
```

## Notes

- The database tables will be automatically created/synced when the server starts
- JWT tokens expire after 24 hours
- All API responses follow a consistent format with `success`, `message`, and `data` fields
- CORS is enabled for all origins (configure as needed for production)
