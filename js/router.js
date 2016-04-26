﻿define([
  "marionette",
  "controller"
],

function (Marionette, controller) {

        
    var Router = Backbone.Marionette.AppRouter.extend({
      controller: controller,
      routes : {
        '*alias': 'resolve'
      },
      resolve: function (alias){
        return this.controller.resolve(alias);
      }
    });
    return Router;
});