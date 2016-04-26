
;define([
  "jquery",
  "underscore",
  "backbone"
],
function($, _, Backbone){
    
/*********************************************
 * Backbone Model
 *********************************************/
  var Config = Backbone.Model.extend({
    defaults: {
		"skipAuthentication": false,
		// "apiKey": "sdu93nln3uk0kas",
		// "apiSecret": "kumhsds0f93n489",
		"proto": "http://",
		"host": "ec2-52-68-199-65.ap-northeast-1.compute.amazonaws.com",
		"host": "127.0.0.1",
		"port": "8082",
		"path": "/park"
    }
 });




/*********************************************
 * Return
 *********************************************/
  return Config;
 
});
