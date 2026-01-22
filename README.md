# Hotel Booking Web Application

## CRUD API with MongoDB Native Driver

- Database used: MongoDB   

## Collection structure

- Collection: hotels 
- Fields: name (String), price_per_night (Number) ,country (String)

## Middleware
- express.json()
- Custom logger (HTTP method + URL)

## Database
- MongoDB required
- MongoDB native Node.js driver only
- Database: HotelBook
- Collection: hotels
- Collection is created automatically on first insert

## API Routes

- GET /api/hotels — get all hotels  
- GET /api/hotels/:id — get hotel by id  
- POST /api/hotels — create new hotel (send JSON with name and country)  
- PUT /api/hotels/:id — update hotel by id (send JSON with name and country)  
- DELETE /api/hotels/:id — delete hotel by id

### GET /api/hotels
Return all hotels  
Supports query parameters:
- country — filter by country
- minPrice — price >= value
- sort=price — sort by price ascending
- sort=priceDesc — sort by price descending
- fields=name,country — projection

## How to Run the Project
 
1. Setup PostgreSQL `npm install mongodb`
2. Setup database named `HotelBook` and configure connection 
2. Run the server:  `node server.js`  
5. Open browser at http://localhost:3000

## Team Members & Contributions

- Asylbek — Testing, documentation  
- Ansar — Frontend, UI/UX  
- Dinmuhamed — API routing, validation  
- Bigali — Backend, database integration 

