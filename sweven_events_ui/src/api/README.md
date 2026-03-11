# Sweven Events API Documentation

## Base URL
```
https://api.swevenevents.com/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Events API

### 1. Get All Events
**GET** `/events`

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `city` (string, optional): Filter by city
- `category` (string, optional): Filter by category
- `startDate` (string, optional): Filter events after this date (ISO 8601)
- `endDate` (string, optional): Filter events before this date (ISO 8601)
- `featured` (boolean, optional): Filter featured events only

**Request Example:**
```bash
curl -X GET "https://api.swevenevents.com/v1/events?city=Los%20Angeles&category=Music&featured=true"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "evt_1a2b3c4d5e",
        "title": "ELECTRO PULSE FESTIVAL 2026",
        "subtitle": "The Ultimate Electronic Music Experience",
        "description": "Join us for the most anticipated electronic music festival...",
        "category": "Music",
        "date": "2026-03-15T18:00:00Z",
        "endDate": "2026-03-16T02:00:00Z",
        "venue": {
          "name": "Skyline Arena",
          "address": "1234 Festival Boulevard",
          "city": "Los Angeles",
          "state": "CA",
          "zipCode": "90015",
          "coordinates": {
            "lat": 34.0522,
            "lng": -118.2437
          }
        },
        "images": {
          "thumbnail": "https://cdn.swevenevents.com/events/evt_1a2b3c4d5e/thumb.jpg",
          "banner": "https://cdn.swevenevents.com/events/evt_1a2b3c4d5e/banner.jpg",
          "gallery": [
            "https://cdn.swevenevents.com/events/evt_1a2b3c4d5e/img1.jpg",
            "https://cdn.swevenevents.com/events/evt_1a2b3c4d5e/img2.jpg"
          ]
        },
        "ticketTiers": [
          {
            "id": "tier_abc123",
            "name": "General Admission",
            "price": 89.00,
            "currency": "USD",
            "description": "Access to all stages and general standing areas",
            "seatsAvailable": 450,
            "totalSeats": 3000,
            "features": ["All stages access", "Standing area", "Food court access"]
          }
        ],
        "seatsLeft": 847,
        "totalSeats": 5000,
        "isFeatured": true,
        "tags": ["EDM", "Festival", "Live Music"],
        "organizer": {
          "id": "org_xyz789",
          "name": "Sweven Events International",
          "verified": true
        },
        "status": "active",
        "createdAt": "2025-12-01T10:00:00Z",
        "updatedAt": "2026-02-10T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  },
  "timestamp": "2026-02-10T20:15:30Z"
}
```

---

### 2. Get Event by ID
**GET** `/events/:eventId`

**Request Example:**
```bash
curl -X GET "https://api.swevenevents.com/v1/events/evt_1a2b3c4d5e"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "evt_1a2b3c4d5e",
    "title": "ELECTRO PULSE FESTIVAL 2026",
    "subtitle": "The Ultimate Electronic Music Experience",
    "description": "Join us for the most anticipated electronic music festival...",
    "category": "Music",
    "date": "2026-03-15T18:00:00Z",
    "endDate": "2026-03-16T02:00:00Z",
    "venue": {
      "name": "Skyline Arena",
      "address": "1234 Festival Boulevard",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90015",
      "coordinates": {
        "lat": 34.0522,
        "lng": -118.2437
      }
    },
    "ticketTiers": [...],
    "schedule": [
      {
        "id": "sch_1",
        "time": "18:00",
        "title": "Doors Open",
        "description": "Check-in and venue access",
        "speaker": null
      }
    ],
    "speakers": [
      {
        "id": "spk_1",
        "name": "DJ Nebula",
        "title": "Headliner",
        "bio": "Grammy-nominated electronic artist...",
        "image": "https://cdn.swevenevents.com/speakers/spk_1.jpg",
        "social": {
          "instagram": "@djnebula",
          "twitter": "@djnebula"
        }
      }
    ],
    "faqs": [
      {
        "question": "What is the minimum age?",
        "answer": "18+ with valid ID required at entry"
      }
    ],
    "organizer": {
      "id": "org_xyz789",
      "name": "Sweven Events International",
      "email": "contact@swevenevents.com",
      "phone": "+1-555-0123",
      "verified": true
    },
    "seatsLeft": 847,
    "totalSeats": 5000,
    "tags": ["EDM", "Festival", "Live Music"],
    "status": "active"
  },
  "timestamp": "2026-02-10T20:15:30Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found",
    "details": "No event exists with ID: evt_invalid"
  },
  "timestamp": "2026-02-10T20:15:30Z"
}
```

---

## Bookings API

### 3. Create Booking
**POST** `/bookings`

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <user_token>
```

