;define([
'marionette',
"tablesorter",
"tablesorterPager",
"timepicker",
'text!tpl/record.html',
], function(Marionette, tablesorter, tablesorterPager, timepicker, templateString){
/*********************************************
 * Templates
 *********************************************/

var tplAlertRecordItemView = $('#AlertRecordItemView', '<div>' + templateString + '</div>').html();
var tplAlertRecordListView = $('#AlertRecordListView', '<div>' + templateString + '</div>').html();
var tplCheckOutByCashierFormView = $('#CheckOutByCashierFormView', '<div>' + templateString + '</div>').html();
var tplCheckOutByResultItemView = $('#CheckOutByResultItemView', '<div>' + templateString + '</div>').html();
var tplCheckOutByResultListView = $('#CheckOutByResultListView', '<div>' + templateString + '</div>').html();
var tplRecordItemView = $('#RecordItemView', '<div>' + templateString + '</div>').html();
var tplRecordListView = $('#RecordListView', '<div>' + templateString + '</div>').html();
/*********************************************
 * Configurations
 *********************************************/
var module = "record";
var configs = {};
var searchItem = {};
var CachedCollection;
var CheckOutRegions;
/*********************************************
 * Main function (export)
 *********************************************/
var Record = function () {
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
	
	App.vent.on(module + ":getReserveRecordByUser", function (options) {
		getReserveRecordByUser(options);
	}); 

	App.vent.on("record:deposit", function (alias) {
		deposit(alias);
	});
	
	App.vent.on("record:displayAlertRecord", function (alias) {
		displayAlertRecord(alias);
	});
	
	App.vent.on("record:findActiveParkingByUser", function (callback) {
		findActiveParkingByUser(callback);
	});
	
	App.vent.on("record:URLController", function (alias) {
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
		if (decision  == 'myRecord') {
			showRecordByUser();
		} else  if (decision  == 'forceCheckOut') {
			displayCheckOutByCashierFormView();
		} else  if (decision  == 'alertPark') {
			displayAlertRecord();
		} else {
			showRecordByUser();
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
	},
	getEndTime : function (){
		return this.get('endTime');
	},
	getHandler : function (){
		return this.get('handler');
	},
	getStartTime : function (){
		return this.get('startTime');
	},
	getType : function (){
		return this.get('type');
	},
	getUser : function (){
		return this.get('user');
	},
	getPark : function (){
		return this.get('park') || {};
	},
	getTotalCost : function (){
		return this.get('totalCost');
	}, 
	isActive : function (){
		return this.get('active');
	},
	isDeposit : function (){
		return this.getType() == 'deposit';
	},
	beforeRender: function(){
		var data = {
			code: this.getPark().code, 
			name: this.getPark().name, 
			phone: this.getUser().phone, 
			user: this.getUser().firstName + ' ' + this.getUser().lastName,
			startTime: new Date(this.getStartTime()).toDateFormat('dd/MM HH:mm'),
			timeLimit: this.getPark().timeLimit
		}
		if (this.isDeposit()){
			data.name = this.getHandler().lastName;
		}
		if(this.getEndTime()){
			data.endTime = new Date(this.getEndTime()).toDateFormat('dd/MM HH:mm')
		}
		this.set(data);
	},
	setUser: function(){
		var user = this.getUser();
		var park = this.getPark();
		this.set({username: user.lastName + ' ' + user.firstName, phone: user.phone, name: park.name});
	}
});

var ModuleCollection = Backbone.Collection.extend({
	initialize: function () { 
	},  
	url: function () { return App.Utils.setUrl(configs) + '/' + module},
	model: ModuleModel,
	filterCode: function (code) {
    return new ModuleCollection(this.filter(function (data) {
      return data.getPark().code == code;
    }));
  },
	getParks: function () {
    return new ModuleCollection(this.pluck('park'));
  }
});
/*********************************************
 * Backbone Collection
 *********************************************/
var ModuleRecordItemView = Backbone.Marionette.ItemView.extend({
	initialize: function(options){
	},
	template: _.template(tplRecordItemView),
	tagName:'li',
	className: 'list-group-item',
	onBeforeRender: function(){
		this.model.beforeRender();
	}
});

var ModuleAlertRecordItemView = Backbone.Marionette.ItemView.extend({
	initialize: function(options){
	},
	template: _.template(tplAlertRecordItemView),
	tagName:'tr',
	onBeforeRender: function(){
		this.model.beforeRender();
	}
});

var ModuleCheckOutByResultItemView = Backbone.Marionette.ItemView.extend({
	initialize: function(options){
	},
	template: _.template(tplCheckOutByResultItemView),
	tagName:'tr',
	onBeforeRender: function(){
		this.model.beforeRender();
		this.model.setUser();
	},
	events: {
		"click .checkout"  : "checkout"
	},
	checkout: function(){
		var self = this;
		App.vent.trigger("park:checkout", {parkCode: self.model.getPark().code, userId: self.model.getUser()._id, callback: function(){
			self.model.fetch({
				success: function (model) {
					var cost = 0 - model.getTotalCost();
					App.Utils.showAlert({type: 'success', title: 'Success', content: 'checkout successfully, charged $' + cost.toString()});
				}
			});
		}});
	}
});
/*********************************************
 * CompositeView
 *********************************************/
var ModuleAlertRecordListView = Backbone.Marionette.CompositeView.extend({
	initialize: function(){
		var self = this;
		this.callback = this.options.callback;
	},
	itemView: ModuleAlertRecordItemView,
	template: _.template(tplAlertRecordListView),
	appendHtml: function (collectionView, itemView, index) {
		collectionView.$(".alertRecordList").append(itemView.el);
	},
	onShow: function(){
		if(App.Utils.detectmoblie()){
			$('#pager').hide();

			$("#alertRecordtable").tablesorter({
				theme: 'default',
				widthFixed: false,
				widgets: ['zebra']
			})
		} else {
			$("#alertRecordtable").tablesorter({
					theme: 'default',
					widthFixed: true,
					widgets: ['zebra']
			}).tablesorterPager({
					container: $("#pager"),
					page: 0,
					size: 20,
					output: '{startRow} to {endRow} ({totalRows})'
			});
		}
	},
	events: {
		'click .refresh'	: 'refresh'
	},
	refresh: function(){
		var self = this;
		if(typeof this.callback == 'function'){
			this.callback();
		} else {
			displayAlertRecord();
		}
	}
});

var ModuleRecordListView = Backbone.Marionette.CompositeView.extend({
	initialize: function(){
		var self = this;
		this.callback = this.options.callback;
	},
	itemView: ModuleRecordItemView,
	template: _.template(tplRecordListView),
	appendHtml: function (collectionView, itemView, index) {
		collectionView.$(".recordList").append(itemView.el);
	},
	onShow: function(){
		// if(App.Utils.detectmoblie()){
			// $('#pager').hide();

			// $("#recordtable").tablesorter({
				// theme: 'default',
				// widthFixed: false,
				// widgets: ['zebra']
			// })
		// } else {
			// $("#recordtable").tablesorter({
					// theme: 'default',
					// widthFixed: true,
					// widgets: ['zebra']
			// }).tablesorterPager({
					// container: $("#pager"),
					// page: 0,
					// size: 20,
					// output: '{startRow} to {endRow} ({totalRows})'
			// });
		// }
	},
	events: {
		'click .refresh'	: 'refresh'
	},
	refresh: function(){
		var self = this;
		if(typeof this.callback == 'function'){
			this.callback();
		} else {
			showRecordByUser();
		}
	}
});

var ModuleCheckOutByCashierFormView = Backbone.Marionette.CompositeView.extend({
	template: _.template(tplCheckOutByCashierFormView),
	onShow: function(){
		var rm = new Marionette.RegionManager();
		CheckOutRegions = rm.addRegions({
			checkOutByResultRegion			: "#checkOutByResultRegion"
		});
	},
	events: {
		"submit": "submit",
		'click .refresh'	: 'submit'
	},
	submit: function(e){
		e.preventDefault();
		var data = {};
		if($('#searchBy').val() == 'user'){
			data.action = "findActiveParkingByUser",
			data.code = $('#code').val();
			fetch(data, function(err, records){
				if(err){
					console.log(err);
				} else {
					showResult({collection: records});
				}	
			})
		} else { 
			data.action = "findActiveParkingByPark",
			data.code = $('#code').val();showResult
			fetch(data, function(err, records){
				if(err){
					console.log(err);
				} else {
					showResult({collection: records});
				}
			})
		}
	
	}
});

var ModuleCheckOutByResultListView = Backbone.Marionette.CompositeView.extend({
	itemView: ModuleCheckOutByResultItemView,
	template: _.template(tplCheckOutByResultListView),
	appendHtml: function (collectionView, itemView, index) {
		collectionView.$(".checkOutByResultList").append(itemView.el);
	}
});

/*********************************************
 * functions
 *********************************************/

var displayAlertRecord = function (options) {
	Backbone.history.navigate("#record/alertPark");
	options = options || {};
	fetch({action: 'findAlertRecord'}, function(err, records){
		if(err){
			console.log(err);
		} else {
			var view = new ModuleAlertRecordListView({collection: records});
			App.layout[configs[module]['region']].show(view);
		}
	});
};

var displayCheckOutByCashierFormView = function (options) {
	Backbone.history.navigate("#record/forceCheckOut");
	options = options || {};
	var view = new ModuleCheckOutByCashierFormView();
	App.layout[configs[module]['region']].show(view);
};

var deposit = function (options) {
	options = options || {};
	options.action = 'deposit';
	var model = new ModuleModel();
	model.set(options);
	model.save({}, {
		success: function (model) {
			App.vent.trigger('user:displayDepositeDetail', model.getUser());
		},
		error: function (model, err) {
			var str = 'Faile to deposit';
			if(err.responseText){
				str = JSON.parse(err.responseText).message;
			}
			App.Utils.showAlert({type: 'error', title: 'Error', content: str});
		}
	});
};

var getReserveRecordByUser = function (options) {
	fetch({action: 'findReserveRecordByUser', user: App.user.getId()}, function(err, records){
		if(err){
			console.log(err);
		} else {
			var codes = [];
			records.getParks().each(function(park){
				codes.push(park.get("code"))
			});
			options.callback(null, codes);
		}
	})
};

var showResult = function (options) {
	options = options || {};
	if (!options.collection){
		options.collection = new ModuleCollection();
	}
	var view = new ModuleCheckOutByResultListView({collection: options.collection});
	CheckOutRegions.checkOutByResultRegion.show(view);
};


var showRecordByUser = function () {
	Backbone.history.navigate("#record/myRecord");
	fetch({action: 'findRecordByUser', owner: App.user.getId()}, function(err, records){
		if(err){
			console.log(err);
		} else {
			var view = new ModuleRecordListView({collection: records});
			App.layout[configs[module]['region']].show(view);
		}
	});
};

var findActiveParkingByUser = function (callback) {
	fetch({action: 'findActiveParkingByUser', code: App.user.getCode()}, function(err, records){
		if(err){
			console.log(err);
		} else {
			callback(null, records);
		}
	})
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
	return Record;   
});