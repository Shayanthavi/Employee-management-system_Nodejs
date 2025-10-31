-- Migration script to add status column to employee table
-- Run this SQL script on your MySQL database if the status column doesn't exist

-- Add status column to employee table
ALTER TABLE employee 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' 
AFTER department;

-- Update existing employees to have 'active' status
UPDATE employee 
SET status = 'active' 
WHERE status IS NULL;

-- Verify the changes
SELECT * FROM employee LIMIT 5;
