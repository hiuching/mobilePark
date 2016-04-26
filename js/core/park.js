;define([
'marionette',
"moment",
"tablesorter",
"tablesorterPager",
"timepicker",
'text!tpl/park.html',
], function(Marionette, moment, tablesorter, tablesorterPager, timepicker, templateString){
/*********************************************
 * Templates
 *********************************************/
var tplCheckInOutFormView = $('#CheckInOutFormView', '<div>' + templateString + '</div>').html();
var tplCreateParkFormView = $('#CreateParkFormView', '<div>' + templateString + '</div>').html();
var tplParkDetailFormView = $('#ParkDetailFormView', '<div>' + templateString + '</div>').html();
var tplParkItemView = $('#ParkItemView', '<div>' + templateString + '</div>').html();
var tplParkListView = $('#ParkListView', '<div>' + templateString + '</div>').html();
var tplSearchParkCompositeView = $('#SearchParkCompositeView', '<div>' + templateString + '</div>').html();

/*********************************************
 * Configurations
 *********************************************/
var module = "park";
var records;
var configs = {};
var searchItem = {};
var CachedCollection;
var ResultRegions;
var parkListRegions;
/*********************************************
 * Main function (export)
 *********************************************/
var Park = function () {
configs[module]  = {
	region: 'contentRegion',
	isCachedCollection: false
};
$.extend(true, configs, App.Config.toJSON());

      
/*********************************************
* Listening events
*********************************************/
     
	App.vent.on(module + ":checkout", function (options) {
		checkout(options);
	}); 
	
	App.vent.on(module + ":displayCheckInOutFormView", function () {
		displayCheckInOutFormView();
	}); 
	
	App.vent.on(module + ":displayCreateParkFormView", function () {
		displayCreateParkFormView();
	}); 
	
	App.vent.on(module + ":displayMyParkListFormView", function () {
		displayMyParkListFormView();
	});
	

	App.vent.on(module + ":resolve", function (alias) {
		resolve(alias);
	});
	
	App.vent.on("park:URLController", function (alias) {
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
		if (decision  == 'createPark') {
			displayCreateParkFormView();
		} else  if (decision  == 'myPark') {
			displayMyParkListFormView();
		} else  if (decision  == 'searchPark') {
			displaySearchParkView();
		} else  if (decision  == 'checkIn') {
			displayCheckInOutFormView();
		} else  if (decision  == 'scan') {
			scanQRCode();
		} else {
			displayCheckInOutFormView();
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
	getAddress : function (){
		return this.get('address');
	},
	getCoordinate : function (){
		return this.get('coordinate');
	},
	getCode : function (){
		return this.get('code');
	},
	getDistrict : function (){
		return this.get('district');
	},
	getName : function (){
		return this.get('name');
	},
	getPhone : function (){
		return this.get('phone');
	}, 
	getTimeLimit : function (){
		return this.get('timeLimit');
	},
	getTimeRange : function (){
		return this.get('timeRange') || [];
	},
	getStartTime1 : function (){
		return this.get('startTime1') || {};
	},
	getEndTime1 : function (){
		return this.get('endTime1') || {};
	},
	getType : function (){
		return this.get('type');
	},
	getOwner : function (){
		return this.get('owner');
	},
	getQuantity : function (){
		return this.get('quantity');
	},
	setCoordinate: function(coordinate1, coordinate2){
		this.set({coordinate: [coordinate1, coordinate2]});
	},
	setActive : function(){
		this.set({active: true});
	},
	isActive : function(){
		return this.get('active');
	},
	isAllowReserve : function(){
		return this.get('allowReserve');
	},
	beforeRender: function(){
		var data = {};
		var coordinate = this.getCoordinate() || [];
		data.coordinate1 = coordinate[0];
		data.coordinate2 = coordinate[1];
		this.getTimeRange().forEach(function(time){
			if(time.startTime && time.endTime){
				data.startTime1 = time.startTime
				data.endTime1 = time.endTime
				data.cost1 = time.cost
			}
			else {
				data.cost2 = time.cost
			}
		
		})
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
var ModuleCheckInOutFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplCheckInOutFormView),
	onShow: function () {
		if(App.user.isParking()){
			$('.panel-title').html('Check Out');
			$('.user-submit').html('Check Out');
		}
		var rm = new Marionette.RegionManager();
		parkListRegions = rm.addRegions({
			nearestParkListRegion				: "#nearestParkListRegion"
		});
		displayNearestParks();
	},
	events: {
		"submit"       										: "submit"
	},
	submit: function (e) {
		e.preventDefault();
		var self = this;
		var code = $('#code').val();
		if(App.user.isParking()){
			var data = {
				action: 'checkOut',
				code: code,
				user: App.user.getId()
			};
			
			this.model.save(data, {
				success: function (model) {
					var str = 'you have checked out to ' + model.getName();
					App.user.unsetParking();
					displayCheckInOutFormView();
					App.vent.trigger('user:refreshUser');
					App.Utils.showAlert({type: 'Success', title: 'Success', content: str});
				},
				error: function (model, err) {
					var str = 'Faile to check out';
					if(err.responseText){
						str = JSON.parse(err.responseText).message;
					}
					App.Utils.showAlert({type: 'error', title: 'Error', content: str});
				}
			});
		} else {
			if(App.user.getBalance() > 0){
				var data = {
					action: 'checkIn',
					code: code,
					user: App.user.getId()
				};
				this.model.save(data, {
					success: function (model) { 
						var str = 'you have checked in to ' + model.getName();
						App.user.setParking();
						displayCheckInOutFormView();
						App.Utils.showAlert({type: 'Success', title: 'Success', content: str});
					},
					error: function (model, err) {
						var str = 'Faile to check in';
						if(err.responseText){
							str = JSON.parse(err.responseText).message;
						}
						App.Utils.showAlert({type: 'error', title: 'Error', content: str});
					}
				});
			} else {
				App.Utils.showAlert({type: 'error', title: 'Error', content: 'Not enough balance'});
			}
		}
	}
});

var ModuleCreatParkFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplCreateParkFormView),
	onBeforeRender: function(){
		this.model.beforeRender();
	},
	onShow: function () {
		$(document).scrollTop(0);
		$('#startTime1').timepicker({timeFormat: 'H:i', disableTextInput: true});
		$('#endTime1').timepicker({timeFormat: 'H:i', 'minTime': '00:29', disableTextInput: true});
		this.setSecondRange();
	},
	events: {
		"submit"       					: "save",
		"change #endTime1"			: 'setSecondRange',
		"change #startTime1"		: 'setEndTimeTimepicker'
	},
	save: function (e) {
		e.preventDefault();
		var self = this;
		var data = {};
		var timeRange1 = {};
		
		
		timeRange1.startTime = $('#startTime1').val();
		timeRange1.endTime = $('#endTime1').val();
		timeRange1.cost = $('#cost1').val();
		data.timeRange = [timeRange1];
		if($('#cost2').val() != ''){
			var timeRange2 = {};
			timeRange2.cost = $('#cost2').val();
			data.timeRange.push(timeRange2)
		}
		
		data.type = $('input[name="type"]:checked').val();
		data.allowReserve = $('input[name="allowReserve"]:checked').val();
		data.name = $('#name').val().trim();
		data.district = $('#district').val();
		data.phone = $('#phone').val().trim();
		data.address = $('#address').val().trim();
		data.timeLimit = Number($('#timeLimit').val());
		data.quantity = Number($('#quantity').val());
		data.coordinate = [Number($('#coordinate1').val()), Number($('#coordinate2').val())];
		if(data.timeLimit <= 0){
			data.timeLimit = null;
		}
		if(App.user.isParkOwner()){
			data.owner = App.user.getId();
		}
		if(timeRange1.startTime && timeRange1.endTime && timeRange1.cost){
			self.model.set(data);
			self.model.save({}, {
				success: function (model) {
					if(App.user.isParkOwner()){
						displayMyParkListFormView();
					} else {
						displaySearchParkView();
					}	
				},
				error: function (model, err) {
					var str = 'Fail to create New car park';
					if(err.responseText){
						str = JSON.parse(err.responseText).message;
					}
					App.Utils.showAlert({type: 'error', title: 'Error', content: str});
				}
			});
		} else {
			App.Utils.showAlert({type: 'error', title: 'Error', content: 'Please enter timeRange'});
		}
	},
	setSecondRange: function(){
		$('#startTime2').prop('disabled', 'disabled');
		$('#endTime2').prop('disabled', 'disabled');
		if($('#startTime1').val() && $('#endTime1').val()){
			var startTime = moment($('#endTime1').val(), "HH:mm").add(1, 'minutes').format('HH:mm');
			var endTime = moment($('#startTime1').val(), "HH:mm").subtract(1, 'minutes').format('HH:mm');
			$('#startTime2').val(startTime);
			$('#endTime2').val(endTime);
		}
	},
	setEndTimeTimepicker: function(){
		if($('#startTime1').val()){
			$('#endTime1').timepicker('remove');
			var disableTime = moment($('#startTime1').val(), "HH:mm").format('hh:mma');
			$('#endTime1').timepicker({timeFormat: 'H:i', 'minTime': '00:29', disableTimeRanges: [['00:01am', disableTime]], disableTextInput: true});
		}
	}
});

var ModuleParkDetailFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplParkDetailFormView),
	onBeforeRender: function(){
		this.model.beforeRender();
	},
	onShow: function () {
		$(document).scrollTop(0);
		this.parpareForm();
	},
	events: {
		"click .user-cancel"       										: "cancel"
	},
	cancel: function (e) {
		e.preventDefault();
		var self = this;
		var pathname = "#" + Backbone.history.getFragment();
		URLController(pathname);
	},
	parpareForm: function(){
		var data = {};
			var startTime = moment(this.model.getEndTime1(), "HH:mm").add(1, 'minutes').format('HH:mm');
			var endTime = moment(this.model.getStartTime1(), "HH:mm").subtract(1, 'minutes').format('HH:mm');
			$('#startTime2').html(startTime);
			$('#endTime2').html(endTime);
			if(startTime == this.model.getStartTime1() && endTime == this.model.getEndTime1()){
				$('.timeRange2').hide();
			}
			var timeLimit = this.model.getTimeLimit() || 'N/L'
			$('#timeLimit').html(timeLimit);

	}
});

