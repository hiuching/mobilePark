;define([
'marionette'
], function(Marionette){
/*********************************************
 * Templates
 *********************************************/


/*********************************************
 * Configurations
 *********************************************/
var module = "cost";
var configs = {};
var previousView = [];
var newRegion;

/*********************************************
 * Main function (export)
 *********************************************/
var Cost = function () {
var CachedCollection;
var CachedModel;
var searchItem;
configs[module]  = {
	region: 'contentRegion',
	isCachedCollection: false
};
$.extend(true, configs, App.Config.toJSON());

      
/*********************************************
* Listening events
*********************************************/
      
	App.vent.on(module + ":saveCost", function (options) {
		saveCost(options);
	});

	App.vent.on(module + ":resolve", function (alias) {
		resolve(alias);
	});
	
	App.vent.on("cost:URLController", function (alias) {
		URLController(alias);
	});
};     
/*********************************************
* URLController
*********************************************/
var URLController = function (alias) {
	var urlParas = alias.split('/');
	var decision = (urlParas[1]) ? urlParas[1] : '';

	if (urlParas) {
	}
};
/*********************************************
* Model
*********************************************/
var ModuleModel = Backbone.Model.extend({
	initialize: function () { 
	},  
	urlRoot: function () { return App.Utils.setUrl(configs) + '/' + module},
	idAttribute: '_id',
	getCost : function (){
		return this.get('cost');
	},
	getEndTime : function (){
		return this.get('endTime');
	},
	getStartTime : function (){
		return this.get('startTime');
	},
	getId : function (){
		return this.get('_id');
	},
	isActive : function(){
		return this.get('active');
	},
	setOwner : function(){
		this.set({owner: App.user.getId()});
	}
});

var ModuleCollection = Backbone.Collection.extend({
	initialize: function () { 
	},  
	url: function () { return App.Utils.setUrl(configs) + '/' + module},
	model: ModuleModel
});
/*********************************************
 * Backbone Collection
 *********************************************/
// var ModuleCostItemView = Backbone.Marionette.ItemView.extend({
	// template: _.template(tplCostItemView),
	// tagName:'tr',
	// onShow: function(){
	// },
	// events: {
		// 'click .edit'	: 'edit'
	// },
	// edit: function(){
		// var self = this;
		// displayCreateCostFormView({model: this.model});
	// }
// });

/*********************************************
 * functions
 *********************************************/
var saveCost = function (options) {
	options = options || {};
	var model = new ModuleModel(options.cost);
	model.set({park: options.park});
	model.save({}, {
		success: function (model) {
			options.callback(null, model);
		},
		error: function (err) {
			options.callback(err);
		}
	});
};

var fetch = function (options, callback) {
	options = options || {};
	var deferred = $.Deferred();
	cachedCollection = new ModuleCollection();
	cachedCollection.on("reset", function (data) {
		deferred.resolve(data);  // call deferred.done
	});

	var data = {
		action: options.action || ''
	};

	$.extend(data, options);
	cachedCollection.fetch({
		data: data,
		error: function (﻿collection, response) {
			callback(response.status, ﻿collection, response);
		}	
	});

	deferred.done(function () {
		callback(null, cachedCollection);
	});
};
	return Cost;   
});