# Air Quality Measurement API

## Description

This is a simple REST API built with Express.js for managing air quality measurements. The API allows users to store, retrieve, update, and delete air quality data (CO2, PM2.5, temperature, and humidity) for predefined locations.

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
