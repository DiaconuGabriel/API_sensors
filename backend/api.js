const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const valid_cities = ['Iasi', 'Bacau', 'Vaslui', 'Neamt', 'Botosani', 'Vrance', 'Galati'];
let measurements = {
    Iasi: [
      {
        id: 0,
        CO2: 18,
        PM25: 32,
        temperature: 9,
        humidity: 22,
        timestamp: 1742256000 // 18 martie 2025
      },
      {
        id: 1,
        CO2: 22,
        PM25: 28,
        temperature: 10,
        humidity: 26,
        timestamp: 1742342400 // 19 martie 2025
      },
      {
        id: 2,
        CO2: 19,
        PM25: 35,
        temperature: 11,
        humidity: 30,
        timestamp: 1743100800 // 25 martie 2025
      },
      {
        id: 3,
        CO2: 21,
        PM25: 31,
        temperature: 12,
        humidity: 27,
        timestamp: 1743187200 // 26 martie 2025
      },
      {
        id: 4,
        CO2: 20,
        PM25: 33,
        temperature: 10,
        humidity: 25,
        timestamp: 1743273600 // 27 martie 2025
      }
    ],
    Bacau: [
      {
        id: 5,
        CO2: 17,
        PM25: 30,
        temperature: 8,
        humidity: 20,
        timestamp: 1743700000 // 3 aprilie 2025
      },
      {
        id: 6,
        CO2: 23,
        PM25: 27,
        temperature: 11,
        humidity: 28,
        timestamp: 1743750000 // 4 aprilie 2025
      },
      {
        id: 7,
        CO2: 21,
        PM25: 29,
        temperature: 10,
        humidity: 24,
        timestamp: 1743800000 // 4 aprilie 2025
      }
    ]
  };
let id = 8;
const API_KEY = 'test_key';

const validateLocation = (location) => {
    if (!location) throw { message: 'Location is required!', status: 400 };
    if (Array.isArray(location)) throw { 
        message: 'Only one location parameter!', 
        status: 400 
    };
    if (!valid_cities.includes(location)) throw { message: 'Location not known!', status: 404 };
};

const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) throw { message: 'Both start and end dates are required!', status: 400 };

    if (Array.isArray(startDate) || Array.isArray(endDate)) throw { 
        message: 'Only one for startDate or endDate!', 
        status: 400 
    };
    const dateFormatRegex = /^([1-9]|0[1-9]|[12][0-9]|3[01])\.([1-9]|0[1-9]|1[0-2])\.\d{4}$/;

    if (!dateFormatRegex.test(startDate)) throw { 
        message: 'Start date must be in format D.M.YYYY or DD.MM.YYYY!', 
        status: 400 
    };
    
    if (!dateFormatRegex.test(endDate)) throw { 
        message: 'End date must be in format D.M.YYYY or DD.MM.YYYY!', 
        status: 400 
    };

    const formatDate = date => date.split('.').reverse().join('-');
    const start = new Date(formatDate(startDate));
    const end = new Date(formatDate(endDate));

    // console.log(start);
    // console.log(end);

    if (isNaN(start) || isNaN(end)) throw { message: 'Dates must be in format DD.MM.YYYY!', status: 400 };
    if (start > end) throw { message: 'Start date must be earlier than end date!', status: 400 };

    return { start, end };
};


const apiKeyMiddleware = (req, res, next) => {
    try{
        
        const apiKey = req.headers['x-api-key'];
        if (apiKey === API_KEY) {
            next();
        } else {
            throw({ message: 'Forbidden: Invalid API key!', status: 403 });
        }
    }
    catch (error) {
        res.status(error.status).json({ message: error.message, status: error.status });
        // console.log(error);
    }
};

app.get('/', (req, res) => res.json({ message: 'Hello World!' }));

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html', 'js', 'css', 'jsx'] }));

