# LocaMinder - Location-Based Reminder App

LocaMinder uses your phone's GPS to trigger an alert when you come within a certain radius of a chosen location! 

## Color Themes Used
- **Primary Purple (#8B5CF6)** Used for buttons, interactive active states, and titles.
- **Secondary Orange (#F97316)** Used for high-voltage notifications and pulsating rings.
- **Background White & Gray (#FFFFFF / #F8FAFC)** Used for cards and main backgrounds to give a premium shadow layered layout.

## Stack
### Backend (Node.js & Express & MongoDB)
- `express` for API
- `mongoose` for MongoDB interaction
- `jsonwebtoken` for stateless auth via JWT
- `bcryptjs` for reliable credential hashing

### Frontend (React+Vite)
- `framer-motion` for premium, buttery-smooth transition interactions and icon animations.
- `lucide-react` for beautiful UI icons.
- `leaflet` + `react-leaflet` to map geolocated reminders correctly across the UI screen.
- `axios` for fast promise-based networking to back-end endpoints.

## Starting the Project
### Backend
1. Go to `cd backend`
2. Configure `.env` with your secure `MONGO_URI`
3. Run `npm install`
4. Run `npm start` (Runs on `http://localhost:5000`)

### Frontend
1. Go to `cd frontend`
2. Run `npm install`
3. Run `npm run dev`
4. The client relies on hitting `localhost:5000` hardcoded due to requirements, but you can adjust `npm run dev` if you prefer specific subnets.

Enjoy!
