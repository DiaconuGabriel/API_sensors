const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// post 
// postare in baza de date
async function addDataToTable(tableName, data) {
    const { data: insertedData, error } = await supabase
        .from(tableName)
        .insert([data])
        .select();

    if (error) {
        throw { message: 'Can\'t insert data.', status: 500 };
    }

    // console.log('Datele au fost inserate cu succes:', insertedData);
    return insertedData;
}

//get
//prelure din baza dupa locatie doar
async function getMeasurementsByLocation(tableName, location) {
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('city', location)
        .order('id', { ascending: true });

    if (error) {
        throw { message: 'Can\'t get data by location.', status: 500 };
    }

    return data;
}

//get
//preluare din baza dupa locatie si data
async function getMeasurementsByLocationAndDate(tableName, location, startDate, endDate) {
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('city', location)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('id', { ascending: true });

    if (error) {
        throw { message: 'Can\'t get data by location and date.', status: 500 };
    }

    return data;
}

//delete
//stergere din baza de date dupa locatie
async function deleteMeasurementsByLocation(tableName, location) {
    // Mai întâi, obținem datele care vor fi șterse
    const { data: dataToDelete, error: selectError } = await supabase
        .from(tableName)
        .select('*')
        .eq('city', location)
        .order('id', { ascending: true });

    if (selectError) {
        throw { message: 'Can\'t get data that need to be deleted.', status: 500 };
    }

    if (!dataToDelete || dataToDelete.length === 0) {
        return [];
    }

    const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('city', location);

    if (deleteError) {
        throw { message: 'Can\'t delete data by location.', status: 500 };
    }

    return dataToDelete;
}

//delete
//stergere din baza de date dupa locatie si data
async function deleteMeasurementsByLocationAndDate(tableName, location, startDate, endDate) {

    const { data: dataToDelete, error: selectError } = await supabase
        .from(tableName)
        .select('*')
        .eq('city', location)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('id', { ascending: true });

    if (selectError) {
        throw { message: 'Can\'t get data that need to be deleted.', status: 500 };
    }

    if (!dataToDelete || dataToDelete.length === 0) {
        return [];
    }

    const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('city', location)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

    if (deleteError) {
        throw { message: 'Can\'t delete data by location and date.', status: 500 };
    }

    return dataToDelete;
}

//put 
//actualizare in baza de date dupa id
async function updateMeasurementById(tableName, id, updatedData) {
    const { data, error } = await supabase
        .from(tableName)
        .update(updatedData)
        .eq('id', id)
        .select()
        .order('id', { ascending: true });

    if (error) {
        throw { message: 'Error to update measurement', status: 500 };
    }

    return data;
}

// get
// Funcție pentru a obține o măsurătoare după ID
async function getMeasurementById(tableName, id) {
    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single()
        .order('id', { ascending: true });

    if (error) {
        throw { message: 'There is no measurement with id: ' + id + '.', status: 500 };
    }

    return data;
}

module.exports = {
    addDataToTable,
    getMeasurementsByLocation,
    getMeasurementsByLocationAndDate,
    deleteMeasurementsByLocation,
    deleteMeasurementsByLocationAndDate,
    updateMeasurementById,
    getMeasurementById
};