;define([
  "jquery",
  "underscore",
  "backbone",
  "jquery.cookie"
],
function($, _, Backbone, cookie){

/*********************************************
 * Configurations
 *********************************************/
  var module = "cookie";
  var configs = {};
    
    
/*********************************************
 * Main function (export)
 *********************************************/
  var Cookie = Backbone.Model.extend({
    defaults: {
		"alias": "",
		"lang": "",
		"module": "",
		"page": 1,
		"district" : "",
		"region" : "",
		"prev1": null
    },
   
    initialize: function(){
      configs[module] = {
        name: 'Park'
      };
      this.load();
    },
     
    save: function(options){
      var prev1 = this.toJSON();
      delete prev1.prev1;
      this.set({prev1: prev1});
      this.set(options);
      $.cookie(configs[module]['name'], JSON.stringify(this.toJSON()), {expires:7, path: "/"});  
    },
    
    load: function(){
      var token;
      if (typeof $.cookie(configs[module]['name']) !== 'undefined') {
        token = JSON.parse($.cookie(configs[module]['name']));
        this.set(token);
      }
    },
		
		isEng: function () {
			return (this.get('alias') == 'en-us');
		},
		
		isChi: function () {
			return (this.get('lang') == 'zh-hant');
		},
		
		isChangedLang: function () {
			return (this.get('lang') != this.get('prev1').lang);
		}
  })
    

/*********************************************
 * Return
 *********************************************/
  return Cookie;
 
});