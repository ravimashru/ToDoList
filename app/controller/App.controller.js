sap.ui.define(["tdl/controller/BaseController",
    "sap/ui/model/json/JSONModel"], 
  
  function(BaseController, JSONModel) {

  "use strict";

  return BaseController.extend("tdl.controller.App", {

    onInit: function() {

      var oModel = new JSONModel();

      var req = jQuery.ajax({
        url: "/lists",
        type: "GET"
      });

      req.done(function(oData){
        oModel.setData(oData);
      });

      this.getView().setModel(oModel);

    }

  });

});