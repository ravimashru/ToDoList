sap.ui.define([
    "tdl/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Input",
    "sap/m/Button"
  ], function(BaseController, JSONModel, Filter,
      FilterOperator, MessageToast, Dialog,
      Input, Button) {

  "use strict";

  return BaseController.extend("tdl.controller.ListDetail", {

    onInit: function() {
      this.getRouter().getRoute("list").attachMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function(oEvent) {
      var listId = oEvent.getParameter('arguments').listId;

      var oModel = new JSONModel("/lists/" + listId);
      this.getView().setModel(oModel);
    },

    onListFilterSelect: function(oEvent) {
      var selectedFilter = oEvent.getParameter("key");

      var aFilters = [];

      switch(selectedFilter) {
        case "pending":
          aFilters.push(new Filter("done", FilterOperator.EQ, false));
          break;

        case "completed":
          aFilters.push(new Filter("done", FilterOperator.EQ, true));
          break;
      }

      this.getView().byId("idToDoList").getBinding("items").filter(aFilters);
    },

    onListItemSubmit: function(oEvent) {
      var oInput = oEvent.getSource();
      var sItem = oEvent.getParameter('value');
      var listId = this.getView().getModel().getProperty("/listId");

      if(sItem) {
        var req = jQuery.ajax({
          url: "/addListItem",
          method: "POST",
          data: {
            listId: listId,
            listItem: sItem
          }
        });

        var that = this;
        req.done(function() {
          // Push new item into the model
          that.getView().getModel().getProperty("/listItems").push({
            item: sItem,
            done: false
          });
          that.getView().getModel().refresh();

          // Reset the input control
          oInput.setValue("");

          // Increment the count of items in the list
          // Doing this to prevent a backend call
          var oAppModel = that.getView().getParent().getParent().getModel();
          var aLists = oAppModel.getProperty("/lists");
          var listIndex = aLists.findIndex(function(e, i, arr) {
            return e.listId === listId
          });
          var prevCount = oAppModel.getProperty("/lists/" + listIndex + "/listItemsCount");
          oAppModel.setProperty("/lists/" + listIndex + "/listItemsCount", prevCount+1);
          oAppModel.refresh();
        });

        req.fail(function(oError){
          MessageToast.show(oError.responseJSON.message);
        });
      }
    },

    handleSelectionChange: function(oEvent) {
      var listItem = oEvent.getParameter('listItem');
      var isSelected = oEvent.getParameter('selected');
      var index = listItem.getBindingContext()
                  .getPath().split("/")[2];
      var listId = this.getView().getModel().getProperty('/listId');

      var req = jQuery.ajax({
        url: "/toggleItemState",
        method: "POST",
        data: {
          listId: listId,
          itemIndex: index
        }
      });

      req.fail(function(){
        MessageToast.show("Oops! Something went wrong...");
        // Undo the change
        listItem.setSelected(!isSelected);
      });
    },

    handlePress: function(oEvent) {
      var itemData = oEvent.getSource().getBindingContext().getObject();

      var listItem = oEvent.getSource();
      var index = listItem.getBindingContext()
                  .getPath().split("/")[2];
      var listId = this.getView().getModel().getProperty('/listId');

      var oListItemNameInput = new Input({
        value: itemData.item
      });

      var oDeleteButton = new Button({
        icon: "sap-icon://delete",
        type: "Reject"
      });
      var oSaveButton = new Button({
        icon: "sap-icon://save",
        type: "Accept"        
      });
      var oCancelButton = new Button({
        icon: "sap-icon://sys-cancel"
      });

      var oDialog = new Dialog({
        showHeader: false,
        content: [oListItemNameInput],
        buttons: [oDeleteButton, oSaveButton, oCancelButton],
        afterClose: function() {
          oDialog.destroy();
        }
      });

      oCancelButton.attachPress(function(){
        oDialog.close();
      });

      var that = this;

      oSaveButton.attachPress(function(){

        var sNewName = oListItemNameInput.getValue();
        if(sNewName === itemData.item) {
          oDialog.close();
          return;
        }

        var req = jQuery.ajax({
          url: "/renameListItem",
          method: "POST",
          data: {
            listId: listId,
            itemIndex: index,
            newText: sNewName
          }
        });

        req.done(function(){
          oDialog.close();

          listItem.setTitle(sNewName);
        });

        req.fail(function(){
          MessageToast.show("Oops! Something went wrong...");
        });
      });

      oDeleteButton.attachPress(function(){
        oDialog.setBusy(true);
        var req = jQuery.ajax({
          url: "/deleteListItem",
          method: "POST",
          data: {
            listId: listId,
            itemIndex: index
          }
        });

        req.done(function(){
          oDialog.setBusy(false);
          oDialog.close();
          var iIndex = listItem.getParent().indexOfItem(listItem);
          var oModel = that.getView().getModel();
          oModel.getData().listItems.splice(iIndex, 1);
          oModel.refresh();
        });

        req.fail(function(){
          MessageToast.show("Oops! Something went wrong...");
        });
      });

      oDialog.open();
    }

  });

});