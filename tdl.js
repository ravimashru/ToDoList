var JsonDB = require('node-json-db');

var db = new JsonDB("tdl", true, true);

module.exports = {
  getAllLists: function() {

    var data = db.getData("/").todolist;
    var listInfos = [];

    data.forEach(function(element, index, arr) {
      listInfos.push({
        listId: element.id,
        listName: element.listName,
        listItemsCount: element.todoitems.length
      });
    });

    return {lists: listInfos};
  },

  deleteList: function(listName) {
    // Get the index of the list to delete in the data
    var listIndex = db.getData("/todolist").findIndex(function(e, i, arr) {
      return e.listName === listName;
    });

    if(listIndex > -1) {
      db.delete("/todolist[" + listIndex + "]");
    }
  }
}