# Hotel Booking Platform

## A full-stack Hotel Booking Web Application built with Node.js, Express, and MongoDB, featuring secure authentication, authorization with roles, and complete CRUD functionality.

The application allows users to view, book, and manage hotels, while admin users can manage hotel listings through protected endpoints. It is fully deployed and production-ready.

## Objectives
This project fulfills the Final Project Requirements (Week 10) by demonstrating:

- A deployed and production-ready web application
- Secure user authentication and session management
- Role-based access control with admin and user roles
- Proper database relations and data validation
- Protected API endpoints with error handling
- Environment-based configuration without hardcoded secrets

## Tech Stack
- Backend: Node.js, Express
- Database: MongoDB 
- Frontend: HTML, CSS, JavaScript, Bootstrap 5
- Security: bcryptjs for password hashing, express-session for authentication
- Deployment: Render (cloud hosting), MongoDB Atlas (database)

Project Structure


Hotel_Booking/
models: (User, Hotel, Booking)
routes: Express routes (auth, hotels, bookings)
controllers: Business logic and handlers
middleware: Authentication & authorization middleware
config: Database and environment configuration
public: Static frontend files
views: HTML templates (UI)
server.js: Entry point
.env: Environment variables

## Database Design
### Three main related collections:

#### Users Collection

Fields: username, email, passwordHash, role
Roles: "user", "admin"
Passwords securely hashed using bcrypt

#### Hotels Collection

Fields: name, city, price, description, stars, country, price
Supports pagination, filtering, and sorting

#### Bookings collection

Each booking connects a user and a hotel, ensuring proper relational logic.
Admins can view all bookings; users can view and manage only their own

## Authentication & Authorization

### Authentication
Implemented using express-session (session-based, cookie stored).
Session is created upon successful login.
Passwords hashed using bcryptjs.
Secure login/logout endpoints with proper error handling.

### Authorization
User Role: Can view hotel listings.
Admin Role: Can create, edit, and delete hotels.
Middleware checks:
isAuthenticated → Ensures user is logged in.
isAdmin → Ensures user has admin privileges.
Users can modify only their own data.

## Deployment
Deployed Link:https://hotel-booking-final-project-2.onrender.com

Deployment Instructions:

Set environment variables on hosting platform:
PORT
MONGO_URI
SESSION_SECRET
NODE_ENV=production
Enable HTTPS for secure cookies.
Connect to remote MongoDB Atlas cluster.

Local Installation
1. Clone the repository: git clone https://github.com/bgl96395/Backend_Project.git
cd Hotel_Booking

2. Install dependencies: npm install

3. Create a .env file in the project root:

PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key

4. Run the application: node server.js

5. Open in the browser: http://localhost:3000

## Web Interface
Home Page: Displays all hotels with searching, sorting, and filtering.
Admin Dashboard: Visible only to admin users (CRUD controls enabled).
User Dashboard: Allows users to view hotels and manage their bookings.
Dynamic UI: Automatically updates menus and buttons based on logged-in user role.

## API Endpoints
Method	Endpoint	Description	Access
POST	/register	Register a new user	Public
POST	/login	Authenticate user & start session	Public
POST	/logout	End user session	Authenticated
GET	/api/user	Get current user & role	Authenticated
GET	/api/hotels	Fetch all hotels (w/ pagination, filters)	Public
POST	/api/hotels	Create new hotel	Admin
PUT	/api/hotels/:id	Update hotel data	Admin
DELETE	/api/hotels/:id	Delete hotel entry	Admin

## Security Highlights
No hardcoded secrets — all sensitive values stored in .env
HTTP-only cookies to prevent client-side access
Input validation on all forms
Error handling to prevent data or stack leaks
Rate limiting and validation checks on API requests
Protected write endpoints — only authenticated and authorized users may modify data

## Team Members & Contributions

Asylbek	Testing, documentation, interface validation
Ansar	Frontend development, UI/UX design
Dinmuhamed	API routing, input validation, controllers
Bigali	Backend logic, database integration, authentication, and authorization

## Final Notes
This project demonstrates a secure, well-structured, and production-ready Node.js web application — including deployment, roles, CRUD, protected endpoints, and comprehensive defense readiness.