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
    
  });

});