# BookVault

A full-stack Library Management System for modern libraries, built with React, Node.js, Express, MongoDB, and Tailwind CSS. BookVault enables users and admins to manage books, borrowing, overdue reminders, waitlists, and more, with a beautiful responsive UI and advanced features.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)
- [License](#license)

---

## Features
- User authentication (register/login/logout)
- Admin dashboard with statistics, book management, and user management
- Borrow/return books, overdue reminders via email
- Waitlist and notifications for unavailable books
- Customizable library rules (admin settings: max books, loan period, fine)
- Book image upload and viewing
- Search, filter, and sort books
- Borrow history and fine tracking
- Responsive UI with dark/light mode toggle
- Role-based access control (admin/user)
- RESTful API with error handling
- Daily cron jobs for overdue reminders

## Tech Stack
- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose), dotenv, cors, nodemailer, node-cron
- **Deployment:** Vercel (frontend & backend), Netlify, Render, Railway

## Project Structure
```
Library/
  backend/      # Express + MongoDB API
    routes/     # API route handlers
    models/     # Mongoose models
    controllers/# Business logic
    scheduler/  # Cron jobs
    uploads/    # Book cover images
    .env        # Backend environment variables
    server.js   # Main server file
  frontend/     # React + Tailwind CSS SPA
    src/        # React source code
    public/     # Static assets
    .env        # Frontend environment variables
    vite.config.js # Vite config
    README.md   # Frontend documentation
```

## Setup & Installation

### Backend
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Set up `.env` with your MongoDB URI and other secrets:
   ```env
   MONGO_URI=your_mongodb_uri
   PORT=5000
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```
3. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Set API base URL in `.env`:
   ```env
   VITE_API_URL=https://your-backend-domain.com
   ```
3. Start the React app:
   ```bash
   npm run dev
   ```

## Environment Variables
- **Backend:**
  - `MONGO_URI` - MongoDB connection string
  - `PORT` - Server port
  - `EMAIL_USER`, `EMAIL_PASS` - For sending overdue reminders
- **Frontend:**
  - `VITE_API_URL` - Base URL for backend API

## Deployment
- **Frontend:** Deploy the `frontend` build folder to Vercel, Netlify, or similar.
- **Backend:** Deploy the `backend` to Vercel, Render, Railway, or similar.
- Ensure CORS is enabled on the backend for your frontend domain.
- For Vercel SPA routing, add a `vercel.json`:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

## API Endpoints
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login
- `GET /api/books` - List/search books
- `POST /api/borrow/request/:bookId` - Request to borrow a book
- `PUT /api/borrow/:id/return` - Return a book
- `GET /api/borrow/me` - Get user's borrow records
- `GET /api/admin/stats` - Admin dashboard stats
- `POST /api/books/:bookId/waitlist` - Join waitlist for a book
- `GET /api/admin/settings` - Get library rules
- `PUT /api/admin/settings` - Update library rules
- ...and more (see backend routes)

## Usage Guide
### User
- Register and login
- Browse/search books
- Request to borrow available books
- Join waitlist for unavailable books
- View borrow history and fines
- Toggle dark/light mode

### Admin
- Login as admin
- View dashboard stats
- Add/edit/delete books
- Approve/reject borrow requests
- Update library rules (max books, loan period, fine)
- View all borrow records and user activities

## Troubleshooting
- **White screen or missing books:** Check API URL in frontend `.env` and CORS settings in backend.
- **Network errors:** Ensure backend is deployed and accessible, and API URL is correct.
- **MIME type errors:** For Vercel, use correct SPA rewrite in `vercel.json`.
- **Email not sending:** Check email credentials in backend `.env`.
- **MongoDB connection issues:** Verify `MONGO_URI` and database access.

## Credits
- Project by Shanidhya01
- UI/UX inspired by modern library systems
- Powered by open-source technologies

## License
MIT
