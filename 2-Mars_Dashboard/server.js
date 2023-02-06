require('dotenv').config()
var express = require('express');
const { Map, List } = require('immutable');
const { fetchRoverData, fetchRoverImage } = require('./controllers/fetchDataController');

// create web server
const app = express();
const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// set upp public directory to serve static files
app.use(express.static('public'));

const roverNameList = List(['curiosity', 'opportunity', 'spirit']);
let recentDates = Map();

// the handler of get request from index page
app.get('/', async (req, res) => {
    const curiosityData = await fetchRoverData(roverNameList.get(0));
    const opportunityData = await fetchRoverData(roverNameList.get(1));
    const spiritData = await fetchRoverData(roverNameList.get(2));
    // The Promise.all() method takes an iterable of promises as an input,
    // and returns a single Promise that resolves to an array of the results of the input promises
    Promise.all([curiosityData, opportunityData, spiritData])
        .then(roversData => roversData.map(rover => {
            const manifest = rover.photo_manifest;
            const roverData = Map({
                name: manifest.name,
                landing_date: manifest.landing_date,
                launch_date: manifest.launch_date,
                status: manifest.status,
                max_date: manifest.max_date,
                total_photos: manifest.total_photos
            });
            return roverData;
        }))
        .then(roverData => {
            recentDates = recentDates.set('curiosity_date', roverData[0].get('max_date'))
                .set('opportunity_date', roverData[1].get('max_date'))
                .set('spirit_date', roverData[2].get('max_date'));
            // use res.render to load up an ejs view file
            res.render('pages/index', { roverData: roverData })
        });
});

// the handler of get request from the specific rover page
app.get('/:rover', async (req, res) => {
    // get the dynamic parameter
    const roverName = req.params.rover;
    // check if the roverName is in the roverNameList
    if (!roverNameList.includes(roverName)) {
        res.render('pages/404');
    } else {
        // get the photos
        const recentDate = recentDates.get(`${roverName}_date`);
        const imageResults = await fetchRoverImage(roverName, recentDate);
        const photos = List(imageResults.photos);

        // prepare the data structures for the server-side rendering
        const date = photos.get(0).earth_date;

        const roverInfo = Map(photos.get('0').rover);
        // iterate over the data and collect all url source of images
        const photosSrc = photos.reduce((previousValue, currentValue) => {
            return previousValue.push(currentValue['img_src']);
        }, List());

        let organizedPhotos = List();
        let tempPhotosSrc = List();
        for (let i = 0; i < photosSrc.size; i++) {
            tempPhotosSrc = tempPhotosSrc.push(photosSrc.get(i));
            // the nested list and the size of inner list is 4
            if (tempPhotosSrc.size === 4) {
                organizedPhotos = organizedPhotos.push(List([...tempPhotosSrc]));
                tempPhotosSrc = tempPhotosSrc.clear();
            }
        }
        // if the size of temp list is less then 4, also push the data to the list organizedPhotos
        if (tempPhotosSrc.size !== 0) {
            organizedPhotos = organizedPhotos.push(List([...tempPhotosSrc]));
        }

        // console.log('roverInfo', roverInfo);
        // console.log('date', date);
        // console.log('organizedPhotos', organizedPhotos)
        res.render('pages/photos', { roverInfo: roverInfo, date: date, photos: organizedPhotos });
    }
})


app.all((req, res) => {
    res.render('pages/404');
});


// listen to the port 3000
app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Example app listening on port ${port}!`)
})

