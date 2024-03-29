const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/d9229ce0fa5c3ba5df1768483a6f4a3e/' + latitude + ',' + longitude + '?units=si';
    request({url, json: true}, (error, {body}) => {
        if(error) {
            callback('Unable to connect to weather service.')
        } else if (body.error){
            callback('Unable to find location.')
        } else {
            callback(undefined, {
                forecastData: body.daily.data[0].summary + '. It is currently ' +
                    body.currently.temperature + ' degrees. There is ' +
                    body.currently.precipProbability + '% chance of rain and a wind speed of ' +
                    body.currently.windSpeed + '. UV Index is ' +
                    body.currently.uvIndex
            })
        }
    });
};

module.exports = forecast;