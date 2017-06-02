var request = require('request');
var url = 'http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=88b489b913d793cf7ff4a7a849cccf3a'

module.exports = function(callback){

request({ 
url : url,
json : true}, function( error, response, body){
if(error){
    callback("Uanble to fetch weather deatils");
}else{
    callback(body);
}
});
}

console.log("after request");