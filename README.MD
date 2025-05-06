# Air Quality Measurement API

## You can test the api here: https://api-sensors-9kta.onrender.com/api_test

## Description

This is a simple REST API built with Express.js for managing air quality measurements. The API allows users to store, retrieve, update, and delete air quality data (CO2, PM2.5, temperature, and humidity) for predefined locations. The interface for testing was created with React and Tailwind.

## Features
- Retrieve measurements based on location and date range.
- Add new measurements with CO2, PM2.5, temperature, and humidity values.
- Update existing measurements by ID.
- Delete measurements entirely or within a specified date range.
- API key authentication to restrict access.

## Technologies Used
- Node.js (Express.js framework)
- Body-parser for handling JSON requests
- Moment.js for date and time management

## API Endpoints:

## 1. GET /measurements_get
Retrieves air quality measurements.

Parameters (query):
- location (string) - Required, must be a valid city
- startDate (string) - Optional, format DD.MM.YYYY
- endDate (string) - Optional, format DD.MM.YYYY

## 2. POST /measurements_post
Adds a new air quality measurement.

Request Body (JSON):
```json
{
  "location": "Iasi",
  "CO2": 400,
  "PM25": 25,
  "temperature": 22,
  "humidity": 50
}
```

## 3. PUT /measurements_put
Updates an existing measurement by ID.

Request Body (JSON):
```json
{
  "id": 1,
  "CO2": 420
}
```

## 4. DELETE /measurements_delete
Deletes measurements based on location and optional date range.

Parameters (query):
- location (string) - Required
- startDate and endDate (optional, DD.MM.YYYY format)

## Authentication
- All endpoints (except / and /api_test) require an API key in the request headers 'x-api-key: test_key'

##  5. /api_test
- Here you can test the API
  
![image](https://github.com/user-attachments/assets/3769aa65-f9d3-456d-8bfc-fbaa437dc93b)
![image](https://github.com/user-attachments/assets/0316e604-fbab-4db9-83f4-53d05cf5afb8)

