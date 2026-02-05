# Hotel Booking Platform

## Project Description

Web application for managing hotel bookings with complete CRUD functionality and user authentication.

- Backend: Node.js, Express, MongoDB
- Frontend: HTML, CSS, JavaScript (fetch API), Bootstrap 5

## Features

- User registration and login with secure password hashing (bcrypt).
- Session-based authentication with cookies and role-based authorization (admin/user).
- View a list of hotels with filtering, searching, and sorting.
- Create, update, and delete hotels — only accessible by users with admin role.
- User interface dynamically updates based on user role to hide/show admin controls.
- Data stored and managed in MongoDB.
- Protected routes ensure unauthorized users cannot modify data.

## Technologies Used

- Node.js
- Express.js
- MongoDB 
- express-session for session management
- bcryptjs for password hashing
- HTML, CSS, JavaScript (fetch API)
- Bootstrap 5

## Installation and Running Locally

### Clone the repository:

- git clone https://github.com/bgl96395/Backend_Project.git
- cd Hotel_Booking

### Install dependencies:

- npm install

### Create a .env file in the project root with the following variables:

- PORT=3000
- MONGO_URI=mongodb+srv://Bigali:Nugmash@cluster0.jmdxiuw.mongodb.net/HotelBook?appName=Cluster0
- NODE_ENV=development

## Start the server:

- node server.js

## Open your browser and go to:

- http://localhost:3000

## Deployment

* link: https://hotel-booking-final-project-2.onrender.com

- Set environment variables (PORT, MONGO_URI, SESSION_SECRET, NODE_ENV=production) in your hosting platform dashboard.
- Connect to a remote MongoDB cluster.
- Ensure cookies are served securely (via HTTPS) when NODE_ENV=production.

## Authentication & Authorization

- Registration and login pages with form validation.
- Passwords hashed securely using bcrypt.
- Session created on successful login; session ID stored in HTTP-only cookies.
- Middleware protects routes; only authenticated users can access protected pages.
- Role-based authorization: only admins can create, update, and delete hotels.
- User role fetched via API endpoint and used client-side to show/hide admin controls.

## Web Interface Usage

- Root / shows list of hotels with search/filter/sort functionality.
- Create, Update, Delete tabs/forms allow admins to manage hotels.
- Forms send API requests with session credentials for authentication.
- Unauthorized users cannot see or use admin controls.

## API Endpoints Summary

- POST /register — create a new user.
- POST /login — authenticate user and start session.
- POST /logout — destroy session.
- GET /api/user — returns current logged-in user role.
- GET /api/hotels — fetch all hotels.
- POST /api/hotels — create hotel (admin only).
- PUT /api/hotels/:id — update hotel (admin only).
- DELETE /api/hotels/:id — delete hotel (admin only).

## Team Members & Contributions

* Asylbek — Testing, documentation
* Ansar — Frontend, UI/UX
* Dinmuhamed — API routing, validation
* Bigali — Backend, database integration, authentication & authorization