app.get('/api_test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(apiKeyMiddleware);

app.get('/measurements_get', (req, res) => {
    try {

        const { location, startDate, endDate } = req.query;
        
        validateLocation(location);

        if (!startDate && !endDate) {
            return res.status(200).json({
                location,
                measurements: measurements[location] || [],
                message: 'Measurements fetched by location!',
                status: 200
            });
        }

        const { start, end } = validateDateRange(startDate, endDate);

        const filteredMeasurements = (measurements[location] || []).filter(measurement => {
            const timestamp = new Date(measurement.timestamp * 1000);
            return timestamp >= start && timestamp <= end;
        });

        console.log(measurements);

        res.status(200).json({
            location,
            measurements: filteredMeasurements,
            message: 'Measurements fetched by location and date range!',
            status: 200
        });
    } catch (error) {
        res.status(error.status).json({ message: error.message, status: error.status });
    }
});

app.post('/measurements_post', (req, res) => {
    
    try {
       
        const { location, CO2, PM25, temperature, humidity } = req.body;

        validateLocation(location);
        if ([CO2, PM25, temperature, humidity].some(value => value === undefined || isNaN(value))) {
            throw { message: 'All fields must be present!', status: 400 };
        }

        const roTime = moment.tz('Europe/Bucharest').unix();
        const newMeasurement = {
            id: id++,
            CO2: parseInt(CO2, 10),
            PM25: parseInt(PM25, 10),
            temperature: parseInt(temperature, 10),
            humidity: parseInt(humidity, 10),
            timestamp: roTime
        };

        if (!(location in measurements)) {
            measurements[location] = [];
        }
        measurements[location].push(newMeasurement);
        console.log(measurements);

        res.status(200).json({
            location,
            measurement: newMeasurement,
            message: 'Measurement added successfully!',
            status: 200
        });
    } catch (error) {
        res.status(error.status).json({ message: error.message, status: error.status });
    }
});

app.delete('/measurements_delete', (req, res) => {
    try {

        const { location, startDate, endDate } = req.query;

        validateLocation(location);

        if (!startDate && !endDate) {
            if (!measurements[location] || !measurements[location].length){
                return res.status(200).json({ location , message: 'There were no measurements to delete!', status: 200 });
            }
            delete measurements[location];
            console.log(measurements);
            return res.status(200).json({ location, message: 'All measurements deleted!', status: 200 });
        }

        const { start, end } = validateDateRange(startDate, endDate);

        if (!measurements[location]) {
            return res.status(200).json({ location, message: 'There were no measurements to delete!', status: 200 });
        }

        const deletedMeasurements = measurements[location].filter(measurement => {
            const timestamp = new Date(measurement.timestamp * 1000);
            return timestamp >= start && timestamp <= end;
        });

        if(deletedMeasurements.length === 0) {
            return res.status(200).json({ location, message: 'There were no measurements to delete!', status: 200 });
        }

        measurements[location] = (measurements[location] || []).filter(measurement => {
            const timestamp = new Date(measurement.timestamp * 1000);
            return timestamp < start || timestamp > end;
        });

        if (!measurements[location].length) delete measurements[location];
        console.log(measurements);

        res.status(200).json({
            location,
            deletedMeasurements,
            message: 'Measurements deleted successfully!',
            status: 200
        });
    } catch (error) {
        res.status(error.status).json({ message: error.message, status: error.status });
    }
});

app.put('/measurements_put', (req, res) => {
    
    try {

        const {id, CO2, PM25, temperature, humidity } = req.body;

        if (id === undefined) {
            throw { message: 'ID is required!', status: 400 };
        }

        let foundMeasurement = null;
        let foundLocation = null;

        for (const location in measurements) {
            const measurementIndex = measurements[location].findIndex(m => m.id === parseInt(id));
            if (measurementIndex !== -1) {
                foundMeasurement = measurements[location][measurementIndex];
                foundLocation = location;
                break;
            }
        }

        if (!foundMeasurement) {
            throw { message: 'Measurement with given ID not found!', status: 404 };
        }

        if ([CO2, PM25, temperature, humidity].every(value => value === undefined)) {
            throw { message: 'At least one field must be provided to update!', status: 400 };
        }

        const oldMeasurement = structuredClone(foundMeasurement);
        
        if (CO2 !== undefined) foundMeasurement.CO2 = parseInt(CO2, 10);
        if (PM25 !== undefined) foundMeasurement.PM25 = parseInt(PM25, 10);
        if (temperature !== undefined) foundMeasurement.temperature = parseInt(temperature, 10);
        if (humidity !== undefined) foundMeasurement.humidity = parseInt(humidity, 10);

        console.log(measurements);

        res.status(200).json({
            location: foundLocation,
            measurement: {
                old:oldMeasurement,
                new:foundMeasurement},
            message: 'Measurement updated successfully',
            status: 200
        });

    } catch (error) {
        res.status(error.status).json({ message: error.message, status: error.status });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(measurements);
});
