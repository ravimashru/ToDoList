var express = require('express');
var app = express();
var portNumber = 8000;

// Service required files static
app.use(express.static(__dirname + '/app'));
app.use('/resources', express.static(__dirname + '/resources'));

// Resource routes
app.get('/userDetails', function(req, res) {

});

app.listen(portNumber);
console.log("Listening on port " + portNumber);