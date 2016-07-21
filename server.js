var http = require('http');
var express  = require('express');
var app      = express();                              

app.use(express.static(__dirname + ''));

app.get('', function(req, res) {
    res.sendfile('index.html'); 
});

app.listen(3000);
console.log("App listening on port 3000");

