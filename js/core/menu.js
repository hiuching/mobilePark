;define([
'marionette',
'text!tpl/menu.html',
], function(Marionette, templateString){
/*********************************************
 * Templates
 *********************************************/
var tplAdminMenuView = $('#AdminMenuView', '<div>' + templateString + '</div>').html();
var tplCashierMenuView = $('#CashierMenuView', '<div>' + templateString + '</div>').html();
var tplOwnerMenuView = $('#OwnerMenuView', '<div>' + templateString + '</div>').html();
var tplPoliceMenuView = $('#PoliceMenuView', '<div>' + templateString + '</div>').html();
var tplUserMenuView = $('#UserMenuView', '<div>' + templateString + '</div>').html();

/*********************************************
 * Configurations
 *********************************************/
var module = "menu";
var configs = {};
var previousView = [];
/*********************************************
 * Main function (export)
 *********************************************/
var menu = function () {
var CachedCollection;
var CachedModel;
configs[module]  = {
	region: 'menuRegion',
	isCachedCollection: false
};
$.extend(true, configs, App.Config.toJSON());

      
/*********************************************
* Listening events
*********************************************/
      
	App.vent.on(module + ":displayUserMenu", function () {
		displayUserMenu();
	});

	App.vent.on(module + ":displayAdminMenu", function () {
		displayAdminMenu();
	});

	App.vent.on(module + ":displayCashierMenu", function () {
		displayCashierMenu();
	});

	App.vent.on(module + ":displayOwnerMenu", function () {
		displayOwnerMenu();
	});

	App.vent.on(module + ":displayPoliceMenu", function () {
		displayPoliceMenu();
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
var ModuleAdminMenuView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplAdminMenuView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
	'click #logout': 'logout',
	'click .nav a' : 'toogle'
	},
	logout: function(){
		App.vent.trigger('user:logout');
	},
	toogle: function(){
		$('.navbar-toggle').click()
	}
});

var ModuleCashierMenuView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplCashierMenuView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
	'click #logout': 'logout',
	'click .nav a' : 'toogle'
	},
	logout: function(){
		App.vent.trigger('user:logout');
	},
	toogle: function(){
		$('.navbar-toggle').click()
	}
});

var ModuleOwnerMenuView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplOwnerMenuView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
	'click #logout': 'logout',
	'click .nav a' : 'toogle'
	},
	logout: function(){
		App.vent.trigger('user:logout');
	},
	toogle: function(){
		$('.navbar-toggle').click()
	}
});

var ModulePoliceMenuView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplPoliceMenuView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
	'click #logout': 'logout',
	'click .nav a' : 'toogle'
	},
	logout: function(){
		App.vent.trigger('user:logout');
	},
	toogle: function(){
		$('.navbar-toggle').click()
	}
});

var ModuleUserMenuView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplUserMenuView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
	'click #logout': 'logout',
	'click .nav a' : 'toogle'
	},
	logout: function(){
		App.vent.trigger('user:logout');
	},
	toogle: function(){
		$('.navbar-toggle').click()
	}
});

/*********************************************
 * functions
 *********************************************/
var displayAdminMenu = function () {
	var model = new ModuleModel();
	var view = new ModuleAdminMenuView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayCashierMenu = function () {
	var model = new ModuleModel();
	var view = new ModuleCashierMenuView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayOwnerMenu = function () {
	var model = new ModuleModel();
	var view = new ModuleOwnerMenuView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayPoliceMenu = function () {
	var model = new ModuleModel();
	var view = new ModulePoliceMenuView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayUserMenu = function () {
	var model = new ModuleModel();
	var view = new ModuleUserMenuView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var resolve = function (alias) {
  displayUserMenu();
};

	return menu;   
});