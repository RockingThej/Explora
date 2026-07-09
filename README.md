# Explora

Explora is a full-stack travel accommodation booking app. Users can browse stays, view details, book a room, "pay" for it, and manage their bookings from a personal dashboard.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How to Use the App](#how-to-use-the-app)
- [How It Works](#how-it-works)
- [API Reference](#api-reference)
- [Data Storage](#data-storage)
- [Notes & Limitations](#notes--limitations)

## Features

- Browse accommodations with images, location, and descriptions
- View detailed info for a single stay
- User registration and login
- Book a stay and complete a mock payment flow
- Personal dashboard to view and cancel your bookings
- Contact form
- About page

## Tech Stack

**Frontend**
- React 18
- React Router (client-side routing)
- Vite (dev server & build tool)

**Backend**
- Node.js
- Express
- JSON files as a lightweight data store (no database setup required)

## Project Structure

```
Explora/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Accommodations.jsx
│   │   │   ├── Detail.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── App.jsx           # Route definitions
│   │   ├── main.jsx          # React entry point
│   │   └── styles.css
│   ├── public/images/        # Static hotel/destination images
│   ├── index.html
│   └── vite.config.mjs
└── server/                  # Express backend
    ├── server.js             # All API routes
    └── data/                 # JSON "database"
        ├── hotels.json
        ├── users.json
        ├── bookings.json
        └── messages.json
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

### 1. Clone the repo

```bash
git clone https://github.com/RockingThej/Explora.git
cd Explora
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Run in development

```bash
# Terminal 1 — backend (http://localhost:5000)
cd server
npm start

# Terminal 2 — frontend (http://localhost:5173)
cd client
npm run dev
```

Open `http://localhost:5173` in your browser. The frontend dev server calls the backend at port 5000 for all `/api` requests.

### 4. Build for production

```bash
cd client
npm run build
```

The Express server automatically serves the built frontend from `client/dist` and falls back to `index.html` for client-side routing, so in production you only need to run the server:

```bash
cd server
npm start
```

Then visit `http://localhost:5000` — both the site and the API are served from the same origin.

## How to Use the App

1. **Home page** — Landing page with an overview and links into the site.
2. **Accommodations** — Browse the full list of stays. Each card shows a name, location, and image.
3. **Detail page** — Click into a stay to see its full description and nearby attractions, with a button to start booking.
4. **Register / Login** — Create an account or sign in. This is required before a booking is finalized (the app issues a simple token used to identify you on later requests).
5. **Booking** — Choose your stay and confirm booking details.
6. **Payment** — A mock payment step that completes the booking (no real payment processing occurs).
7. **Dashboard** — Once logged in, view all bookings tied to your account, and cancel any of them.
8. **Contact** — Submit a message via the contact form; messages are stored on the backend.
9. **About** — Information about the app/site.

## How It Works

### Architecture

Explora is a classic two-tier web app:

- The **client** (React) renders all pages and handles navigation entirely in the browser using React Router — there are no full page reloads when moving between routes like `/accommodations` or `/dashboard`.
- The **server** (Express) exposes a JSON REST API under `/api/*` and reads/writes to flat JSON files instead of a traditional database.

In development, the client and server run as two separate processes on two different ports (5173 and 5000). In production, the client is compiled into static files (`npm run build`) and the Express server serves those files directly, plus handles all `/api` requests — so everything runs from one process and one port.

### Authentication flow

Auth is intentionally simple:
- On register or login, the server generates a token in the form `tok-<userId>` and returns it along with basic user info.
- The client stores this token and sends it in the `Authorization` header as `Bearer tok-<userId>` on subsequent requests.
- The server reads that header to figure out which user is making a request — for example, filtering `/api/bookings` down to just that user's bookings.

There is no password hashing, session expiry, or real security here — it's a functional stand-in appropriate for a demo/learning project, not production auth.

### Booking flow

1. User picks a stay on the Accommodations or Detail page.
2. They fill in booking details on the Booking page.
3. The Payment page simulates a payment and, on "success," creates a booking record via `POST /api/bookings`, tagging it with the user's ID (extracted from their token).
4. The booking is written into `bookings.json` on the server.
5. The Dashboard page fetches `GET /api/bookings` with the user's token, so only their own bookings are shown, and lets them cancel a booking via `DELETE /api/bookings/:id`.

### Data flow

Every API route in `server.js` follows the same simple pattern:
1. Read the relevant JSON file from `server/data/` into memory.
2. Filter, find, or modify the array in memory as needed.
3. If data changed, write the updated array back to the JSON file.
4. Respond with JSON.

This means the "database" is really just plain files on disk — easy to inspect and edit by hand, but not safe for concurrent writes at scale (fine for local/demo use).

## API Reference

| Method | Endpoint                   | Description                                       |
|--------|------------------------------|----------------------------------------------------|
| GET    | `/api/accommodations`        | List all accommodations                            |
| GET    | `/api/accommodations/:id`    | Get a single accommodation by ID                   |
| POST   | `/api/register`               | Register a new user (`name`, `email`, `password`)  |
| POST   | `/api/login`                  | Log in (`email`, `password`)                        |
| GET    | `/api/bookings`                | List bookings — filtered to the current user if an `Authorization` header is sent |
| POST   | `/api/bookings`                | Create a new booking                                |
| DELETE | `/api/bookings/:id`            | Cancel/delete a booking by ID                       |
| POST   | `/api/contact`                 | Submit a contact form message                       |

All authenticated requests should include:
```
Authorization: Bearer tok-<userId>
```

## Data Storage

All persistent data lives in `server/data/` as plain JSON arrays:

- `hotels.json` — accommodation listings (id, name, location, description, image, etc.)
- `users.json` — registered users (id, name, email, password — stored in plain text, see note below)
- `bookings.json` — bookings (id, userId, accommodation info, dates, etc.)
- `messages.json` — submitted contact form messages

You can open and edit these files directly to seed test data.

## Notes & Limitations

This project uses flat JSON files for persistence, which makes it easy to run locally with zero setup — a good fit for demos and learning. A few things to be aware of before treating it as production-ready:

- **Passwords are stored in plain text** in `users.json`. Don't reuse real passwords when testing, and add hashing (e.g. bcrypt) before deploying this anywhere real.
- **Auth tokens are not cryptographically secure** — they're just `tok-<userId>`, easily guessable, and never expire.
- **No database transactions** — concurrent writes to the same JSON file could overwrite each other under load.
- **Payment is simulated** — no real payment gateway is integrated.

## License

Add a license of your choice (e.g. MIT) if you plan to make this repo public.
