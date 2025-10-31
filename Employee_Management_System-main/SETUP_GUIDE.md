# Employee Management System - Complete Setup Guide

This guide will help you set up and run the Employee Management System with the new Node.js backend.

## 🎯 What Changed?

- ✅ **Backend migrated from Spring Boot (Java) to Node.js (Express)**
- ✅ **Frontend remains unchanged (React)**
- ✅ **Database remains MySQL**
- ✅ **All APIs are compatible with the existing frontend**

## 📋 Prerequisites

Before starting, ensure you have:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
3. **npm** (comes with Node.js)

## 🚀 Step-by-Step Setup

### Step 1: Database Setup

1. Start MySQL server
2. Create the database (if not exists):

```sql
CREATE DATABASE IF NOT EXISTS employee;
```

3. Update database credentials in `backend-nodejs/.env` if needed:
   - Default username: `root`
   - Default password: `Saya@1307`
   - Default database: `employee`

### Step 2: Backend Setup (Node.js)

1. Open terminal and navigate to the backend directory:
```bash
cd backend-nodejs
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

Or for development mode with auto-reload:
```bash
npm run dev
```

4. Verify the server is running:
   - You should see: `✅ Database connected successfully`
   - Server will run on: `http://localhost:8080`
   - Test health endpoint: `http://localhost:8080/health`

### Step 3: Frontend Setup (React)

1. Open a **new terminal** and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

4. The application will open automatically in your browser at `http://localhost:3000`

## 🎉 You're Done!

The application should now be fully functional with:
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:3000`

## 🧪 Testing the Application

1. **Register a new user:**
   - Go to the registration page
   - Create an account with username, email, and password

2. **Login:**
   - Use your credentials to log in
   - You'll receive a JWT token for authentication

3. **Test features:**
   - ✅ Add/Edit/Delete Employees
   - ✅ Manage Departments
   - ✅ Track Attendance
   - ✅ Handle Leave Requests

## 📁 Project Structure

```
Employee_Management_System-main/
├── backend-nodejs/          # NEW Node.js Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── middleware/        # JWT authentication
│   ├── .env               # Environment variables
│   ├── server.js          # Main server file
│   └── package.json       # Dependencies
│
├── frontend/              # React Frontend (unchanged)
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backendem/            # OLD Spring Boot (can be deleted)
```

## 🗑️ Removing Old Spring Boot Backend

Once you've verified everything works, you can safely delete the old Spring Boot backend:

```bash
# From the root directory
rm -rf backendem
```

Or manually delete the `backendem` folder.

## 🔧 Configuration

### Backend Configuration (.env)

```env
PORT=8080
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=employee
DB_USER=root
DB_PASSWORD=Saya@1307
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000
```

### Frontend Configuration

The frontend is already configured to connect to `http://localhost:8080/api`

No changes needed in the frontend!

## 🐛 Troubleshooting

### Backend won't start

1. **Database connection error:**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists: `CREATE DATABASE employee;`

2. **Port already in use:**
   - Change PORT in `.env` to a different port (e.g., 8081)
   - Update frontend API URL in `frontend/src/services/api.js`

3. **Module not found:**
   - Run `npm install` in backend-nodejs directory

### Frontend issues

1. **Cannot connect to backend:**
   - Ensure backend is running on port 8080
   - Check browser console for CORS errors
   - Verify API_URL in `frontend/src/services/api.js`

2. **Dependencies error:**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

## 📊 API Endpoints

All endpoints are available at `http://localhost:8080/api`

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Employees
- `GET /api/employees` - List all
- `POST /api/employee` - Create
- `GET /api/employee/:id` - Get by ID
- `PATCH /api/employee/:id` - Update
- `DELETE /api/employee/:id` - Delete

### Departments
- `GET /api/departments` - List all
- `POST /api/departments` - Create

### Attendance
- `GET /api/attendance` - List all
- `POST /api/attendance` - Create
- `GET /api/attendance/:id` - Get by ID
- `PATCH /api/attendance/:id` - Update
- `DELETE /api/attendance/:id` - Delete

### Leave Requests
- `GET /api/leave` - List all
- `POST /api/leave` - Create
- `GET /api/leave/:id` - Get by ID
- `PATCH /api/leave/:id` - Update
- `DELETE /api/leave/:id` - Delete

## 💡 Tips

1. **Development Mode:** Use `npm run dev` for auto-reload during development
2. **Database Tables:** Tables are auto-created when the server starts
3. **JWT Tokens:** Tokens expire after 24 hours
4. **CORS:** Currently allows all origins (configure for production)

## 🎓 What You Learned

- ✅ Migrated from Spring Boot to Node.js
- ✅ Used Express.js for REST API
- ✅ Implemented Sequelize ORM for MySQL
- ✅ JWT authentication with bcrypt password hashing
- ✅ Maintained API compatibility with existing frontend

## 📞 Need Help?

If you encounter any issues:
1. Check the console logs in both backend and frontend terminals
2. Verify all prerequisites are installed
3. Ensure MySQL is running and accessible
4. Check that ports 3000 and 8080 are available

---

**Happy Coding! 🚀**
