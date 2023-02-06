require('dotenv').config();
const fetch = require('node-fetch');

const fetchRoverData = async (rover) => {
    const requestURL = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.API_KEY}`;
    try {
        const roverData = await fetch(requestURL).then(res => res.json());
        //console.log(roverData)
        return roverData;
    } catch (err) {
        console.log('error:', err);
    }
}


const fetchRoverImage = async (rover, recentDate) => {
    const requestURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${recentDate}&api_key=${process.env.API_KEY}`;
    try {
        const roverImage = await fetch(requestURL).then(res => res.json());
        //console.log(roverImage.photos[0].rover);
        return roverImage;
    } catch (err) {
        console.log('error:', err);
    }
}


module.exports = {
    fetchRoverData,
    fetchRoverImage
}