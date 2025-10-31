# Quick Start Guide - Updated Features

## 🎯 What's New

1. **Logout Button Fixed** - Now properly navigates to login page
2. **Dynamic Layout** - Header and content move with sidebar collapse/expand
3. **Real Database Data** - Dashboard shows live data from MySQL

---

## 🚀 Quick Start

### Step 1: Database Migration (One-time setup)

If your `employee` table doesn't have a `status` column, run this:

```bash
mysql -u root -p employee_management < backend-nodejs/migrations/add_status_column.sql
```

*Replace `root` with your MySQL username and `employee_management` with your database name.*

---

### Step 2: Start Backend

```bash
cd backend-nodejs
npm start
```

You should see:
```
🚀 Server is running on port 8080
📍 API URL: http://localhost:8080
🏥 Health check: http://localhost:8080/health
```

---

### Step 3: Start Frontend

Open a new terminal:

```bash
cd frontend
npm start
```

Frontend will open at: http://localhost:3000

---

## ✅ Test the New Features

### 1. Test Logout
- Click the **Logout** button in the sidebar (bottom)
- Should immediately navigate to login page
- Try logging in again - should work perfectly

### 2. Test Sidebar Movement
- Click the **EmployeeMS** logo/icon to toggle sidebar
- Watch the header and main content smoothly move
- **Expanded state:** Full sidebar with labels
- **Collapsed state:** Icons only, more screen space

### 3. Test Dashboard Data
- Go to Dashboard
- Should see real counts from database:
  - Total Employees
  - Active Employees
  - Today's Attendance
  - Total Leave Requests
  - Pending Leave Requests
- Scroll down to see:
  - Recent Attendance table
  - Recent Leave Requests table
  - Employees on Leave Today
  - Attendance Trend chart

---

## 🎨 Visual Features

- **Same Colors:** Your beautiful teal theme (#003C43, #135D66, #77B0AA, #E3FEF7)
- **Smooth Animations:** All transitions are smooth and professional
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Modern Cards:** Glassmorphism effects with clean shadows

---

## 🔧 Troubleshooting

### Issue: Logout button doesn't work
- **Check:** Browser console (F12) for errors
- **Fix:** Clear localStorage: `localStorage.clear()` in console

### Issue: Dashboard shows no data
- **Check:** Backend is running (http://localhost:8080/health)
- **Check:** Database has data in employee, attendance, leave_request tables
- **Fix:** Add test data to database

### Issue: Sidebar doesn't move header
- **Check:** Browser console for React errors
- **Fix:** Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: "status column doesn't exist" error
- **Fix:** Run the migration script (Step 1 above)

---

## 📊 Sample Data (Optional)

If you need test data, run these SQL commands:

```sql
-- Add sample employees
INSERT INTO employee (name, email, phone, department, status) VALUES
('John Doe', 'john@example.com', '1234567890', 'IT', 'active'),
('Jane Smith', 'jane@example.com', '0987654321', 'HR', 'active'),
('Bob Johnson', 'bob@example.com', '1112223333', 'Finance', 'active');

-- Add sample attendance (today's date)
INSERT INTO attendance (employee_name, date, status) VALUES
('John Doe', CURDATE(), 'Present'),
('Jane Smith', CURDATE(), 'Present');

-- Add sample leave requests
INSERT INTO leave_request (employee_name, start_date, end_date, reason, status) VALUES
('Bob Johnson', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Vacation', 'Pending'),
('John Doe', DATE_ADD(CURDATE(), INTERVAL 7 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'Medical', 'Approved');
```

---

## 📱 Mobile Testing

1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select a mobile device
4. Test sidebar, navigation, and dashboard

---

## 🎓 Key Endpoints

- **Login:** POST `/api/auth/login`
- **Employees:** GET `/api/employees`
- **Attendance:** GET `/api/attendance`
- **Leave:** GET `/api/leave`
- **Dashboard Stats:** GET `/api/dashboard/stats` *(NEW)*
- **Quick Summary:** GET `/api/dashboard/summary` *(NEW)*

---

## ✨ Next Steps

Now that everything is working:

1. **Customize** - Add your own branding/logo
2. **Extend** - Add more features (reports, charts)
3. **Deploy** - Deploy to production server
4. **Secure** - Add authentication middleware to protected routes

---

## 📞 Need Help?

Check these files for detailed information:
- `IMPLEMENTATION_DETAILS.md` - Full technical documentation
- `README.md` - Project overview
- `TESTING_GUIDE.md` - Testing procedures

---

**Enjoy your updated Employee Management System! 🚀**
