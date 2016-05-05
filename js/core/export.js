;define([
'marionette',
'text!tpl/export.html',
], function(Marionette, templateString){
/*********************************************
 * Templates
 *********************************************/
var tplOwnerExportFormView = $('#OwnerExportFormView', '<div>' + templateString + '</div>').html();
var tplCashierExportFormView = $('#CashierExportFormView', '<div>' + templateString + '</div>').html();

/*********************************************
 * Configurations
 *********************************************/
var module = "export";
var configs = {};
var searchItem = {};
var CachedCollection;
var parkListRegions;
/*********************************************
 * Main function (export)
 *********************************************/
var Export = function () {
configs[module]  = {
	region: 'contentRegion',
	isCachedCollection: false
};
$.extend(true, configs, App.Config.toJSON());

      
/*********************************************
* Listening events
*********************************************/
     

	App.vent.on(module + ":resolve", function (alias) {
		resolve(alias);
	});
	
	App.vent.on(module + ":exportParkIncomeReport", function (options) {
		exportOwnerReport(options);
	});
	
	App.vent.on("export:URLController", function (alias) {
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
		if (decision  == 'ownerExport') {
			showOwnerExport();
		} else if (decision  == 'cashierExport'){
			showCashierExport();
		} else {
			showOwnerExport();
		}
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
	getId :function (){
		return this.get('_id') || '';
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
var ModuleOwnerExportFormView = Backbone.Marionette.ItemView.extend({
	initialize: function(options){
	},
	template: _.template(tplOwnerExportFormView),
	onShow: function(){
		var rm = new Marionette.RegionManager();
		parkListRegions = rm.addRegions({
			parkRegion				: "#parkRegion"
		});
		displayParks();
	}
});

var ModuleCashierExportFormView = Backbone.Marionette.ItemView.extend({
	initialize: function(options){
	},
	template: _.template(tplCashierExportFormView),
	events: {
		'submit': 	'summary'
	},
	summary: function(e){
		e.preventDefault();
		searchItem = {
			dateFrom: $('#year').val() + '-' + $('#month').val() + '-' + '01',
			dateTo: $('#year').val() + '-' + $('#month').val() + '-' + '31',
			handler: App.user.getId()
		};
		exportCashierReport(searchItem);
	}
});

/*********************************************
 * CompositeView
 *********************************************/


/*********************************************
 * functions
 *********************************************/

var showCashierExport = function (options) {
	Backbone.history.navigate("#export/cashierExport");
	var view = new ModuleCashierExportFormView({model: new ModuleModel()});
	App.layout[configs[module]['region']].show(view);
};

var showOwnerExport = function (options) {
	Backbone.history.navigate("#export/ownerExport");
	var view = new ModuleOwnerExportFormView({model: new ModuleModel()});
	App.layout[configs[module]['region']].show(view);
};

var displayParks = function (options) {
	App.vent.trigger('park:getParkListFormView', {action: 'findParkByOwner', ownerId: App.user.getId(), exportButton: true, callback: function(view){
		parkListRegions.parkRegion.show(view);
	}});
};


var exportCashierReport = function (options) {
	var model = new ModuleModel();
	var url = App.Utils.setUrl(configs) + '/' + module + "?action=exportCashierReport&filename=cashierReport&handler=" + options.handler + "&dateFrom=" + options.dateFrom + "&dateTo=" + options.dateTo;
	window.open(url,'_blank');
};

var exportOwnerReport = function (options) {
	var model = new ModuleModel();
	var dateFrom = '2016-05-01';
	var dateTo = '2016-05-31';
		// fetch({action: 'exportOwnerIncomeReport', park: options.park, dateTo: dateTo, dateFrom: dateFrom}, function(err, parks){
			// return;
		// });
	var url = App.Utils.setUrl(configs) + '/' + module + "?action=exportOwnerIncomeReport&filename=ownerIncomeReport&park=" + options.park + "&dateFrom=" + dateFrom + "&dateTo=" + dateTo;
	window.open(url,'_blank');
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

	Date.prototype.toDateFormat = function(format) {
		 var monthAbbrNames = ['Month', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		 var monthFullNames = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		 
		 var yyyy = this.getFullYear().toString();
		 var month = (this.getMonth()+1); // getMonth() is zero-based
		 MM = month < 10 ? "0" + month : month;
		 var dd  = this.getDate();
		 dd  = dd > 9 ? dd : "0" + dd;
		 var HH = this.getHours();
		 HH  = HH > 9 ? HH : "0" + HH;
		 var mm = this.getMinutes();
		 mm  = mm > 9 ? mm : "0" + mm;
		 var ss = this.getSeconds();
		 ss  = ss > 9 ? ss : "0" + ss;
		 var fff = this.getMilliseconds().toString();

		 var formattedDate = format;
		 formattedDate = formattedDate.replace('MMMM', monthFullNames[month]);
		 formattedDate = formattedDate.replace('MMM', monthAbbrNames[month]);
		 formattedDate = formattedDate.replace('yyyy', yyyy);
		 formattedDate = formattedDate.replace('MM', MM);
		 formattedDate = formattedDate.replace('dd', dd);
		 formattedDate = formattedDate.replace('HH', HH);
		 formattedDate = formattedDate.replace('mm', mm);
		 formattedDate = formattedDate.replace('ss', ss);
		 formattedDate = formattedDate.replace('fff', fff);
		 
		 return formattedDate;
	};

	return Export;   
});