var ModuleParkItemView = Backbone.Marionette.ItemView.extend({
	initialize: function(options){
	},
	template: _.template(tplParkItemView),
	tagName:'li',
	className: 'list-group-item',
	onShow: function(){
		var self = this;
		if (App.user.isUser()){
			$('.edit').addClass('detail').removeClass('edit').html('detail');
		}
		if (this.model.getQuantity() <= 0  || !this.model.isAllowReserve()){
			$('.reserve', this.el).hide();
		}
		records.forEach(function(code){
			if (code == self.model.getCode() ){
				$('.reserve', self.el).hide();
			}
		});
	},
	events: {
		'click .edit'	: 'edit',
		'click .detail'	: 'detail',
		'click .reserve'	: 'reserve'
	},
	edit: function(){
		var self = this;
		displayCreateParkFormView({model: this.model});
	},
	detail: function(){
		var self = this;
		displayParkDetailView({model: this.model});
	},
	reserve: function(){
		var self = this;
			var data = {
				action: 'reserve',
				code: this.model.getCode(),
				user: App.user.getId()
			};
			this.model.save(data, {
				success: function (model) { 
					var str = 'you have reserve ' + model.getName() + 'for 1 mins';
					displayCheckInOutFormView();
					App.vent.trigger('user:refreshUser');
					App.Utils.showAlert({type: 'Success', title: 'Success', content: str});
				},
				error: function (model, err) {
					var str = 'Faile to reserve';
					if(err.responseText){
						str = JSON.parse(err.responseText).message;
					}
					App.Utils.showAlert({type: 'error', title: 'Error', content: str});
				}
			});
	}
});


