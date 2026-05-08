# LocaMinder — API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth Routes

### POST `/auth/register`
Register a new user.

**Body:**
```json
{ "username": "john", "password": "secret" }
```

**Response `201`:**
```json
{ "message": "User registered" }
```

**Errors:** `400` — User already exists.

---

### POST `/auth/login`
Authenticate and receive a JWT token.

**Body:**
```json
{ "username": "john", "password": "secret" }
```

**Response `200`:**
```json
{ "token": "<jwt_token>" }
```

**Errors:** `400` — User not found / Invalid password.

---

## Reminder Routes *(Protected)*

### GET `/reminders`
Fetch all reminders belonging to the authenticated user.

**Response `200`:**
```json
[
  {
    "_id": "abc123",
    "userId": "user_id",
    "title": "Buy groceries",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "radius": 500,
    "isActive": true
  }
]
```

---

### POST `/reminders`
Create a new location reminder.

**Body:**
```json
{
  "title": "Buy groceries",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "radius": 500
}
```

**Response `201`:** Returns the created reminder object.

**Errors:** `400` — Missing required fields.

---

### DELETE `/reminders/:id`
Delete a reminder by ID.

**Response `200`:**
```json
{ "message": "Deleted reminder" }
```

**Errors:** `400` — Invalid ID / not found.

---

## Distance Utility

The Haversine formula is used on the frontend (`src/utils/distance.js`) to calculate the straight-line distance in metres between the user's current GPS coordinates and each reminder's coordinates.

```js
getDistance(userLat, userLng, reminderLat, reminderLng)
// Returns: distance in metres (number)
```

If the returned distance ≤ reminder's `radius`, a browser notification is triggered.

---

## Environment Variables

### Backend (`backend/.env`)
| Variable    | Description                          |
|-------------|--------------------------------------|
| `PORT`      | Port for the Express server (default: 5000) |
| `MONGO_URI` | MongoDB Atlas connection string      |
| `JWT_SECRET`| Secret key for signing JWT tokens    |

### Frontend (`frontend/.env`)
| Variable       | Description                             |
|----------------|-----------------------------------------|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:5000/api`) |
