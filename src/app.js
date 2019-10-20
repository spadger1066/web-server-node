const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// Define paths for Express config
const publicDir = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDir));

app.get('', (req, res) => {
   res.render('index', {
       title: 'Weather'
   })
});

app.get('/about', (req, res) => {
   res.render('about', {
       title: 'About Me'
   })
});

app.get('/help', (req, res) => {
   res.render('help', {
       title: 'Help',
       helpMsg: 'Try turning it off and back on again'
   })
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help',
        errorMsg: 'Help topic cannot be found'
    })
});

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'An address must be specified'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error, {forecastData}) => {
            if(error){
                return res.send({error})
            }
            res.send({
                forecastData,
                location,
                address: req.query.address
            })
        });
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMsg: 'Page not found'
    })
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});