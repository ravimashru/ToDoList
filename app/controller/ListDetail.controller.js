sap.ui.define([
    "tdl/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ], function(BaseController, JSONModel, Filter, FilterOperator) {

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
    }

  });

});