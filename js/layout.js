;define([
  "marionette",
  "text!tpl/layout.html",
  "text!tpl/layout-login.html"
],

function (Marionette, htmlLayout, htmlLayoutLogin) {

/*********************************************
 * Main function (export)
 *********************************************/
 
    var tplLayout = [];
    tplLayout["layout"] = $('#Layout', '<div>' + htmlLayout + '</div>').html();
    tplLayout["layout-login"] = $('#Layout', '<div>' + htmlLayoutLogin + '</div>').html();
    
/*********************************************
 * Backbone Layout
 *********************************************/
var Layout = Backbone.Marionette.Layout.extend({
        initialize: function(options){
                this.template = _.template(tplLayout[options.tmplName]);
        },
        regions: {
        menuRegion: "#menuRegion",
        contentRegion: "#contentRegion"
        }
});
    
/*********************************************
 * Return
 *********************************************/
    return Layout;
   
});