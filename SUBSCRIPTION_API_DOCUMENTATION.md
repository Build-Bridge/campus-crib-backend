# Campus Crib Subscription System API Documentation

## Overview

The Campus Crib subscription system provides three tiers of subscription plans for hostel agents:

- **Basic Plan** (Free): Up to 3 hostels, basic features
- **Pro Plan** (₦3,000/month): Up to 15 hostels, priority listing, analytics
- **Elite Plan** (₦7,000/month): Unlimited hostels, all premium features

## Authentication

All subscription endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Subscription Plans

### Get Available Plans
```
GET /subscriptions/plans
```

**Response:**
```json
{
  "success": true,
  "message": "Available subscription plans",
  "payload": {
    "BASIC": {
      "name": "Basic Plan",
      "price": 0,
      "currency": "NGN",
      "features": {
        "maxHostels": 3,
        "priorityListing": false,
        "analytics": false,
        "instantAlerts": false,
        "featuredBadge": false,
        "customProfile": false,
        "promoCodes": false,
        "pushNotifications": false,
        "phoneSupport": false,
        "earlyAccess": false
      }
    },
    "PRO": {
      "name": "Pro Plan",
      "price": 3000,
      "currency": "NGN",
      "features": {
        "maxHostels": 15,
        "priorityListing": true,
        "analytics": true,
        "instantAlerts": true,
        "featuredBadge": true,
        "customProfile": true,
        "promoCodes": false,
        "pushNotifications": false,
        "phoneSupport": false,
        "earlyAccess": false
      }
    },
    "ELITE": {
      "name": "Elite Plan",
      "price": 7000,
      "currency": "NGN",
      "features": {
        "maxHostels": -1,
        "priorityListing": true,
        "analytics": true,
        "instantAlerts": true,
        "featuredBadge": true,
        "customProfile": true,
        "promoCodes": true,
        "pushNotifications": true,
        "phoneSupport": true,
        "earlyAccess": true
      }
    }
  }
}
```

## Subscription Management

### Create Subscription
```
POST /subscriptions/subscribe
```

**Request Body:**
```json
{
  "plan": "PRO"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to Pro Plan",
  "payload": {
    "_id": "subscription_id",
    "user": "user_id",
    "plan": "PRO",
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-02-01T00:00:00.000Z",
    "amount": 3000,
    "currency": "NGN",
    "features": {
      "maxHostels": 15,
      "priorityListing": true,
      "analytics": true,
      "instantAlerts": true,
      "featuredBadge": true,
      "customProfile": true,
      "promoCodes": false,
      "pushNotifications": false,
      "phoneSupport": false,
      "earlyAccess": false
    }
  }
}
```

### Get Current Subscription
```
GET /subscriptions/current
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription retrieved successfully",
  "payload": {
    "_id": "subscription_id",
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "plan": "PRO",
    "status": "active",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-02-01T00:00:00.000Z",
    "amount": 3000,
    "currency": "NGN",
    "features": {
      "maxHostels": 15,
      "priorityListing": true,
      "analytics": true,
      "instantAlerts": true,
      "featuredBadge": true,
      "customProfile": true,
      "promoCodes": false,
      "pushNotifications": false,
      "phoneSupport": false,
      "earlyAccess": false
    }
  }
}
```

### Get Subscription Features
```
GET /subscriptions/features
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription features retrieved successfully",
  "payload": {
    "maxHostels": 15,
    "priorityListing": true,
    "analytics": true,
    "instantAlerts": true,
    "featuredBadge": true,
    "customProfile": true,
    "promoCodes": false,
    "pushNotifications": false,
    "phoneSupport": false,
    "earlyAccess": false
  }
}
```

### Upgrade Subscription
```
POST /subscriptions/upgrade
```

**Request Body:**
```json
{
  "plan": "ELITE"
}
```

### Cancel Subscription
```
POST /subscriptions/cancel
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "payload": {
    "_id": "subscription_id",
    "status": "cancelled",
    "autoRenew": false
  }
}
```

### Check Subscription Limit
```
GET /subscriptions/limit
```

**Response:**
```json
{
  "success": true,
  "payload": {
    "canCreate": true,
    "currentCount": 5,
    "maxAllowed": 15
  }
}
```

## Payment Management

### Initialize Payment
```
POST /payments/initialize
```

**Request Body:**
```json
{
  "plan": "PRO",
  "paymentMethod": "paystack"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment initialized successfully",
  "payload": {
    "payment": {
      "_id": "payment_id",
      "user": "user_id",
      "subscription": "subscription_id",
      "amount": 3000,
      "currency": "NGN",
      "status": "pending",
      "paymentMethod": "paystack",
      "paymentReference": "SUB_1704067200000_abc123",
      "description": "Subscription payment for Pro Plan"
    },
    "paymentUrl": "https://api.paystack.co/transaction/initialize",
    "subscription": {
      "_id": "subscription_id",
      "plan": "PRO",
      "status": "inactive"
    }
  }
}
```

