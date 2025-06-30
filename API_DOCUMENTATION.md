# Campus Crib Backend API Documentation

## Authentication Endpoints

### 1. Forgot Password

**Endpoint:** `POST /api/users/forgot-password`

**Description:** Initiates the password reset process by sending a reset token to the user's email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Request Headers:**
```
Content-Type: application/json
```

**Response Format:**

**Success Response (200):**
```json
{
  "message": "Password reset instructions sent to your email",
  "data": {
    "resetToken": "abc123def456ghi789..." // 64-character hex string
  },
  "status": 200
}
```

**Error Response (400):**
```json
{
  "message": "Email is required",
  "status": 400
}
```

**Error Response (400) - User not found:**
```json
{
  "message": "User with this email does not exist",
  "status": 400
}
```

**Notes:**
- The reset token is valid for 10 minutes
- In production, the reset token will be sent via email (currently returned in response for development)
- The reset token is a 64-character hexadecimal string

---

### 2. Reset Password

**Endpoint:** `POST /api/users/reset-password`

**Description:** Resets the user's password using the reset token received from the forgot password endpoint.

**Request Body:**
```json
{
  "resetToken": "abc123def456ghi789...",
  "newPassword": "newSecurePassword123"
}
```

**Request Headers:**
```
Content-Type: application/json
```

**Response Format:**

**Success Response (200):**
```json
{
  "message": "Password reset successfully",
  "data": null,
  "status": 200
}
```

**Error Response (400) - Missing fields:**
```json
{
  "message": "Reset token and new password are required",
  "status": 400
}
```

**Error Response (400) - Password too short:**
```json
{
  "message": "Password must be at least 6 characters long",
  "status": 400
}
```

**Error Response (400) - Invalid/expired token:**
```json
{
  "message": "Invalid or expired reset token",
  "status": 400
}
```

**Notes:**
- The new password must be at least 6 characters long
- The reset token must be valid and not expired (10-minute expiration)
- After successful password reset, the reset token is invalidated
- The user can then sign in with their new password

---

## Frontend Implementation Guide

### Forgot Password Flow:

1. **User enters email** in forgot password form
2. **Send POST request** to `/api/users/forgot-password` with email
3. **Handle response:**
   - If successful: Show success message and redirect to reset password page
   - If error: Display error message to user
4. **Store reset token** (from response data) for use in reset password step

### Reset Password Flow:

1. **User enters new password** (minimum 6 characters)
2. **Send POST request** to `/api/users/reset-password` with reset token and new password
3. **Handle response:**
   - If successful: Show success message and redirect to login page
   - If error: Display appropriate error message
4. **Clear stored reset token** after successful reset

### Example Frontend Code (JavaScript/TypeScript):

```javascript
// Forgot Password
const forgotPassword = async (email) => {
  try {
    const response = await fetch('/api/users/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    if (data.status === 200) {
      // Store reset token (in production, this would come via email)
      localStorage.setItem('resetToken', data.data.resetToken);
      alert('Password reset instructions sent to your email');
      // Redirect to reset password page
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
};

// Reset Password
const resetPassword = async (newPassword) => {
  try {
    const resetToken = localStorage.getItem('resetToken');
    
    if (!resetToken) {
      alert('Reset token not found. Please request a new password reset.');
      return;
    }
    
    const response = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        resetToken, 
        newPassword 
      })
    });
    
    const data = await response.json();
    
    if (data.status === 200) {
      localStorage.removeItem('resetToken'); // Clear stored token
      alert('Password reset successfully!');
      // Redirect to login page
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
};
```

### Important Notes for Frontend Development:

1. **Token Storage:** In production, the reset token will be sent via email, not returned in the API response
2. **Validation:** Implement client-side validation for email format and password length (minimum 6 characters)
3. **Error Handling:** Always display user-friendly error messages
4. **Security:** Never store sensitive information like passwords in localStorage
5. **UX:** Provide clear feedback to users about the status of their password reset request
6. **Token Expiration:** Handle cases where the reset token expires (10-minute window)

### Testing:

For development/testing purposes, the reset token is currently returned in the API response. In production, this will be removed and the token will only be sent via email.

---

## Base URL

Make sure to replace the base URL with your actual backend URL:
- Development: `http://localhost:3000` (or your dev server port)
- Production: `https://your-production-domain.com` 