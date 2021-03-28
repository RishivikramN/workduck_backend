# Guide
Deployed URL: https://workduck-frontend.web.app/login
# Tech Stack
- Node.js
- Express Framework
- Mongo DB

# API Documentation

## Authentication 
### End points
| User Auth |   URL |
|-----------|--------|
| Register User | {host}/api/users/registeruser|
| Login User | {host}/api/users/signinuser|

### Access Level for Entities
| Entity | Access Level |
|--------|--------------|
| Admin | Everything |
| User | Everything except Train Traffic Endpoint |

### Sample Request JSON Data
```
{
  "emailId": " ",
   "password":" "
}
```
Example
```
curl 
    --request POST 
    --url http://{host}/api/users/signinuser 
    --header 'cache-control: no-cache' 
    --header 'content-type: application/json' 
    --data '{"emailId": " ",password":" "}'
```
## Entity: Train
## GET Endpoints

|   URL | Result |
|--------|---------|
| {host}/api/trains/livestatus/:trainid | Returns the live status of the train |
| {host}/api/trains/getbookinghistory/:userid | Returns the seat booking history of a user |
| {host}/api/trains/:from-:to-:date | Returns all the trains based on the station and date |
| {host}/api/trains/:trainid | Returns a specific train requested by the user |
| {host}/api/trains/getseatbooking/:userid-:trainid-:seatid | Returns the data from seatbookingdetail entity |


## POST Endpoints

|   URL | Result |
|--------|---------|
| {host}/api/trains/bookseat | Books the seat requested by the user |
| {host}/api/trains/ | Used to create a new Train document in the Database |


All the other routes are basic CRUD operations which does not need any specific explanation.

