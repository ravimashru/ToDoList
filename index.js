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
  var listId = req.body.listId;

  // Check if 'listId' parameter has been
  // given in the body of the request
  if(listId) {

    tdl.deleteList(listId);
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

// Create a new list
app.post("/createList", function(req, res) {
  // Get the name of the new list to create
  var listName = req.body.newListName;

  // Check if the newListName parameter is in
  // the body of the request
  if(listName) {

    // Check if the list already exists
    if(tdl.listExists(listName)) {
      res.status(200).send({message: "The list already exists"});
    } else {
      tdl.createList(listName);
      res.status(201).send({message: "The list was created"});
    }
  } else {
    res.status(400).send({message: "Bad Request"});
  }
});

// Rename a list
app.post("/renameList", function(req, res) {
  // Get the ID of the list to be renamed, and the new name
  var listId = req.body.listId;
  var newListName = req.body.newListName;

  if(listId && newListName) {
    var listRenamed = tdl.renameList(listId, newListName);
    if(listRenamed) {
      res.status(200).send({message: "The list was renamed"});
    } else {
      res.status(400).send({message: "The list could not be renamed"});
    }
  } else {
    res.status(400).send({message: "Bad Request"});
  }
});

// Get all the items in a list
app.get("/lists/:listid", function(req, res) {

  var listId = req.params.listid;
  var listDetail = tdl.getListItems(listId);

  if(listDetail) {
    res.send(listDetail);
  } else {
    res.status(404).send({message: "No such list"});
  }
});

// Add an item to a list
app.post("/addListItem", function(req, res) {
  var listId = req.body.listId;
  var listItem = req.body.listItem;

  if(listId && listItem) {
    var itemAdded = tdl.addListItem(listId, listItem);
    if(itemAdded) {
      res.status(200).send({message: "List item added"});
    } else {
      res.status(400).send({message: "Couldn't add item"});
    }
  } else {
    res.status(400).send({message: "Bad Request"});
  }
});

app.listen(portNumber);
console.log("Listening on port " + portNumber);