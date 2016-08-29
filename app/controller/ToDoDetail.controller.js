sap.ui.define(["tdl/controller/BaseController"],
  function(BaseController) {

  "use strict";

  return BaseController.extend("tdl.controller.ToDoDetail", {

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