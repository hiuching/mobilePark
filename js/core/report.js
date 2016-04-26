;define([
'marionette',
"tablesorter",
"tablesorterPager",
'text!tpl/report.html',
], function(Marionette, tablesorter, tablesorterPager, templateString){
/*********************************************
 * Templates
 *********************************************/

var tplReportFormView = $('#ReportFormView', '<div>' + templateString + '</div>').html();
var tplReportItemView = $('#ReportItemView', '<div>' + templateString + '</div>').html();
var tplReportListView = $('#ReportListView', '<div>' + templateString + '</div>').html();
/*********************************************
 * Configurations
 *********************************************/
var module = "report";
var configs = {};
var searchItem = {};
var CachedCollection;
var CheckOutRegions;
/*********************************************
 * Main function (export)
 *********************************************/
var Report = function () {
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
	
	App.vent.on("report:URLController", function (alias) {
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
		if (decision  == 'report') {
			showReport();
		} else  if (decision  == 'newReport') {
			displayReportFormView();
		} else {
			showReport();
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
	getCode : function (){
		return this.get('code');
	},
	getCreated : function (){
		return this.get('created');
	},
	getHandler : function (){
		return this.get('handler');
	},
	getRegistrationMark : function (){
		return this.get('registrationMark');
	},
	getPark : function (){
		return this.get('park') || {};
	},
	getPhone : function (){
		if (this.getUser().phone && this.getUser().phone != ''){
			var phone = '(' + this.getUser().phone + ')';
		} else {
			var phone = '';
		}
		return phone;
	},
	getUser : function (){
		return this.get('user');
	},
	isActive : function (){
		return this.get('active');
	},
	setHandler : function (){
		this.set({handler: App.user.getId()});
	},
	setInActive : function (){
		this.set({active: false});
	},
	setUser: function(){
		this.set({user: App.user.getId()});
	},
	beforeRender: function(){
		var data = {
			name: this.getPark().name,
			time: new Date(this.getCreated()).toDateFormat('dd/MM HH:mm'),
			reporter: this.getUser().firstName + ' ' + this.getUser().lastName + ' ' + this.getPhone()
		}
		this.set(data);
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
var ModuleReportFormView = Backbone.Marionette.ItemView.extend({
	initialize: function(options){
	},
	template: _.template(tplReportFormView),
	events: {
	"submit"		: 	'submit'
	},
	submit: function(e){
		e.preventDefault();
		var data = {
			park: $('#park').val().trim(),
			registrationMark: $('#registrationMark').val().trim(),
			remark: $('#remark').val().trim()
		};
		if (data.park && data.park != '' && data.registrationMark && data.registrationMark != ''){
			this.model.setUser();
			this.model.save(data, {
				success: function (model) {
					App.vent.trigger('park:displayCheckInOutFormView');
				},
				error: function (model, err) {
					var str = 'Faile to submitted';
					if(err.responseText){
						str = JSON.parse(err.responseText).message;
					}
					App.Utils.showAlert({type: 'error', title: 'Error', content: str});
				}
			});
		} else {
			App.Utils.showAlert({type: 'error', title: 'Error', content: 'Missing park or registrationMark'});
		}
	}
});

var ModuleReportItemView = Backbone.Marionette.ItemView.extend({
	initialize: function(options){
	},
	template: _.template(tplReportItemView),
	tagName:'tr',
	onBeforeRender: function(){
		this.model.beforeRender();
	},
	events: {
		'click .deActivate'		: 'deActivate'
	},
	deActivate: function(){
		this.model.setInActive();
		this.model.setHandler();
		this.model.save({}, {
			success: function (model) {
				showReport();
			},
			error: function (model, err) {
				console.log('fail deActivate');
			}
		});
	}
});

/*********************************************
 * CompositeView
 *********************************************/
var ModuleReportListView = Backbone.Marionette.CompositeView.extend({
	initialize: function(){
		var self = this;
		this.callback = this.options.callback;
	},
	itemView: ModuleReportItemView,
	template: _.template(tplReportListView),
	appendHtml: function (collectionView, itemView, index) {
		collectionView.$(".reportList").append(itemView.el);
	},
	onShow: function(){
		if(App.Utils.detectmoblie()){
			$('#pager').hide();

			$("#reporttable").tablesorter({
				theme: 'default',
				widthFixed: false,
				widgets: ['zebra']
			})
		} else {
			$("#reporttable").tablesorter({
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
			showReport();
		}
	}
});

/*********************************************
 * functions
 *********************************************/

var displayReportFormView = function (options) {
	Backbone.history.navigate("#report/submitReport");
	options = options || {};
	var model = new ModuleModel();
	var view = new ModuleReportFormView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var showReport = function (options) {
	Backbone.history.navigate("#report/report");
	options = options || {};
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var options =  {
			coordinate: [position.coords.latitude, position.coords.longitude]
			};
			fetch(options, function (err, parks) {
				if (err) {
					console.log('fetch error');
				} else {
					var view = new ModuleReportListView({collection: parks, callback: showReport});
					App.layout[configs[module]['region']].show(view);
				}
			});
		});
	} else {
		console.log("Browser doesn't support Geolocation");
	}
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

	return Report;   
});