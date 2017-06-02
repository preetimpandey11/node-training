var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');
var mongoClient = require('mongodb').MongoClient;
var cluster = require('cluster');
var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

var db;
mongoClient.connect('mongodb://admin:admin@ds161121.mlab.com:61121/preedb', (err,dbase) => {
    if(err){
        return console.log(err);
    }
db = dbase;
});

app.use(bp.json());

if(cluster.isMaster){
var cpucount = require('os').cpus().length;
console.log(cpucount + "cpus available");
for( var i =0;i< cpucount;i++){
    cluster.fork();
}
}else {

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
   fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});


app.get('/tasks', (req,res) => {
    db.collection('mytasks').find().toArray(( err , result ) => {
       if(err){
           res.status(404).json({ "error" : "No data found"});
       }
        if(result){
        res.json(result);
        console.log("GET");
        console.log(cluster.worker.id);
    }
});
});

app.get('/tasks/:id',(req,res) => {
    var tmpid = parseInt(req.params.id);
   db.collection('mytasks').find().toArray(( err , result ) => {
       if(err){
           res.status(404).json({ "error" : "Id not found"});
       }
    if(result){
        res.json(result);
    }
});
});

app.delete('/tasks',(req,res) => {
db.collection('mytasks').findOneAndDelete({task : req.body.name}, (err,result) => {
if(err){
    return res.status(500).json({ "error" : "Id not found"});
}
res.send("record deleted");
console.log("DELETE");
console.log(cluster.worker.id);
});
});


app.post('/tasks', function(req,res){
    var temp = req.body;
    db.collection('mytasks').save(temp, (err,result) => {
if(err){
    return console.log(err);
}
res.json({ "message" : "saved to database."});
console.log("POST");
console.log(cluster.worker.id);
    });
   
});

app.listen(3000,() => {
    console.log("Server is up.");
});
}

