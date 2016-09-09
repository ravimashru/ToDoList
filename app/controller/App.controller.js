sap.ui.define(["tdl/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/MessageToast"],
  
  function(BaseController, JSONModel, Dialog, Button, Input, MessageToast) {

  "use strict";

  return BaseController.extend("tdl.controller.App", {

    onInit: function() {

      var oModel = new JSONModel("/lists");

      // var req = jQuery.ajax({
      //   url: "/lists",
      //   type: "GET"
      // });

      // req.done(function(oData){
      //   oModel.setData(oData);
      // });

      this.getView().setModel(oModel);

    },

    onListItemPress: function(oEvent) {
      var pressedItem = oEvent.getParameter('listItem');
      var listId = pressedItem.getBindingContext().getProperty('listId');

      this.getRouter().navTo("list", {
        listId: listId
      });
    },

    onAddNewList: function() {
      // Create a dialog to get the new category to add
      if(!this._oAddListDialog) {

        var that = this;
        var oListInput = new Input();

        var oAddButton = new Button({
          text: "Add"
        });

        oAddButton.attachPress(function(){
          that._oAddListDialog.setBusy(true);

          var newListName = oListInput.getValue();
          var req = jQuery.ajax({
            url: "/createList",
            method: "POST",
            data: {
              newListName: newListName
            }
          });

          req.done(function(data, status, jqXHR){
            if(jqXHR.status == 200) {
              that._oAddListDialog.setBusy(false);
              // TO DO: Replace with text from response
              MessageToast.show("The list already exists");
            } else if (jqXHR.status == 201) {
              that._oAddListDialog.setBusy(false);
              that._oAddListDialog.close();
              // TO DO: Replace with text from response
              MessageToast.show("The list was added");
            }
          }).then(function(){
            
            // Workaround: Wait 500ms before making call to get
            // updated list
            that.getView().setBusy(true);
            jQuery.sap.delayedCall(500, that, function(){
              this.getView().getModel().loadData("/lists");
              this.getView().setBusy(false);
            });
          });

          req.fail(function(){
            MessageToast.show("Ooops... Something went wrong :(");
            that._oAddListDialog.setBusy(false);
          });

        });

        this._oAddListDialog = new Dialog({
          title: "Add New Category",
          content: oListInput,
          beginButton: oAddButton,
          endButton: new Button({
            text: "Cancel",
            press: function() {
              that._oAddListDialog.close();
            }
          })
        });
      }

      // Open the dialog
      this._oAddListDialog.open();
    },

    onPressDetail: function(oEvent) {
      // Get the list data of the pressed list
      var listData = oEvent.getSource().getBindingContext().getProperty();

      var oListNameInput = new Input({
        value: listData.listName
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
        content: [oListNameInput],
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
        var sNewName = oListNameInput.getValue();
        if(sNewName === listData.listName) {
          oDialog.close();
          return;
        }

        var req = jQuery.ajax({
          url: "/renameList",
          method: "POST",
          data: {
            listId: listData.listId,
            newListName: sNewName
          }
        });

        req.done(function(){
          MessageToast.show("List name updated successfully");
          oDialog.close();

          that.getView().setBusy(true);
          jQuery.sap.delayedCall(500, that, function(){
            this.getView().getModel().loadData("/lists");
            this.getView().setBusy(false);
          });
        });
      });

      oDeleteButton.attachPress(function(){
        oDialog.setBusy(true);
        var req = jQuery.ajax({
          url: "/deleteList",
          method: "POST",
          data: {
            listId: listData.listId
          }
        });

        req.done(function(){
          oDialog.setBusy(false);
          oDialog.close();
          MessageToast.show("List deleted successfully");

          that.getView().setBusy(true);
          jQuery.sap.delayedCall(500, that, function(){
            this.getView().getModel().loadData("/lists");
            this.getView().setBusy(false);
          });
        });
      });

      oDialog.open();
    }
    
  });

});