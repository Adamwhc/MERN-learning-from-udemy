// const axios = require('axios');

// const HttpEorror = require('../models/http-error');

// const API_KEY = 'AIzaSyAbqamfVgrwieqzw9eKanV3EFbpHG5Zjio';

async function getCoordsForAddress(address) {
    
    return {
        lat: 40.7484474,
        lng: -73.9871516
    };
    // const response =await axios.get(
    //     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent({address})}&key=${API_KEY}`
    // );

    // const data = response.data;

    // if (!data || data.status === 'ZERO_RESULTS') {
    //     throw error = new HttpEorror(
    //         'Could not find the location for the address', 
    //         422
    //     );
    // }

    // const coordinates = data.results[0].geometry.location;

    // return coordinates;
}

module.exports = getCoordsForAddress;