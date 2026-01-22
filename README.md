# Hotel Booking Platform

## Project Description

A web application for managing hotel bookings with full CRUD functionality. The backend is built with Node.js, Express, and MongoDB. The frontend uses plain HTML, CSS, JavaScript, and Bootstrap. Data is dynamically loaded via API requests.

## Features

- View a list of hotels with filtering by country, minimum price, and sorting options.
- Create new hotel entries via a form.
- Update existing hotel data by ID.
- Delete hotels by ID.
- Data stored in MongoDB.
- All operations are accessible through the web interface, no Postman required.

## Technologies Used

- Node.js
- Express.js
- MongoDB (official Node.js driver)
- HTML, CSS, JavaScript (fetch API)
- Bootstrap 5

## Installation and Running Locally

1. Clone the repository:

git clone https://github.com/bgl96395/Backend_Project.git
cd Hotel_Booking

2. Install dependencies:
 * npm install

3. Create a .env file in the project root with the following variables:
 * PORT=3000
 * MONGO_URI=mongodb+srv://Bigali:Nugmash@cluster0.jmdxiuw.mongodb.net/HotelBook?appName=Cluster0


## Start the server:
* npm server.js

## Open your browser and go to:
* http://localhost:3000

## Deployment

* The app deployed on Render.

## Production requirements:

* Set environment variables PORT and MONGO_URI via the hosting platform’s dashboard.

* Connect to a remote MongoDB cluster.

## Web Interface Usage

Root / shows the list of hotels with filtering and sorting.

Create tab — form to add a new hotel.

Update tab — form to update hotel details by ID.

Delete tab — delete hotel by ID.

## Deployed URL from Render

https://backend-project-ynie.onrender.com

## Team Members & Contributions

- Asylbek — Testing, documentation  
- Ansar — Frontend, UI/UX  
- Dinmuhamed — API routing, validation  
- Bigali — Backend, database integration 