**Request Body:**
```json
{
  "eventId": "evt_1a2b3c4d5e",
  "ticketTierId": "tier_abc123",
  "quantity": 2,
  "attendee": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0199"
  },
  "addOns": ["addon_1", "addon_2"],
  "promoCode": "EARLYBIRD",
  "paymentMethod": {
    "type": "card",
    "token": "tok_visa_4242424242424242"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "bkg_9z8y7x6w5v",
      "confirmationCode": "SWE-A7K9M2",
      "status": "confirmed",
      "eventId": "evt_1a2b3c4d5e",
      "eventTitle": "ELECTRO PULSE FESTIVAL 2026",
      "eventDate": "2026-03-15T18:00:00Z",
      "venue": {
        "name": "Skyline Arena",
        "address": "1234 Festival Boulevard, Los Angeles, CA 90015"
      },
      "tickets": [
        {
          "id": "tkt_001",
          "qrCode": "https://cdn.swevenevents.com/qr/tkt_001.png",
          "ticketNumber": "SWE-001-2026-001",
          "tier": "General Admission",
          "attendeeName": "John Doe"
        },
        {
          "id": "tkt_002",
          "qrCode": "https://cdn.swevenevents.com/qr/tkt_002.png",
          "ticketNumber": "SWE-001-2026-002",
          "tier": "General Admission",
          "attendeeName": "John Doe"
        }
      ],
      "attendee": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-0199"
      },
      "pricing": {
        "subtotal": 178.00,
        "addOnsTotal": 60.00,
        "discount": 23.80,
        "tax": 21.42,
        "total": 235.62,
        "currency": "USD"
      },
      "payment": {
        "transactionId": "txn_abc123xyz",
        "method": "Visa ending in 4242",
        "status": "completed",
        "paidAt": "2026-02-10T20:16:45Z"
      },
      "addOns": [
        {
          "id": "addon_1",
          "name": "Event Merchandise Pack",
          "price": 35.00
        },
        {
          "id": "addon_2",
          "name": "Premium Parking Pass",
          "price": 25.00
        }
      ],
      "createdAt": "2026-02-10T20:16:45Z"
    }
  },
  "timestamp": "2026-02-10T20:16:45Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_TICKETS",
    "message": "Not enough tickets available",
    "details": "Only 1 ticket available for this tier, but 2 requested"
  },
  "timestamp": "2026-02-10T20:15:30Z"
}
```

---

### 4. Get User Bookings
**GET** `/bookings`

**Request Headers:**
```
Authorization: Bearer <user_token>
```

**Query Parameters:**
- `status` (string, optional): Filter by status (confirmed, cancelled, pending)
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

**Request Example:**
```bash
curl -X GET "https://api.swevenevents.com/v1/bookings?status=confirmed" \
  -H "Authorization: Bearer <user_token>"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "bkg_9z8y7x6w5v",
        "confirmationCode": "SWE-A7K9M2",
        "status": "confirmed",
        "eventTitle": "ELECTRO PULSE FESTIVAL 2026",
        "eventDate": "2026-03-15T18:00:00Z",
        "venue": "Skyline Arena, Los Angeles",
        "ticketCount": 2,
        "totalPaid": 235.62,
        "currency": "USD",
        "createdAt": "2026-02-10T20:16:45Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  },
  "timestamp": "2026-02-10T20:20:00Z"
}
```

---

### 5. Get Booking Details
**GET** `/bookings/:bookingId`

**Request Headers:**
```
Authorization: Bearer <user_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "bkg_9z8y7x6w5v",
    "confirmationCode": "SWE-A7K9M2",
    "status": "confirmed",
    "eventId": "evt_1a2b3c4d5e",
    "eventTitle": "ELECTRO PULSE FESTIVAL 2026",
    "eventDate": "2026-03-15T18:00:00Z",
    "venue": {
      "name": "Skyline Arena",
      "address": "1234 Festival Boulevard, Los Angeles, CA 90015"
    },
    "tickets": [
      {
        "id": "tkt_001",
        "qrCode": "https://cdn.swevenevents.com/qr/tkt_001.png",
        "qrCodeData": "SWE-001-2026-001",
        "ticketNumber": "SWE-001-2026-001",
        "tier": "General Admission",
        "price": 89.00,
        "status": "valid",
        "checkInStatus": null
      }
    ],
    "attendee": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1-555-0199"
    },
    "pricing": {
      "subtotal": 178.00,
      "addOnsTotal": 60.00,
      "discount": 23.80,
      "tax": 21.42,
      "total": 235.62,
      "currency": "USD"
    },
    "createdAt": "2026-02-10T20:16:45Z"
  },
  "timestamp": "2026-02-10T20:20:00Z"
}
```

