var JsonDB = require('node-json-db');
var uuid = require('uuid');

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

  deleteList: function(listId) {
    // Get the index of the list to delete in the data
    var listIndex = db.getData("/todolist").findIndex(function(e, i, arr) {
      return e.id === listId;
    });

    if(listIndex > -1) {
      db.delete("/todolist[" + listIndex + "]");
    }
  },

  listExists: function(listName) {
    var listIndex = db.getData("/todolist").findIndex(function(e, i, arr) {
      return e.listName === listName;
    });

    if(listIndex > -1) {
      return true;
    }
    return false;
  },

  createList: function(listName) {
    db.push("/todolist[]", {id: uuid.v1(), listName: listName, todoitems: []});
  },

  getList: function(listId) {
    var listIndex = db.getData("/todolist").findIndex(function(e, i, arr) {
      return e.id === listId;
    });
    return {
      index: listIndex,
      listData: db.getData("/todolist[" + listIndex + "]")
    };
  },

  renameList: function(listId, newlistName) {
    var oList = this.getList(listId);

    oList.listData.listName = newlistName;
    db.push("/todolist[" + oList.index + "]", oList.listData, true);
  },

  getListItems: function(listId) {

    var aLists = db.getData("/todolist");

    var oList;
    for(var i = 0; i < aLists.length; i++) {
      if(aLists[i].id === listId) {
        oList = aLists[i];
        break;
      }
    }

    if(!oList) {
      // Return false to indicate no such list
      return false;
    }

    return {
      listId: listId,
      listName: oList.listName,
      listItems: oList.todoitems
    };
  }
}