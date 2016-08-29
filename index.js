var tdl = require('./tdl');
var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var portNumber = 8000;

// for parsing application/json
app.use(bodyparser.urlencoded({ extended: true }));

// Service required files static
app.use(express.static(__dirname + '/app'));
app.use('/resources', express.static(__dirname + '/resources'));

// Resource routes
// Get all lists
app.get('/lists', function(req, res) {
  res.send(tdl.getAllLists());
});

// Delete a list
app.post('/deletelist', function(req, res) {
  // Get the name of the list to delete
  var listName = req.body.listName;

  // Check if 'listName' parameter has been
  // given in the body of the request
  if(listName) {

    tdl.deleteList(listName);
    res.send({
      message: "List successfully deleted"
    });
    res.status(200).end();

  } else {

    res.send({
      message: "Bad Request"
    });
    res.status(400).end();
    
  }

});

app.listen(portNumber);
console.log("Listening on port " + portNumber);