---

### 6. Cancel Booking
**DELETE** `/bookings/:bookingId`

**Request Headers:**
```
Authorization: Bearer <user_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookingId": "bkg_9z8y7x6w5v",
    "status": "cancelled",
    "refund": {
      "amount": 235.62,
      "currency": "USD",
      "method": "original_payment_method",
      "estimatedArrival": "5-7 business days",
      "refundId": "ref_xyz789abc"
    },
    "cancelledAt": "2026-02-12T10:30:00Z"
  },
  "timestamp": "2026-02-12T10:30:00Z"
}
```

---

## Organizer API (Admin)

### 7. Create Event
**POST** `/organizer/events`

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <organizer_token>
```

**Request Body:**
```json
{
  "title": "Summer Music Festival 2026",
  "subtitle": "The hottest acts of summer",
  "description": "Join us for an unforgettable weekend...",
  "category": "Music",
  "date": "2026-07-15T17:00:00Z",
  "endDate": "2026-07-17T23:00:00Z",
  "venue": {
    "name": "Beachside Arena",
    "address": "123 Ocean Drive",
    "city": "Miami",
    "state": "FL",
    "zipCode": "33139",
    "coordinates": {
      "lat": 25.7617,
      "lng": -80.1918
    }
  },
  "ticketTiers": [
    {
      "name": "General Admission",
      "price": 99.00,
      "description": "Standard entry",
      "totalSeats": 5000,
      "features": ["All stages access", "Festival grounds"]
    },
    {
      "name": "VIP Pass",
      "price": 299.00,
      "description": "Premium experience",
      "totalSeats": 500,
      "features": ["VIP lounge", "Premium viewing", "Complimentary drinks"]
    }
  ],
  "tags": ["Music", "Festival", "Summer"],
  "isFeatured": false,
  "status": "draft"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "eventId": "evt_new123",
    "title": "Summer Music Festival 2026",
    "status": "draft",
    "slug": "summer-music-festival-2026",
    "editUrl": "https://organizer.swevenevents.com/events/evt_new123/edit",
    "createdAt": "2026-02-10T21:00:00Z"
  },
  "timestamp": "2026-02-10T21:00:00Z"
}
```

---

### 8. Get Event Analytics
**GET** `/organizer/events/:eventId/analytics`

**Request Headers:**
```
Authorization: Bearer <organizer_token>
```

**Query Parameters:**
- `period` (string, optional): Time period (7d, 30d, all)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "eventId": "evt_1a2b3c4d5e",
    "period": "30d",
    "overview": {
      "totalBookings": 1847,
      "totalRevenue": 284392.50,
      "averageTicketValue": 154.00,
      "conversionRate": 34.2
    },
    "ticketSales": {
      "totalSold": 3653,
      "totalAvailable": 5000,
      "percentageSold": 73.06,
      "byTier": [
        {
          "tierId": "tier_abc123",
          "tierName": "General Admission",
          "sold": 2550,
          "available": 3000,
          "revenue": 227550.00
        },
        {
          "tierId": "tier_def456",
          "tierName": "VIP Experience",
          "sold": 911,
          "available": 1000,
          "revenue": 226839.00
        }
      ]
    },
    "salesTimeline": [
      {
        "date": "2026-01-15",
        "bookings": 45,
        "revenue": 6930.00
      },
      {
        "date": "2026-01-16",
        "bookings": 62,
        "revenue": 9548.00
      }
    ],
    "demographics": {
      "topCities": [
        {"city": "Los Angeles", "count": 523},
        {"city": "San Francisco", "count": 287},
        {"city": "San Diego", "count": 156}
      ]
    },
    "promoCodeUsage": [
      {
        "code": "EARLYBIRD",
        "uses": 234,
        "revenue": 20346.00,
        "discountGiven": 4680.00
      }
    ]
  },
  "timestamp": "2026-02-10T21:15:00Z"
}
```

---