/*********************************************
 * CompositeView
 *********************************************/
var ModuleParkListView = Backbone.Marionette.CompositeView.extend({
	initialize: function(){
		var self = this;
		this.callback = this.options.callback;
	},
	itemView: ModuleParkItemView,
	template: _.template(tplParkListView),
	appendHtml: function (collectionView, itemView, index) {
		collectionView.$(".parkList").append(itemView.el);
	},
	onShow: function(){
		// console.log(App.Utils.detectmoblie());
		// if(App.Utils.detectmoblie()){
			// $('#pager').hide();

			// $("#parktable").tablesorter({
				// theme: 'default',
				// widthFixed: false,
				// widgets: ['zebra']
			// })
		// } else {
			// $("#parktable").tablesorter({
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
		if (App.user.isUser()){
			$('.options').html('Detail');
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
			this.render();
		}
	}
});

var ModuleSearchParkCompositeView = Backbone.Marionette.CompositeView.extend({
	template: _.template(tplSearchParkCompositeView),
	onShow: function(){
        var rm = new Marionette.RegionManager();
        ResultRegions = rm.addRegions({
          ParkListRegion: "#parkListRegion"
        });
		if(searchItem['district']){
			this.submit();
		}
	},
	events: {
		'change #district'	: 'submit'
	},
	submit: function(){
		var self = this;
		if($('#district').val()){
			searchItem['district'] = $('#district').val();
		}
		displaySearchParkResultView(searchItem);
	}
});
/*********************************************
 * functions
 *********************************************/
