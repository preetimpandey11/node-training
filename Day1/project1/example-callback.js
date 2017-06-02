var weather = require('./weather.js');
var location = require('./mylocation');

location(function(loc){
    console.log("Location information")
    console.log(loc);
})

weather(function(currentWeather){
     console.log("Weather information")
    console.log(currentWeather);

});