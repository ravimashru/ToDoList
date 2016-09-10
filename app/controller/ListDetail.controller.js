sap.ui.define([
    "tdl/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
  ], function(BaseController, JSONModel, Filter, FilterOperator, MessageToast) {

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
    }

  });

});