require('dotenv').config();
const { addDataToTable, getMeasurementsByLocation, getMeasurementsByLocationAndDate, deleteMeasurementsByLocation, deleteMeasurementsByLocationAndDate, updateMeasurementById, getMeasurementById } = require('./supabasetest.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const valid_cities = ['Iasi', 'Bacau', 'Vaslui', 'Neamt', 'Botosani', 'Vrance', 'Galati'];

const API_KEY = process.env.API_KEY;
const tableName = process.env.TABLE_NAME;

app.use(cors());

app.use(bodyParser.json());

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
    const start_obj = new Date(formatDate(startDate));
    const end_obj = new Date(formatDate(endDate));


    if (isNaN(start_obj) || isNaN(end_obj)) throw { message: 'Dates must be in format DD.MM.YYYY!', status: 400 };
    if (start_obj > end_obj) throw { message: 'Start date must be earlier than end date!', status: 400 };

    // Convertim în timestamp Unix (secunde)
    const start = Math.floor(start_obj.getTime() / 1000);
    const end = Math.floor(end_obj.getTime() / 1000);

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
        res.status(error.status || 500).json({ message: error.message, status: error.status });
    }
};

app.get('/', (req, res) => res.json({ message: 'Hello World!' }));

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html', 'js', 'css', 'jsx'] }));

app.get('/api_test', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(apiKeyMiddleware);

app.get('/measurements_get', async (req, res) => {
    try {
        
        const { location, startDate, endDate } = req.query;
        
        validateLocation(location);

        if (!startDate && !endDate) {
            const measurementsbylocation = await getMeasurementsByLocation(tableName, location);
            if(!measurementsbylocation || measurementsbylocation.length === 0){
                return res.status(200).json({ location, message: 'There were no measurements to get by location!', status: 200 });
            }
            return res.status(200).json({
                location,
                measurements: measurementsbylocation || [],
                message: 'Measurements fetched by location!',
                status: 200
            });
        }

        const { start, end } = validateDateRange(startDate, endDate);

        const measurementsbylocandate = await getMeasurementsByLocationAndDate(tableName, location, start, end);

        if(!measurementsbylocandate || measurementsbylocandate.length === 0){
            return res.status(200).json({ location, message: 'There were no measurements to get by location and date!', status: 200 });
        }
        res.status(200).json({
            location,
            measurements: measurementsbylocandate,
            message: 'Measurements fetched by location and date range!',
            status: 200
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message, status: error.status });
    }
});

app.post('/measurements_post', async (req, res) => {
    
    try {
       
        const { location, CO2, PM25, temperature, humidity } = req.body;

        validateLocation(location);
        if ([CO2, PM25, temperature, humidity].some(value => value === undefined || isNaN(value))) {
            throw { message: 'All fields must be present!', status: 400 };
        }

        const roTime = moment.tz('Europe/Bucharest').unix();
        const newMeasurement = {
            co2: parseInt(CO2, 10),
            'pm2.5': parseInt(PM25, 10),
            temperature: parseInt(temperature, 10),
            humidity: parseInt(humidity, 10),
            timestamp: roTime,
            city: location
        };

        const insertedData = await addDataToTable(tableName, newMeasurement);
        res.status(200).json({
            location,
            measurement: insertedData,
            message: 'Measurement added successfully!',
            status: 200
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message, status: error.status });
    }
});

app.delete('/measurements_delete', async (req, res) => {
    try {

        const { location, startDate, endDate } = req.query;

        validateLocation(location);

        if (!startDate && !endDate) {
            const deletedMeasurements = await deleteMeasurementsByLocation(tableName,location);

            if(deletedMeasurements && deletedMeasurements.length > 0){
                return res.status(200).json({ location, deletedMeasurements: deletedMeasurements,  message: 'All measurements deleted!', status: 200 });
            } else {
                return res.status(200).json({ location, message: 'There were no measurements to delete!', status: 200 });
            }
        }

        const { start, end } = validateDateRange(startDate, endDate);

        const deletedMeasurementsbyBoth = await deleteMeasurementsByLocationAndDate(tableName, location, start, end);

        if(!deletedMeasurementsbyBoth || deletedMeasurementsbyBoth.length === 0){
            return res.status(200).json({ location, message: 'There were no measurements to delete!', status: 200 });
        }
        
        res.status(200).json({
            location,
            deletedMeasurements : deletedMeasurementsbyBoth,
            message: 'Measurements deleted successfully!',
            status: 200
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message, status: error.status });
    }
});

app.put('/measurements_put', async (req, res) => {
    
    try {

        const {id, CO2, PM25, temperature, humidity } = req.body;

        if (id === undefined) {
            throw { message: 'ID is required!', status: 400 };
        }

        if ([CO2, PM25, temperature, humidity].every(value => value === undefined)) {
            throw { message: 'At least one field must be provided to update!', status: 400 };
        }

        const oldMeasurement = await getMeasurementById(tableName, id);
        
        if (!oldMeasurement) {
            throw { message: 'Measurement with given ID not found!', status: 404 };
        }
        
        const updatedData = {};
        if (CO2 !== undefined) updatedData.co2 = parseInt(CO2, 10);
        if (PM25 !== undefined) updatedData['pm2.5'] = parseInt(PM25, 10);
        if (temperature !== undefined) updatedData.temperature = parseInt(temperature, 10);
        if (humidity !== undefined) updatedData.humidity = parseInt(humidity, 10);

        const updateResult = await updateMeasurementById(tableName, id, updatedData);
        
        const newMeasurement = updateResult && updateResult.length > 0 ? updateResult : [];

        res.status(200).json({
            location: newMeasurement.city,
            measurement: {
                old: oldMeasurement,
                new: newMeasurement
            },
            message: 'Measurement updated successfully',
            status: 200
        });

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message, status: error.status });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
