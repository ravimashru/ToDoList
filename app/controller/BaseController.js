sap.ui.define(["sap/ui/core/mvc/Controller"], function(Controller) {

  "use strict";

  return Controller.extend("tdl.controller.BaseController", {

    getRouter: function() {
      return sap.ui.core.UIComponent.getRouterFor(this);
    }

  });

});