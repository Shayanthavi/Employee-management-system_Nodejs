# Profile Feature Implementation Guide

## Overview
A comprehensive Profile page has been implemented with full backend and frontend integration, allowing users to:
- View their profile information
- Edit profile details (username, email, full name, phone, department, position, bio)
- Change their password securely
- View account activity history

## Database Migration

### Step 1: Run the SQL Migration
Before using the profile feature, you need to update the database schema to add the new profile fields.

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p employee_management < backend-nodejs/migrations/add_user_profile_fields.sql
```

**Option B: Using MySQL Workbench or phpMyAdmin**
1. Open MySQL Workbench or phpMyAdmin
2. Select your `employee_management` database
3. Open and execute the SQL file: `backend-nodejs/migrations/add_user_profile_fields.sql`

**Option C: Manual SQL Execution**
Run these SQL commands in your MySQL database:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS fullName VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS position VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

### Step 2: Verify Database Schema
After running the migration, verify the `users` table structure:
```sql
DESCRIBE users;
```

You should see the following columns:
- id (BIGINT)
- username (VARCHAR)
- password (VARCHAR)
- email (VARCHAR)
- fullName (VARCHAR) - NEW
- phone (VARCHAR) - NEW
- department (VARCHAR) - NEW
- position (VARCHAR) - NEW
- bio (TEXT) - NEW
- avatar (VARCHAR) - NEW
- createdAt (TIMESTAMP) - NEW
- updatedAt (TIMESTAMP) - NEW

## Backend Implementation

### New Files Created:
1. **`backend-nodejs/controllers/userController.js`**
   - `getProfile()` - Get current user profile
   - `updateProfile()` - Update user profile information
   - `changePassword()` - Change user password

2. **`backend-nodejs/routes/userRoutes.js`**
   - GET `/api/user/profile` - Fetch user profile
   - PATCH `/api/user/profile` - Update user profile
   - POST `/api/user/change-password` - Change password

3. **`backend-nodejs/migrations/add_user_profile_fields.sql`**
   - Database schema migration file

### Modified Files:
1. **`backend-nodejs/models/User.js`**
   - Added new fields: fullName, phone, department, position, bio, avatar, createdAt, updatedAt
   - Changed `timestamps: false` to `timestamps: true`

2. **`backend-nodejs/server.js`**
   - Added `userRoutes` import
   - Added `/api/user` route registration

## Frontend Implementation

### New/Modified Files:
1. **`frontend/src/pages/profile/Profile.js`** - Complete redesign with:
   - Profile information display with avatar
   - Editable profile form
   - Password change modal
   - Activity history tab
   - Loading states and error handling
   - Success/error notifications

2. **`frontend/src/pages/profile/Profile.css`** - Comprehensive styling:
   - Profile card design
   - Avatar styling
   - Form controls
   - Activity timeline
   - Responsive design
   - Color scheme matching the app theme (#135D66)

## Features

### 1. Profile Display
- Large circular avatar with user initial
- Display name (full name or username)
- Position and department badges
- Member since and last updated statistics
- Profile completeness indicator

### 2. Profile Editing
- Toggle edit mode with "Edit Profile" button
- Update username, email, full name, phone, department, position, and bio
- Form validation
- Save and cancel options
- Success/error notifications

### 3. Password Management
- Secure password change via modal dialog
- Current password verification
- New password confirmation
- Minimum 6-character requirement
- Clear error messaging

### 4. Activity History
- Profile creation timestamp
- Last profile update timestamp
- Visual timeline display

## API Endpoints

### GET `/api/user/profile`
**Authentication:** Required (JWT token)
**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john.doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "phone": "+1234567890",
    "department": "Engineering",
    "position": "Software Engineer",
    "bio": "Passionate developer...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### PATCH `/api/user/profile`
**Authentication:** Required (JWT token)
**Request Body:**
```json
{
  "username": "john.doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "department": "Engineering",
  "position": "Senior Software Engineer",
  "bio": "Updated bio..."
}
```
**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* updated user object */ }
}
```

### POST `/api/user/change-password`
**Authentication:** Required (JWT token)
**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## Usage

### Starting the Application

1. **Start Backend:**
   ```bash
   cd backend-nodejs
   npm install
   npm start
   ```
   Backend runs on: http://localhost:8080

2. **Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend runs on: http://localhost:3000

3. **Navigate to Profile:**
   - Login to the application
   - Click on "Profile" in the sidebar
   - View and edit your profile information

## Testing

1. **Test Profile Viewing:**
   - Login and navigate to Profile page
   - Verify all user information is displayed correctly

2. **Test Profile Editing:**
   - Click "Edit Profile" button
   - Modify fields and click "Save Changes"
   - Verify success message and updated data

3. **Test Password Change:**
   - Click "Change Password" button
   - Enter current and new passwords
   - Verify password change is successful

## Security Features

- **Authentication Required:** All profile endpoints require valid JWT token
- **Password Hashing:** Passwords are hashed using bcrypt before storage
- **Current Password Verification:** Password changes require current password
- **Data Validation:** Input validation on both frontend and backend
- **SQL Injection Prevention:** Using Sequelize ORM with parameterized queries

## Color Scheme

The profile page follows the application's color theme:
- Primary: `#135D66`
- Accent: `#77B0AA`
- Background: `#E3FEF7`
- Dark: `#003C43`

## Responsive Design

The profile page is fully responsive and works on:
- Desktop (large screens)
- Tablets (medium screens)
- Mobile devices (small screens)

## Future Enhancements

Potential improvements for future versions:
- Profile picture upload functionality
- Email verification
- Two-factor authentication
- Account deletion option
- Export profile data
- Privacy settings
- Social media links

## Troubleshooting

### Profile Not Loading
- Check if backend server is running
- Verify JWT token is valid
- Check browser console for errors
- Ensure database migration was successful

### Cannot Update Profile
- Verify all required fields are filled
- Check if username/email is already taken
- Ensure backend API is accessible
- Check network tab for API errors

### Password Change Fails
- Verify current password is correct
- Ensure new password meets requirements (min 6 characters)
- Check if passwords match
- Verify backend server is running

## Support

For issues or questions, please check:
1. Browser console for frontend errors
2. Backend console for server errors
3. Database connection and schema
4. Network tab for API request/response details
