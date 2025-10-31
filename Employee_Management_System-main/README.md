# 🏢 Employee Management System

A full-stack web application for managing employees, departments, attendance, and leave requests.

## 🎯 Overview

This Employee Management System has been **migrated from Spring Boot to Node.js** while keeping the React frontend intact. It provides a complete solution for HR management with authentication, CRUD operations, and data visualization.

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based login and registration
- 👥 **Employee Management** - Add, edit, delete, and view employee records
- 🏛️ **Department Management** - Organize employees by departments
- 📅 **Attendance Tracking** - Record and monitor employee attendance
- 🌴 **Leave Management** - Handle leave requests with approval workflow
- 📊 **Dashboard** - Visual analytics and statistics
- 🎨 **Modern UI** - Responsive design with React and Bootstrap

## 🛠️ Tech Stack

### Backend (Node.js)
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password encryption

### Frontend (React)
- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Bootstrap** - Styling
- **Recharts** - Data visualization

## 📦 Project Structure

```
Employee_Management_System/
│
├── backend-nodejs/          # Node.js Backend
│   ├── config/             # Database config
│   ├── controllers/        # Business logic
│   ├── models/            # Database models
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth middleware
│   └── server.js          # Entry point
│
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── App.js        # Main app
│   └── public/
│
├── SETUP_GUIDE.md        # Detailed setup instructions
├── START_HERE.bat        # Quick start script
└── README.md             # This file
```

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)

Simply double-click `START_HERE.bat` to:
1. Install all dependencies
2. Start the backend server
3. Start the frontend application

### Option 2: Manual Setup

#### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm

#### 1. Database Setup
```sql
CREATE DATABASE employee;
```

#### 2. Backend Setup
```bash
cd backend-nodejs
npm install
npm start
```
Backend runs on: `http://localhost:8080`

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

## 📖 Detailed Documentation

For comprehensive setup instructions, troubleshooting, and API documentation, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 🔑 Default Configuration

### Database
- Host: `localhost`
- Port: `3306`
- Database: `employee`
- Username: `root`
- Password: `Saya@1307` (update in `.env`)

### Servers
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

## 📡 API Endpoints

### Authentication
```
POST /api/auth/register  - Register new user
POST /api/auth/login     - Login user
```

### Employees
```
GET    /api/employees      - Get all employees
GET    /api/employee/:id   - Get employee by ID
POST   /api/employee       - Create employee
PATCH  /api/employee/:id   - Update employee
DELETE /api/employee/:id   - Delete employee
```

### Departments
```
GET  /api/departments  - Get all departments
POST /api/departments  - Create department
```

### Attendance
```
GET    /api/attendance      - Get all attendance
GET    /api/attendance/:id  - Get attendance by ID
POST   /api/attendance      - Create attendance
PATCH  /api/attendance/:id  - Update attendance
DELETE /api/attendance/:id  - Delete attendance
```

### Leave Requests
```
GET    /api/leave      - Get all leave requests
GET    /api/leave/:id  - Get leave by ID
POST   /api/leave      - Create leave request
PATCH  /api/leave/:id  - Update leave request
DELETE /api/leave/:id  - Delete leave request
```

## 🎨 Screenshots

### Login Page
User authentication with JWT tokens

### Dashboard
Overview of employees, departments, and statistics

### Employee Management
Add, edit, and delete employee records

### Attendance Tracking
Mark and monitor employee attendance

### Leave Management
Submit and approve leave requests

## 🔧 Configuration

### Backend (.env)
```env
PORT=8080
DB_HOST=localhost
DB_NAME=employee
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

### Frontend (api.js)
```javascript
const API_URL = 'http://localhost:8080/api';
```

## 🧪 Testing

1. Register a new user account
2. Login with credentials
3. Test all CRUD operations:
   - Create employees
   - Add departments
   - Mark attendance
   - Submit leave requests

## 📝 Migration Notes

### What Changed?
- ✅ Backend: Spring Boot → Node.js/Express
- ✅ ORM: JPA/Hibernate → Sequelize
- ✅ Same database schema (MySQL)
- ✅ Same API endpoints
- ✅ Frontend unchanged

### Why Node.js?
- Faster development
- JavaScript full-stack
- Better async handling
- Rich npm ecosystem
- Easier deployment

## 🐛 Troubleshooting

### Backend Issues
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify port 8080 is available

### Frontend Issues
- Clear browser cache
- Check API URL in `services/api.js`
- Ensure backend is running

### Database Issues
- Create database: `CREATE DATABASE employee;`
- Check MySQL service status
- Verify user permissions

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [React Documentation](https://react.dev/)
- [JWT Authentication](https://jwt.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Developed as part of an internship project - Employee Management System

## 🙏 Acknowledgments

- Original Spring Boot version
- React community
- Express.js team
- Sequelize contributors

## 📞 Support

For issues and questions:
1. Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. Review console logs
3. Verify all prerequisites
4. Check database connection

---

**Made with ❤️ using Node.js and React**

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure database
3. ✅ Start backend server
4. ✅ Start frontend application
5. ✅ Test the system
6. 🗑️ Delete old `backendem` folder

**Ready to go! 🚀**
