;define([
'marionette',
'text!tpl/homepage.html',
], function(Marionette, templateString){
/*********************************************
 * Templates
 *********************************************/
var tplHomepageView = $('#HomepageView', '<div>' + templateString + '</div>').html();

/*********************************************
 * Configurations
 *********************************************/
var module = "homepage";
var configs = {};
var previousView = [];
/*********************************************
 * Main function (export)
 *********************************************/
var homepage = function () {
var CachedCollection;
var CachedModel;
configs[module]  = {
	region: 'contentRegion',
	isCachedCollection: false
};
$.extend(true, configs, App.Config.toJSON());

      
/*********************************************
* Listening events
*********************************************/
      
	App.vent.on(module + ":displayHomepage", function () {
		displayHomepage();
	});

	App.vent.on(module + ":resolve", function (alias) {
		resolve(alias);
	});

};     
/*********************************************
* URLController
*********************************************/

/*********************************************
* Model
*********************************************/
var ModuleModel = Backbone.Model.extend({
	initialize: function () { 
	},  
	urlRoot: function () { return App.Utils.setUrl(configs) + '/' + module},
	idAttribute: '_id'
});
/*********************************************
 * Backbone Collection
 *********************************************/
var ModuleHomepageView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplHomepageView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
	}
});

/*********************************************
 * functions
 *********************************************/
var displayHomepage = function () {
	// App.Utils.setUrlPath({pathname: '#homepage'});
	if (App.user.isAdmin()){
		App.vent.trigger('menu:displayAdminMenu');
		App.vent.trigger('user:displayManageUser');
	} else if (App.user.isParkOwner()){
		App.vent.trigger('menu:displayOwnerMenu');
		App.vent.trigger('park:displayMyParkListFormView');
	} else if (App.user.isCashier()){
		App.vent.trigger('menu:displayCashierMenu');
		App.vent.trigger('user:displayCashForm');
	}  else if (App.user.isPolice()){
		App.vent.trigger('menu:displayPoliceMenu');
		App.vent.trigger('record:displayAlertRecord');
	} else {
		App.vent.trigger('menu:displayUserMenu');
		App.vent.trigger('park:displayHomeView');
	}
};

var resolve = function (alias) {
  displayHomepage();
};

	return homepage;   
});