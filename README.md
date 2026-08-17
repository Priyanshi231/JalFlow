# JalFlow – Water Tanker Management System

Developed by Priyanshi Jain  
Built during internship at Talking Crooks IT Pvt. Ltd.

JalFlow is a MERN-based web dashboard for a local water tanker supplier. It manages customer bookings, driver assignments, delivery status, payments and basic business reports.

## Tech Stack

- Frontend: React + Vite
- Styling: CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- API: REST
- HTTP client: Axios
- Charts: Recharts
- Routing: React Router

## Core Features

- Dashboard with booking, delivery, driver and revenue summaries
- Create and manage tanker bookings
- Add and manage drivers
- Assign a driver to a booking
- Update delivery status
- Record and view payments
- Reports and revenue overview
- Responsive layout for desktop and smaller screens

## Out of Scope for this MVP

- Live GPS tracking
- Online payment gateway
- SMS/WhatsApp automation
- Customer mobile application
- Advanced AI forecasting

## Project Structure

```text
JalFlow/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── seed.js
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.md
└── README.md
```

## Setup

### 1. Start MongoDB

Use either:
- MongoDB locally, or
- MongoDB Atlas.

### 2. Backend

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and set:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jalflow
CLIENT_URL=http://localhost:5173
```

Then:

```bash
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Demo Flow

1. Open Dashboard.
2. Go to Bookings.
3. Create a new booking.
4. Open Drivers and assign a driver to the booking.
5. Change delivery status.
6. Open Payments and record a payment.
7. Open Reports to see booking and revenue information.

## Branding

The application uses:
- Project: JalFlow
- Developer: Priyanshi Jain
- Internship credit: Talking Crooks IT Pvt. Ltd.
