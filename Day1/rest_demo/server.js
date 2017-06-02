var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var app = express();
var id = 1;

var tasks =[];

app.use(bp.json());

app.get('/tasks', (req,res) => {
    res.json(tasks);
});

app.get('/tasks/:id',(req,res) => {
    var tmpid = parseInt(req.params.id);
    var result = _.findWhere(tasks,{id : tmpid});
    if(result){
        res.json(result);
    }else {
        res.status(404).json({ "error" : "Id not found"});
    }
});

app.delete('/tasks/:id',(req,res) => {
var tmpId = parseInt(req.params.id);
var result = _.findWhere(tasks,{id : tmpId});
if(!result){
    res.status(404).json({ "error" : "Id not found"});
}else {
    tasks = _.without(tasks,result);
    res.json(result);
}
});

app.post('/tasks', function(req,res){
    var temp = req.body;
    temp.id = id++;
    tasks.push(temp);
    res.json(temp);
});

app.listen(3000,() => {
    console.log("Server is up.");
})