var checkout = function (options) {
	options = options || {};
	var data = {
		action: 'checkOut',
		code: options.parkCode,
		user: options.userId
	};
	var model = new ModuleModel();
	model.save(data, {
		success: function (model) {
			options.callback(model);
		},
		error: function (model, err) {
			var str = 'Faile to check out';
			if(err.responseText){
				str = JSON.parse(err.responseText).message;
			}
			App.Utils.showAlert({type: 'error', title: 'Error', content: str});
		}
	});
};

var displayCheckInOutFormView = function (options) {
	Backbone.history.navigate("#park/checkIn");
	options = options || {};
	if (!options.model){
		options.model = new ModuleModel();	
	}
	var view = new ModuleCheckInOutFormView({model: options.model});
	App.layout[configs[module]['region']].show(view);
};

var displayCreateParkFormView = function (options) {
	Backbone.history.navigate("#park/createPark");
	options = options || {};
	if (!options.model){
		options.model = new ModuleModel();	
	}
	var view = new ModuleCreatParkFormView({model: options.model});
	App.layout[configs[module]['region']].show(view);
};

var displayMyParkListFormView = function () {
	// App.Utils.setUrlPath({pathname:"#park/myPark"});
	Backbone.history.navigate("#park/myPark");
	App.vent.trigger("record:getReserveRecordByUser", {callback: function(err, reserveRecords){
		records = reserveRecords;
		fetch({action: 'findParkByOwner', owner: App.user.getId()}, function(err, parks, response){
			if(err){
				console.log(err);
			} else {
				var view = new ModuleParkListView({collection: parks, callback: displayMyParkListFormView});
				App.layout[configs[module]['region']].show(view);		
			}
		})
	}});
};

var displayNearestParks = function () {
	App.vent.trigger("record:getReserveRecordByUser", {callback: function(err, reserveRecords){
		records = reserveRecords;
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var options =  {
				action : 'findNearestParks',
				coordinate: [position.coords.latitude, position.coords.longitude]
				};
				fetch(options, function (err, parks) {
					if (err) {
						console.log('fetch error');
					} else {
						var view = new ModuleParkListView({collection: parks, callback: displayNearestParks});
						parkListRegions.nearestParkListRegion.show(view);
					}
				});
			});
		} else {
			console.log("Browser doesn't support Geolocation");
		}
	}});
};

var displayParkDetailView = function (options) {
	options = options || {};
		var view = new ModuleParkDetailFormView({model: options.model});
		App.layout[configs[module]['region']].show(view);		
};

var displaySearchParkView = function (options) {
	Backbone.history.navigate("#park/searchPark");
	options = options || {};
	var view = new ModuleSearchParkCompositeView();
	App.layout[configs[module]['region']].show(view);		
};

var displaySearchParkResultView = function (options) {
	options = options || searchItem;
	// App.Utils.setUrlPath({pathname:"#park/myPark"});
	App.vent.trigger("record:getReserveRecordByUser", {callback: function(err, reserveRecords){
		records = reserveRecords;
		fetch({action: 'findParkByDistrict', district: options.district}, function(err, parks){
			if(err){
				console.log(err);
			} else {
				var view = new ModuleParkListView({collection: parks, callback: displaySearchParkResultView});
				ResultRegions.ParkListRegion.show(view);
			}
		})
	}});
};

var scanQRCode = function (options) {
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			if(!result.cancelled)
			{
				alert("Barcode type is: " + result.format);
				alert("Decoded text is: " + result.text);
			}
			else
			{
				alert("You have cancelled scan");
			}
		},
		function (error) {
				alert("Scanning failed: " + error);
		}
	);
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
	return Park;   
});