### Verify Payment
```
GET /payments/verify/:paymentReference
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and subscription activated",
  "payload": {
    "_id": "payment_id",
    "status": "completed",
    "transactionId": "TXN_1704067200000_xyz789",
    "gatewayResponse": {
      "verified": true,
      "amount": 3000,
      "currency": "NGN"
    }
  }
}
```

### Get Payment History
```
GET /payments/history
```

**Response:**
```json
{
  "success": true,
  "message": "Payment history retrieved successfully",
  "payload": [
    {
      "_id": "payment_id",
      "amount": 3000,
      "currency": "NGN",
      "status": "completed",
      "paymentMethod": "paystack",
      "paymentReference": "SUB_1704067200000_abc123",
      "transactionId": "TXN_1704067200000_xyz789",
      "description": "Subscription payment for Pro Plan",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Refund Payment
```
POST /payments/refund/:paymentId
```

**Request Body:**
```json
{
  "reason": "Customer requested refund"
}
```

## Hostel Management with Subscription Features

### Create Hostel (with subscription limit check)
```
POST /hostels
```

**Request Body:**
```json
{
  "hostelName": "Premium Hostel",
  "description": "A premium hostel with modern amenities",
  "location": "Harmony Estate",
  "price": 150000,
  "features": ["WiFi", "Security", "Kitchen"],
  "hostelType": "SINGLE_ROOMS",
  "availableRooms": 5
}
```

### Promote Hostel (Pro/Elite feature)
```
POST /hostels/:id/promote
```

**Response:**
```json
{
  "success": true,
  "message": "Hostel promoted successfully",
  "payload": {
    "_id": "hostel_id",
    "hostelName": "Premium Hostel",
    "isPriorityListing": true
  }
}
```

### Feature Hostel (Elite feature)
```
POST /hostels/:id/feature
```

**Response:**
```json
{
  "success": true,
  "message": "Hostel featured successfully",
  "payload": {
    "_id": "hostel_id",
    "hostelName": "Premium Hostel",
    "isFeatured": true
  }
}
```

### Get Hostel Analytics (Pro/Elite feature)
```
GET /hostels/:id/analytics
```

**Response:**
```json
{
  "success": true,
  "message": "Hostel analytics retrieved successfully",
  "payload": {
    "hostelId": "hostel_id",
    "hostelName": "Premium Hostel",
    "views": 150,
    "inquiries": 25,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isPriorityListing": true,
    "isFeatured": false
  }
}
```

## Error Responses

### Subscription Limit Exceeded
```json
{
  "success": false,
  "message": "You have reached your hostel limit. Current: 15, Maximum allowed: 15. Please upgrade your subscription to add more hostels."
}
```

### Feature Not Available
```json
{
  "success": false,
  "message": "This feature requires a higher subscription plan. Please upgrade to access analytics."
}
```

### Invalid Subscription Plan
```json
{
  "success": false,
  "message": "Invalid subscription plan"
}
```

### Payment Failed
```json
{
  "success": false,
  "message": "Payment verification failed"
}
```

## Subscription Features by Plan

### Basic Plan (Free)
- ✅ List up to 3 hostels
- ✅ Access to hostel management dashboard
- ✅ Receive basic booking requests
- ✅ Standard listing (no special ranking)
- ✅ Limited support (email only)
- ✅ Basic profile page

### Pro Plan (₦3,000/month)
- ✅ List up to 15 hostels
- ✅ Priority listing placement (above Basic users)
- ✅ Access to booking analytics (views, inquiries)
- ✅ Instant booking alerts via email & SMS
- ✅ Agent profile with rating and reviews
- ✅ Featured in "Trusted Agents" tag
- ✅ Email + WhatsApp support

### Elite Plan (₦7,000/month)
- ✅ Unlimited hostel listings
- ✅ Top placement on search results
- ✅ Featured agent badge
- ✅ Booking & earnings dashboard with weekly reports
- ✅ Custom profile with contact button
- ✅ Ability to create promo codes or discounts
- ✅ Push notifications for bookings
- ✅ Email, WhatsApp & phone support
- ✅ Early access to bidding requests from students

## Implementation Notes

1. **Payment Gateway Integration**: The current implementation includes placeholder payment gateway integration. In production, integrate with actual payment gateways like Paystack, Flutterwave, or Stripe.

2. **Subscription Expiry**: Implement a cron job to check for expired subscriptions and update user status accordingly.

3. **Analytics Tracking**: Implement view and inquiry tracking for hostel analytics.

4. **Notification System**: Integrate with email/SMS services for instant alerts and notifications.

5. **Security**: Ensure proper validation and authorization for all subscription-related endpoints.

6. **Database Indexes**: The subscription models include indexes for efficient querying. Monitor query performance in production.

## Environment Variables

Add these environment variables to your `.env` file:

```env
# Payment Gateway Configuration
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key

# Application Configuration
BASE_URL=http://localhost:3050
JWT_SECRET=your_jwt_secret

# Database Configuration
MONGODB_URI=your_mongodb_connection_string
``` 