### 9. Create Promo Code
**POST** `/organizer/events/:eventId/promo-codes`

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <organizer_token>
```

**Request Body:**
```json
{
  "code": "SUMMER25",
  "discountType": "percentage",
  "discountValue": 25,
  "maxUses": 100,
  "validFrom": "2026-06-01T00:00:00Z",
  "validUntil": "2026-06-15T23:59:59Z",
  "applicableTiers": ["tier_abc123", "tier_def456"],
  "minimumPurchase": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "promoCodeId": "promo_xyz123",
    "code": "SUMMER25",
    "discountType": "percentage",
    "discountValue": 25,
    "maxUses": 100,
    "currentUses": 0,
    "status": "active",
    "validFrom": "2026-06-01T00:00:00Z",
    "validUntil": "2026-06-15T23:59:59Z",
    "createdAt": "2026-02-10T21:30:00Z"
  },
  "timestamp": "2026-02-10T21:30:00Z"
}
```

---

### 10. Validate Promo Code
**POST** `/promo-codes/validate`

**Request Body:**
```json
{
  "code": "EARLYBIRD",
  "eventId": "evt_1a2b3c4d5e",
  "ticketTierId": "tier_abc123",
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "code": "EARLYBIRD",
    "discountType": "percentage",
    "discountValue": 20,
    "applicableAmount": 178.00,
    "discountAmount": 35.60,
    "finalAmount": 142.40,
    "message": "Promo code applied successfully"
  },
  "timestamp": "2026-02-10T21:35:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": {
    "code": "PROMO_CODE_EXPIRED",
    "message": "This promo code has expired",
    "details": "Code EARLYBIRD expired on 2026-01-31"
  },
  "timestamp": "2026-02-10T21:35:00Z"
}
```

---

## Notifications API

### 11. Send Event Reminder
**POST** `/organizer/events/:eventId/notifications`

**Request Body:**
```json
{
  "type": "reminder",
  "channel": ["email", "sms"],
  "template": "event_reminder_24h",
  "scheduledFor": "2026-03-14T18:00:00Z",
  "recipientFilter": {
    "bookingStatus": "confirmed"
  }
}
```

**Response (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "notificationId": "ntf_abc123",
    "type": "reminder",
    "estimatedRecipients": 1847,
    "scheduledFor": "2026-03-14T18:00:00Z",
    "status": "scheduled"
  },
  "timestamp": "2026-02-10T21:40:00Z"
}
```

---

## Authentication API

### 12. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123abc",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "ref_tok_xyz789...",
    "expiresIn": 3600
  },
  "timestamp": "2026-02-10T21:45:00Z"
}
```

---

### 13. Organizer Login
**POST** `/auth/organizer/login`

**Request Body:**
```json
{
  "email": "organizer@swevenevents.com",
  "password": "secureOrgPassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "organizer": {
      "id": "org_xyz789",
      "email": "organizer@swevenevents.com",
      "name": "Sweven Events International",
      "role": "organizer",
      "verified": true,
      "permissions": ["create_events", "manage_bookings", "view_analytics"]
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "ref_tok_org456...",
    "expiresIn": 3600
  },
  "timestamp": "2026-02-10T21:50:00Z"
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `EVENT_NOT_FOUND` | 404 | Event does not exist |
| `BOOKING_NOT_FOUND` | 404 | Booking does not exist |
| `INSUFFICIENT_TICKETS` | 400 | Not enough tickets available |
| `INVALID_PROMO_CODE` | 400 | Promo code is invalid |
| `PROMO_CODE_EXPIRED` | 400 | Promo code has expired |
| `PAYMENT_FAILED` | 402 | Payment processing failed |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Webhooks

Sweven Events can send webhooks to your server for real-time updates.

### Event Types:
- `booking.created`
- `booking.confirmed`
- `booking.cancelled`
- `payment.completed`
- `payment.failed`
- `ticket.scanned`
- `event.published`
- `event.cancelled`

### Webhook Payload Example:
```json
{
  "id": "wh_1a2b3c",
  "type": "booking.created",
  "createdAt": "2026-02-10T20:16:45Z",
  "data": {
    "bookingId": "bkg_9z8y7x6w5v",
    "eventId": "evt_1a2b3c4d5e",
    "status": "confirmed",
    "totalAmount": 235.62,
    "ticketCount": 2
  }
}
```

---

## Rate Limits

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 300 requests per minute
- **Organizer endpoints**: 500 requests per minute

Rate limit headers are included in every response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1709237400
```
