-- Populate Sample Data for Employee Management System
-- This script adds approximately 20 records to each table

-- =============================================
-- Insert Sample Employees (20 employees)
-- =============================================
INSERT INTO employees (name, email, phone, department, salary, hire_date, status) VALUES
('John Smith', 'john.smith@company.com', '555-0101', 'Engineering', 75000, '2022-01-15', 'active'),
('Sarah Johnson', 'sarah.johnson@company.com', '555-0102', 'Marketing', 68000, '2022-02-20', 'active'),
('Michael Brown', 'michael.brown@company.com', '555-0103', 'Sales', 72000, '2022-03-10', 'active'),
('Emily Davis', 'emily.davis@company.com', '555-0104', 'Engineering', 78000, '2021-11-05', 'active'),
('David Wilson', 'david.wilson@company.com', '555-0105', 'HR', 65000, '2022-04-12', 'active'),
('Jennifer Martinez', 'jennifer.martinez@company.com', '555-0106', 'Finance', 80000, '2021-09-18', 'active'),
('James Anderson', 'james.anderson@company.com', '555-0107', 'Engineering', 76000, '2022-05-22', 'active'),
('Lisa Taylor', 'lisa.taylor@company.com', '555-0108', 'Marketing', 70000, '2022-06-30', 'active'),
('Robert Thomas', 'robert.thomas@company.com', '555-0109', 'Sales', 73000, '2022-01-25', 'active'),
('Maria Garcia', 'maria.garcia@company.com', '555-0110', 'Engineering', 77000, '2021-12-10', 'active'),
('William Lee', 'william.lee@company.com', '555-0111', 'IT', 82000, '2022-07-15', 'active'),
('Patricia White', 'patricia.white@company.com', '555-0112', 'HR', 67000, '2022-08-20', 'active'),
('Christopher Harris', 'christopher.harris@company.com', '555-0113', 'Finance', 79000, '2021-10-05', 'active'),
('Linda Clark', 'linda.clark@company.com', '555-0114', 'Marketing', 69000, '2022-09-12', 'active'),
('Daniel Lewis', 'daniel.lewis@company.com', '555-0115', 'Sales', 74000, '2022-02-28', 'active'),
('Barbara Robinson', 'barbara.robinson@company.com', '555-0116', 'Engineering', 81000, '2021-08-14', 'active'),
('Matthew Walker', 'matthew.walker@company.com', '555-0117', 'IT', 83000, '2022-10-18', 'active'),
('Susan Hall', 'susan.hall@company.com', '555-0118', 'HR', 66000, '2022-11-25', 'active'),
('Joseph Allen', 'joseph.allen@company.com', '555-0119', 'Finance', 78000, '2021-07-20', 'active'),
('Jessica Young', 'jessica.young@company.com', '555-0120', 'Marketing', 71000, '2022-12-05', 'active');

-- =============================================
-- Insert Sample Attendance Records (20 records)
-- =============================================
INSERT INTO attendance (employee_id, employee_name, date, status) VALUES
(1, 'John Smith', '2025-10-28', 'Present'),
(2, 'Sarah Johnson', '2025-10-28', 'Present'),
(3, 'Michael Brown', '2025-10-28', 'Present'),
(4, 'Emily Davis', '2025-10-28', 'Absent'),
(5, 'David Wilson', '2025-10-28', 'Present'),
(6, 'Jennifer Martinez', '2025-10-28', 'Present'),
(7, 'James Anderson', '2025-10-28', 'Present'),
(8, 'Lisa Taylor', '2025-10-28', 'Leave'),
(9, 'Robert Thomas', '2025-10-28', 'Present'),
(10, 'Maria Garcia', '2025-10-28', 'Present'),
(1, 'John Smith', '2025-10-29', 'Present'),
(2, 'Sarah Johnson', '2025-10-29', 'Present'),
(3, 'Michael Brown', '2025-10-29', 'Absent'),
(4, 'Emily Davis', '2025-10-29', 'Present'),
(5, 'David Wilson', '2025-10-29', 'Present'),
(6, 'Jennifer Martinez', '2025-10-29', 'Leave'),
(7, 'James Anderson', '2025-10-29', 'Present'),
(8, 'Lisa Taylor', '2025-10-29', 'Present'),
(9, 'Robert Thomas', '2025-10-29', 'Present'),
(10, 'Maria Garcia', '2025-10-29', 'Present');

-- =============================================
-- Insert Sample Leave Requests (20 records)
-- =============================================
INSERT INTO leave_requests (employee_id, employee_name, start_date, end_date, reason, status) VALUES
(1, 'John Smith', '2025-11-05', '2025-11-07', 'Vacation', 'Approved'),
(2, 'Sarah Johnson', '2025-11-10', '2025-11-12', 'Personal', 'Pending'),
(3, 'Michael Brown', '2025-10-25', '2025-10-26', 'Sick Leave', 'Approved'),
(4, 'Emily Davis', '2025-11-15', '2025-11-18', 'Family Emergency', 'Pending'),
(5, 'David Wilson', '2025-12-01', '2025-12-05', 'Vacation', 'Pending'),
(6, 'Jennifer Martinez', '2025-10-28', '2025-10-29', 'Medical Appointment', 'Approved'),
(7, 'James Anderson', '2025-11-20', '2025-11-22', 'Personal', 'Pending'),
(8, 'Lisa Taylor', '2025-10-30', '2025-10-31', 'Sick Leave', 'Approved'),
(9, 'Robert Thomas', '2025-11-08', '2025-11-10', 'Vacation', 'Approved'),
(10, 'Maria Garcia', '2025-12-10', '2025-12-15', 'Wedding', 'Pending'),
(11, 'William Lee', '2025-11-01', '2025-11-03', 'Personal', 'Approved'),
(12, 'Patricia White', '2025-11-12', '2025-11-14', 'Family Event', 'Pending'),
(13, 'Christopher Harris', '2025-10-27', '2025-10-28', 'Sick Leave', 'Approved'),
(14, 'Linda Clark', '2025-11-25', '2025-11-27', 'Vacation', 'Pending'),
(15, 'Daniel Lewis', '2025-12-05', '2025-12-07', 'Medical Leave', 'Pending'),
(16, 'Barbara Robinson', '2025-11-18', '2025-11-20', 'Personal', 'Approved'),
(17, 'Matthew Walker', '2025-10-31', '2025-11-01', 'Sick Leave', 'Approved'),
(18, 'Susan Hall', '2025-11-22', '2025-11-24', 'Vacation', 'Pending'),
(19, 'Joseph Allen', '2025-12-08', '2025-12-10', 'Family Emergency', 'Pending'),
(20, 'Jessica Young', '2025-11-28', '2025-11-30', 'Personal', 'Pending');

-- =============================================
-- Insert Sample Departments (if departments table exists)
-- =============================================
-- Uncomment if you have a departments table
-- INSERT INTO departments (name, description) VALUES
-- ('Engineering', 'Software Development and Technical Teams'),
-- ('Marketing', 'Marketing and Communications'),
-- ('Sales', 'Sales and Business Development'),
-- ('HR', 'Human Resources'),
-- ('Finance', 'Finance and Accounting'),
-- ('IT', 'Information Technology Support');

COMMIT;
