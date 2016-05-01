;define([
'marionette',
"tablesorter",
"tablesorterPager",
'text!tpl/user.html',
], function(Marionette, tablesorter, tablesorterPager, templateString){
/*********************************************
 * Templates
 *********************************************/
var tplCashFormView = $('#CashFormView', '<div>' + templateString + '</div>').html();
var tplDepositItemView = $('#DepositItemView', '<div>' + templateString + '</div>').html();
var tplDepositFormView = $('#DepositFormView', '<div>' + templateString + '</div>').html();
var tplchangeEmailAndPasswordFormView = $('#ChangeEmailAndPasswordFormView', '<div>' + templateString + '</div>').html();
var tplChangeEmailFormView = $('#ChangeEmailFormView', '<div>' + templateString + '</div>').html();
var tplChangePasswordFormView = $('#ChangePasswordFormView', '<div>' + templateString + '</div>').html();
var tplCreateOwnerFormView = $('#CreateOwnerFormView', '<div>' + templateString + '</div>').html();
var tplCreatePoliceFormView = $('#CreatePoliceFormView', '<div>' + templateString + '</div>').html();
var tplCreateCashierFormView = $('#CreateCashierFormView', '<div>' + templateString + '</div>').html();
var tplForgotPasswordFormView = $('#ForgotPasswordFormView', '<div>' + templateString + '</div>').html();
var tplLoginFormView = $('#LoginFormView', '<div>' + templateString + '</div>').html();
var tplManageUserView = $('#ManageUserView', '<div>' + templateString + '</div>').html();
var tplProfileFormView = $('#ProfileFormView', '<div>' + templateString + '</div>').html();
var tplCashierProfileFormView = $('#CashierProfileFormView', '<div>' + templateString + '</div>').html();
var tplOwnerProfileFormView = $('#OwnerProfileFormView', '<div>' + templateString + '</div>').html();
var tplSignUpFormView = $('#SignUpFormView', '<div>' + templateString + '</div>').html();
var tplCashierItemView = $('#CashierItemView', '<div>' + templateString + '</div>').html();
var tplCashierListView = $('#CashierListView', '<div>' + templateString + '</div>').html();
var tplUserItemView = $('#UserItemView', '<div>' + templateString + '</div>').html();
var tplUserListView = $('#UserListView', '<div>' + templateString + '</div>').html();
var tplOwnerItemView = $('#OwnerItemView', '<div>' + templateString + '</div>').html();
var tplOwnerListView = $('#OwnerListView', '<div>' + templateString + '</div>').html();
var tplPoliceItemView = $('#PoliceItemView', '<div>' + templateString + '</div>').html();
var tplPoliceListView = $('#PoliceListView', '<div>' + templateString + '</div>').html();

/*********************************************
 * Configurations
 *********************************************/
var module = "user";
var configs = {};
var previousView = [];
var newRegion, cashierRegion;

/*********************************************
 * Main function (export)
 *********************************************/
var User = function () {
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
      
	App.vent.on(module + ":forgotPassword", function () {
		displayForgotPasswordForm();
	});
	
	App.vent.on(module + ":displayDepositeDetail", function (user) {
		console.log(user);
		displayDepositeDetail(user);
	});
	
	App.vent.on(module + ":displayManageUser", function () {
		displayManageUser();
	});
	
	App.vent.on(module + ":displayProfileForm", function () {
		displayProfileForm();
	});

	App.vent.on(module + ":displayCashierProfileForm", function () {
		displayCashierProfileForm();
	});
	
	App.vent.on(module + ":displayOwnerProfileFormView", function () {
		displayOwnerProfileFormView();
	});
	
	App.vent.on(module + ":displayCashForm", function () {
		displayCashForm();
	});

	App.vent.on(module + ":registerUser", function (alias) {
		displaySignUpForm();
	});
	
	App.vent.on(module + ":resolve", function (alias) {
		resolve(alias);
	});
	 
	App.vent.on(module + ":refreshUser", function (alias) {
		refreshUser(alias);
	});
	 
	App.vent.on(module + ":logout", function (alias) {
		logout(alias);
	});
	 

	App.vent.on("user:displayLoginForm", function () {
		displayLoginForm();
	});
	
	App.vent.on("user:URLController", function (alias) {
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
		if (decision  == 'profile'){
			displayProfileForm();
		} else if (decision  == 'cashierProfile'){
			displayCashierProfileForm();
		} else if (decision  == 'ownerProfile'){
			displayOwnerProfileFormView();
		} else if (decision  == 'changeEmailOrPassword'){
			displayChangeEmailOrPassword();
		}  else if (decision  == 'cashForm'){
			displayCashForm();
		} else if (decision  == 'createCashier'){
			displayCreateCashierForm();
		} else if (decision  == 'createOwner'){
			displayCreateOwnerForm();
		} else if (decision  == 'createPolice'){
			displayCreatePoliceForm();
		} else if (decision  == 'manageUserList'){
			displayManageUser();
		}
	} else {
		displayLoginForm();
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
	getId : function (){
		return this.get('_id');
	},
	getAddress : function (){
		return this.get('address') || {};
	},
	getBalance : function (){
		return this.get('balance') || 0;
	},
	getCarType : function (){
		return this.get('carType');
	},
	getCode : function (){
		return this.get('code');
	}, 
	getEmail : function (){
		return this.get('email');
	},
	getFirstName : function (){
		return this.get('firstName');
	},
	getLastName : function (){
		return this.get('lastName');
	},
	getHKID : function (){
		return this.get('HKIDOrCode');
	},
	getRole : function (){
		return this.get('role');
	},
	getPhone : function (){
		return this.get('phone');
	},
	getVerifyCode: function (){
		return this.get('verifyCode');
	},
	setActive : function(){
		this.set({active: true});
	},
	setAdmin : function(){
		this.set({role: 'Admin'});
	},
	setCashier : function(){
		this.set({role: 'Cashier'});
	},
	setParkOwner : function(){
		this.set({role: 'ParkOwner'});
	},
	setParking :  function(){
		this.set({isParking: true});
	},
	setPolice :  function(){
		this.set({role: 'Police'});
	},
	setUser :  function(){
		this.set({role: 'User'});
		this.setActive();
	},
	unsetParking :  function(){
		this.set({isParking: false});
	},
	isUser :  function(){
		return this.getRole() == 'User';
	},
	isAdmin : function(){
		return this.getRole() == 'Admin';
	},
	isCashier : function(){
		return this.getRole() == 'Cashier';
	},
	isParkOwner : function(){
		return this.getRole() == 'ParkOwner';
	},
	isParking : function(){
		return this.get('isParking') || false;
	},
	isPolice : function(){
		return this.getRole() == 'Police';
	},
	formAddress: function(){
		var address = this.getAddress();
		this.set({street: address.address, district: address.district});
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


var ModuleDepositForm = Backbone.Marionette.ItemView.extend({
	template: _.template(tplDepositFormView),
	onShow: function () {
	},
	events: {
		"submit"       				: "save"
	},
	save: function (e) {
		e.preventDefault();
		var options = {};
		options.code = $('#code').val().trim();
		options.amount = $('#amount').val().trim();
		options.handler = App.user.getId();
		App.vent.trigger('record:deposit', options);
	}
});

var ModuleChangePasswordFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplChangePasswordFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
		"click .changepasswordEye"   : "toggleHidden",
		"submit"       				: "save"
	},
	save: function (e) {
		e.preventDefault();
		var data = {};
		var confirmPassword = $('#confirmPassword').val().trim();
		data.currentPassword = $('#currentPassword').val().trim();
		data.newPassword = $('#newPassword').val().trim();
		data.action = 'setPassword';
		if (confirmPassword != data.newPassword){
			var str = 'Password not equal';
			App.Utils.showAlert({type: 'error', title: 'Error', content: 'Password not equal'});
		}  else if (confirmPassword.length < 8) {
			var str = 'Password shorter than 8';
			App.Utils.showAlert({type: 'error', title: 'Error', content: 'Password shorter than 8'});
		} else {
			this.model.set(data);
			this.model.save({}, {
				success: function (model) {
					var str = 'Password Changed';
					App.Utils.showAlert({type: 'Success', title: 'Success', content: 'Password Changed'});
				},
				error: function () {
					var str = 'Password fail to Change';
					App.Utils.showAlert({type: 'error', title: 'Error', content: 'Password fail to Change'});
				}
			});
		
		
		}
	},
	toggleHidden: function (e) {
		e.preventDefault();
		if ($('#' + $(e.currentTarget).data('target')).attr('type') == 'password') {
			$('#' + $(e.currentTarget).data('target')).prop('type', 'text');
		} else {
			$('#' + $(e.currentTarget).data('target')).prop('type', 'password');
		}
	}
});

var ModuleChangeEmailFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplChangeEmailFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
		"submit"       				: "save",
		"click #getVerifyCode": "getVerifyCode"
	},
	save: function (e) {
		e.preventDefault();
		var data = {};
		var verifyCode = $('#verifyCode').val().trim();
		data.email = $('#email').val().trim();
		if(verifyCode == this.model.getVerifyCode()){
			this.model.set(data);
			this.model.unset('action');
			this.model.save({}, {
				success: function (model) {
					App.Utils.showAlert({type: 'Success', title: 'Success', content: 'Email Changed'});
				},
				error: function () {
					App.Utils.showAlert({type: 'error', title: 'Error', content: 'Email fail to Change'});
				}
			});
		} else {
			App.Utils.showAlert({type: 'error', title: 'Error', content: 'verify code is not correct'});
		}
	},
	getVerifyCode: function(){
		var data = {};
		var self = this;
		data.action = 'changeEmail';
		data.email = $('#email').val().trim();
		this.model.set(data);
		this.model.save({}, {
			success: function (model) {
				var str = 'verify Code send to ' + data.email + ' already';
				App.Utils.showAlert({type: 'Success', title: 'Success', content: str});
			},
			error: function () {
				var str = 'Email fail to send to '+ email;
				App.Utils.showAlert({type: 'error', title: 'Error', content: str});
			}
		});
	}
});

var ModuleCreateCashierFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplCreateCashierFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
		"submit"       										: "save"
	},
	save: function (e) {
		e.preventDefault();
		var data = {};
		data.action = 'createCashier';
		data.lastName = $('#name').val().trim();
		data.email = $('#email').val().trim();
		data.phone = $('#phone').val().trim();
		data.address = {
			district: $('#district').val(),
			address: $('#address').val().trim()
		};
		this.model.set(data);
		this.model.setCashier();
		this.model.save({}, {
			success: function (model) {
				displayManageUser();
			},
			error: function (err) {
				App.Utils.showAlert({type: 'error', title: 'Error', content: 'Fail to create new cashier'});
			}
		});
	}
});

var ModuleCreatePoliceFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplCreatePoliceFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
		"submit"       										: "save"
	},
	save: function (e) {
		e.preventDefault();
		var data = {};
		data.action = 'createPolice';
		data.HKIDOrCode = $('#HKIDOrCode').val().trim();
		this.model.set(data);
		this.model.setPolice();
		this.model.save({}, {
			success: function (model) {
				displayManageUser();
			},
			error: function (err) {
				App.Utils.showAlert({type: 'error', title: 'Error', content: 'Fail to create new cashier'});
			}
		});
	}
});

var ModuleCreateOwnerFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplCreateOwnerFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
		"submit"       										: "save"
	},
	save: function (e) {
		e.preventDefault();
		var data = {};
		data.action = 'createOwner';
		data.lastName = $('#name').val().trim();
		data.email = $('#email').val().trim();
		data.phone = $('#phone').val().trim();
		this.model.set(data);
		this.model.setParkOwner();
		this.model.save({}, {
			success: function (model) {
				displayManageUser();
			},
			error: function (err) {
				App.Utils.showAlert({type: 'error', title: 'Error', content: 'Fail to create new owner'});
			}
		});
	}
});

var ModuleDepositItemView = Backbone.Marionette.ItemView.extend({
	initialize: function(options){
	},
	template: _.template(tplDepositItemView)
});

var ModuleForgotPasswordFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplForgotPasswordFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
		"submit"       				: "send"
	},
	send: function (e) {
		e.preventDefault();
		var data = {
			HKIDOrCode:$('#HKIDOrCode').val().trim(),
			action: 'forgetPassword'
		};
		this.model.save(data, {
				success: function (model) {
					var email = model.getEmail();
					var str = 'Your Password has send to ' + email + ' already';
					App.Utils.showAlert({type: 'Success', title: 'Success', content: str});
				},
				error: function (err) {
					App.Utils.showAlert({type: 'error', title: 'Error', content: 'Your user account is not exist'});
				}
		});
	}
});

var ModuleLoginFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplLoginFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
		"submit"       				: "login",
		"click .passwordEye"   : "toggleHidden"
	},
	login: function (e) {
		e.preventDefault();
		var data = {
			HKIDOrCode:$('#HKIDOrCode').val().trim(),
			password: $('#password').val().trim()
		};
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: "http://ec2-52-68-199-65.ap-northeast-1.compute.amazonaws.com:8082/login",
			data: data,
			crossDomain: true,
			success: function (user) {
				App.user = new ModuleModel(user);
				// App.Utils.setUrlPath({pathname: '#homepage'});
				App.vent.trigger("routing:resolve");
				// App.vent.trigger('homepage:resolve');
			},
			error: function (err) {
				App.Utils.showAlert({type: 'error', title: 'Error', content: "Incorrect Password"});
			}
		});
	},
	toggleHidden: function (e) {
		e.preventDefault();
		if ($('#' + $(e.currentTarget).data('target')).attr('type') == 'password') {
			$('#' + $(e.currentTarget).data('target')).prop('type', 'text');
		} else {
			$('#' + $(e.currentTarget).data('target')).prop('type', 'password');
		}
	}
});

var ModuleCashierProfileFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplCashierProfileFormView),
	onBeforeRender: function(){
		this.model.formAddress();
	},
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
	"submit"	:	"submit"
	},
	submit: function(e){
		e.preventDefault();
		var self = this;
		var data = {};
		data.lastName = $('#name').val().trim();
		data.email = $('#email').val().trim();
		data.phone = $('#phone').val().trim();
		data.address = {
			district: $('#district').val(),
			address: $('#address').val().trim()
		};
		this.model.set(data);
		this.model.save({}, {
			success: function (model) {
				App.Utils.showAlert({type: 'Success', title: 'Success', content: 'User Profile updated'});
			},
			error: function (model, err) {
				App.Utils.showAlert({type: 'error', title: 'Error', content: 'user Profile fail to update'});
			}
		});
	}
});

var ModuleOwnerProfileFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplOwnerProfileFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
	"submit"	:	"submit"
	},
	submit: function(e){
		e.preventDefault();
		var self = this;
		var data = {};
		data.lastName = $('#lastName').val().trim();
		data.phone = $('#phone').val().trim();
		this.model.set(data);
		this.model.save({}, {
			success: function (model) {
				App.Utils.showAlert({type: 'Success', title: 'Success', content: 'User Profile updated'});
			},
			error: function (model, err) {
				App.Utils.showAlert({type: 'error', title: 'Error', content: 'user Profile fail to update'});
			}
		});
	}
});

var ModuleProfileFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplProfileFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
	"submit"	:	"submit"
	},
	submit: function(e){
		e.preventDefault();
		var self = this;
		var data = {};
		data.firstName = $('#firstName').val().trim();
		data.lastName = $('#lastName').val().trim();
		data.phone = $('#phone').val().trim();
		this.model.set(data);
		this.model.save({}, {
			success: function (model) {
				App.Utils.showAlert({type: 'Success', title: 'Success', content: 'User Profile updated'});
			},
			error: function (model, err) {
				App.Utils.showAlert({type: 'error', title: 'Error', content: 'user Profile fail to update'});
			}
		});
	}
});


var ModuleSignUpFormView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplSignUpFormView),
	onShow: function () {
		$(document).scrollTop(0);
	},
	events: {
		"submit"       							: "submit",
		"click .passwordEye"  	: "toggleHidden",
		"click .passwordEye2"   : "toggleHiddenComfirmPassword"
	},
	submit: function(e){
		e.preventDefault();
		var data = {};
		data.HKIDOrCode = $('#HKIDOrCode').val().trim();
		if (!isHKID(data.HKIDOrCode)) {
			App.Utils.showAlert({type: 'error', title: 'Error', content: 'Please enter vaild HKID'});
		} else {
			data.email = $('#email').val().trim();
			data.firstName = $('#firstName').val().trim();
			data.lastName = $('#lastName').val().trim();
			data.phone = $('#phone').val().trim();
			this.model.setUser();
			this.model.set(data);
			this.model.save({}, {
				success: function (model) {
					App.Utils.showAlert({type: 'Success', title: 'Success', content: 'Please login your email to get your password.'});
				},
				error: function (model, err) {
					var str = err.responseText || 'Faile to sign up';
					App.Utils.showAlert({type: 'error', title: 'Error', content: str});
				}
			});
		}
	},
	toggleHidden: function (e) {
		e.preventDefault();
		if ($('#password').attr('type') == 'password') {
			$('#password').prop('type', 'text');
		} else {
			$('#password').prop('type', 'password');
		}
	},
	toggleHiddenComfirmPassword: function (e) {
		e.preventDefault();
		if ($('#confirmPassword').attr('type') == 'password') {
			$('#confirmPassword').prop('type', 'text');
		} else {
			$('#confirmPassword').prop('type', 'password');
		}
	}
});

var ModuleUserItemView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplUserItemView),
	tagName:'tr',
	onShow: function(){
		if(this.model.isAdmin()){
			$('.admin', this.el).removeClass('btn-info').addClass('btn-success');
			$('.admin', this.el).html('admin');
		}
	},
	events: {
		'click .admin'	: 'assignAdmin',
		'click .detail'	: 'detail'
	},
	assignAdmin: function(){
		var self = this;
		if(this.model.isAdmin()){
			this.model.setUser();
			this.model.save({}, {
				success: function (model) {
					$('.admin', self.el).removeClass('btn-success').addClass('btn-info');
					$('.admin', self.el).html('user');
				}
			});
		} else if (this.model.isUser()){
			this.model.setAdmin();
			this.model.save({}, {
				success: function (model) {
					$('.admin', self.el).removeClass('btn-info').addClass('btn-success');
					$('.admin', self.el).html('admin');
				}
			});
		}
	},
	detail: function(){
		var self = this;
		displayProfileForm({model: this.model});
	}
});

var ModuleCashierItemView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplCashierItemView),
	tagName:'tr',
	onShow: function(){
	},
	events: {
		'click .detail'	: 'detail',
		'click .resetPassword'	: 'resetPassword'
	},
	detail: function(){
		var self = this;
		displayCashierProfileForm({model: this.model});
	},
	resetPassword: function(){
		this.model.save({action: 'resetPassword'});
	}
});

var ModuleOwnerItemView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplOwnerItemView),
	tagName:'tr',
	onShow: function(){
	},
	events: {
		'click .detail'	: 'detail',
		'click .resetPassword'	: 'resetPassword'
	},
	detail: function(){
		var self = this;
		displayOwnerProfileFormView({model: this.model});
	},
	resetPassword: function(){
		this.model.save({action: 'resetPassword'});
	}
});

var ModulePoliceItemView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplPoliceItemView),
	tagName:'tr',
	onShow: function(){
	},
	events: {
		'click .resetPassword'	: 'resetPassword'
	},
	resetPassword: function(){
		this.model.save({action: 'resetPassword'});
	}
});

/*********************************************
 * CompositeView
 *********************************************/
 
var ModuleCashForm = Backbone.Marionette.CompositeView.extend({
	initialize: function () {
	},
	template: _.template(tplCashFormView),
	onRender: function () {
		$(document).scrollTop(0);
		var rm = new Marionette.RegionManager();
		cashierRegion = rm.addRegions({
			depositRegion: "#depositRegion",
			depositDetailRegion: "#depositDetailRegion"
		});
	},
	onShow: function(){
		displayDepositForm();
	}
});

var ModuleChangeEmailOrPassword = Backbone.Marionette.CompositeView.extend({
	initialize: function () {
	},
	template: _.template(tplchangeEmailAndPasswordFormView),
	onRender: function () {
		$(document).scrollTop(0);
		var rm = new Marionette.RegionManager();
		newRegion = rm.addRegions({
			emailRegion: "#emailRegion",
			passwordRegion: "#passwordRegion"
		});
	},
	onShow: function(){
		if (!App.user.isPolice()){
			displayChangeEmailForm();
		}
		displayChangePasswordForm();
	}
});

var ModuleManageUserView = Backbone.Marionette.CompositeView.extend({
	initialize: function () {
	},
	template: _.template(tplManageUserView),
	onRender: function () {
		$(document).scrollTop(0);
		var rm = new Marionette.RegionManager();
		newRegion = rm.addRegions({
			userRegion: "#userRegion",
			OwnerRegion: "#OwnerRegion",
			cashierRegion: "#cashierRegion",
			policeRegion: "#policeRegion",
		});
	},
	onShow: function(){
		displayUserList();
		displayOwnerList();
		displayCashierList();
		displayPoliceList();
	}
});

var ModuleUserListView = Backbone.Marionette.CompositeView.extend({
	itemView: ModuleUserItemView,
	template: _.template(tplUserListView),
	appendHtml: function (collectionView, itemView, index) {
		collectionView.$(".userList").append(itemView.el);
	},
	onShow: function(){
		if(App.Utils.detectmoblie()){
			$('#pager').hide();

			$("#usertable").tablesorter({
				theme: 'default',
				widthFixed: false,
				widgets: ['zebra']
			})
		} else {
			$("#usertable").tablesorter({
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
	}
});

var ModuleCashierListView = Backbone.Marionette.CompositeView.extend({
	itemView: ModuleCashierItemView,
	template: _.template(tplCashierListView),
	appendHtml: function (collectionView, itemView, index) {
		collectionView.$(".cashierList").append(itemView.el);
	},
	onShow: function(){
		if(App.Utils.detectmoblie()){
			$('#cashierPager').hide();

			$("#cashiertable").tablesorter({
				theme: 'default',
				widthFixed: false,
				widgets: ['zebra']
			})
		} else {
			$("#cashiertable").tablesorter({
					theme: 'default',
					widthFixed: true,
					widgets: ['zebra']
			}).tablesorterPager({
					container: $("#cashierPager"),
					page: 0,
					size: 20,
					output: '{startRow} to {endRow} ({totalRows})'
			});
		}
	}
});

var ModuleOwnerListView = Backbone.Marionette.CompositeView.extend({
	itemView: ModuleOwnerItemView,
	template: _.template(tplOwnerListView),
	appendHtml: function (collectionView, itemView, index) {
		collectionView.$(".ownerList").append(itemView.el);
	},
	onShow: function(){
		if(App.Utils.detectmoblie()){
			$('#ownerPager').hide();

			$("#ownertable").tablesorter({
				theme: 'default',
				widthFixed: false,
				widgets: ['zebra']
			})
		} else {
			$("#ownertable").tablesorter({
					theme: 'default',
					widthFixed: true,
					widgets: ['zebra']
			}).tablesorterPager({
					container: $("#ownerPager"),
					page: 0,
					size: 20,
					output: '{startRow} to {endRow} ({totalRows})'
			});
		}
	}
});

var ModulePoliceListView = Backbone.Marionette.CompositeView.extend({
	itemView: ModulePoliceItemView,
	template: _.template(tplPoliceListView),
	appendHtml: function (collectionView, itemView, index) {
		collectionView.$(".policeList").append(itemView.el);
	},
	onShow: function(){
		if(App.Utils.detectmoblie()){
			$('#policePager').hide();

			$("#policetable").tablesorter({
				theme: 'default',
				widthFixed: false,
				widgets: ['zebra']
			})
		} else {
			$("#policetable").tablesorter({
					theme: 'default',
					widthFixed: true,
					widgets: ['zebra']
			}).tablesorterPager({
					container: $("#policePager"),
					page: 0,
					size: 20,
					output: '{startRow} to {endRow} ({totalRows})'
			});
		}
	}
});

/*********************************************
 * functions
 *********************************************/

var displayCashForm = function (options) {
	Backbone.history.navigate("#user/cashForm");
	options = options || {};
	var view = new ModuleCashForm();
	App.layout[configs[module]['region']].show(view);
};

var displayChangeEmailOrPassword = function (options) {
	Backbone.history.navigate("#user/changeEmailOrPassword");
	options = options || {};
	var view = new ModuleChangeEmailOrPassword();
	App.layout[configs[module]['region']].show(view);
};

var displayChangePasswordForm = function () {
	var model = App.user;
	var view = new ModuleChangePasswordFormView({model: model});
	newRegion.passwordRegion.show(view);
};

var displayChangeEmailForm = function () {
	var model = App.user;
	var view = new ModuleChangeEmailFormView({model: model});
	newRegion.emailRegion.show(view);
};

var displayCreateCashierForm = function () {
	Backbone.history.navigate("#user/createCashier");
	var model = new ModuleModel();
	var view = new ModuleCreateCashierFormView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayCreateOwnerForm = function () {
	Backbone.history.navigate("#user/createOwner");
	var model = new ModuleModel();
	var view = new ModuleCreateOwnerFormView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayCreatePoliceForm = function () {
	Backbone.history.navigate("#user/createPolice");
	var model = new ModuleModel();
	var view = new ModuleCreatePoliceFormView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayDepositForm = function (options) {
	options = options || {};
	var view = new ModuleDepositForm();
	cashierRegion.depositRegion.show(view);
};

var displayDepositeDetail = function (user) {
	user = user || {};
	user = new ModuleModel(user);
	var view = new ModuleDepositItemView({model: user});
	cashierRegion.depositDetailRegion.show(view);
};

var displayForgotPasswordForm = function () {
	var model = new ModuleModel();
	var view = new ModuleForgotPasswordFormView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayLoginForm = function () {
	var model = new ModuleModel();
	var view = new ModuleLoginFormView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayCashierProfileForm = function (options) {
	Backbone.history.navigate("#user/cashierProfile");
	options = options || {};
	if(!options.model){
		options.model = App.user
	}
	var view = new ModuleCashierProfileFormView({model: options.model});
	App.layout[configs[module]['region']].show(view);
};

var displayOwnerProfileFormView = function (options) {
	// App.Utils.setUrlPath({pathname: '#user/ownerProfile'});
	Backbone.history.navigate("#user/ownerProfile");
	options = options || {};
	if(!options.model){
		options.model = App.user
	}
	var view = new ModuleOwnerProfileFormView({model: options.model});
	App.layout[configs[module]['region']].show(view);
};

var displayProfileForm = function (options) {
	Backbone.history.navigate("#user/profile");
	options = options || {};
	if(!options.model){
		options.model = App.user
	}
	var view = new ModuleProfileFormView({model: options.model});
	App.layout[configs[module]['region']].show(view);
};

var displaySignUpForm = function () {
	var model = new ModuleModel();
	var view = new ModuleSignUpFormView({model: model});
	App.layout[configs[module]['region']].show(view);
};

var displayUserList = function (options) {
	options = options || {};
	var collection = new ModuleCollection();
	collection.fetch({data:{action: 'findAllAdminAndUser'}, 
		success: function(users){
			showUserList({collection: users});	
		},
		error: function(){
			var errmsg = 'There are no user.';
			if (response.responseText !== '') {
				errmsg = response.responseText;
			}
			console.log(errmsg);	
		
		}
	});
};

var displayOwnerList = function (options) {
	options = options || {};
	var collection = new ModuleCollection();
	collection.fetch({data:{action: 'findAllOwner'}, 
		success: function(users){
			showOwnerList({collection: users});	
		},
		error: function(){
			var errmsg = 'There are no user.';
			if (response.responseText !== '') {
				errmsg = response.responseText;
			}
			console.log(errmsg);	
		
		}
	});
};

var displayPoliceList = function (options) {
	options = options || {};
	var collection = new ModuleCollection();
	collection.fetch({data:{action: 'findAllPolice'}, 
		success: function(users){
			showPoliceList({collection: users});	
		},
		error: function(){
			var errmsg = 'There are no user.';
			if (response.responseText !== '') {
				errmsg = response.responseText;
			}
			console.log(errmsg);	
		
		}
	});
};

var displayCashierList = function (options) {
	options = options || {};
	var collection = new ModuleCollection();
	collection.fetch({data:{action: 'findAllCashier'}, 
		success: function(users){
			showCashierList({collection: users});	
		},
		error: function(){
			var errmsg = 'There are no user.';
			if (response.responseText !== '') {
				errmsg = response.responseText;
			}
			console.log(errmsg);	
		
		}
	});
};

var displayManageUser = function (options) {
	Backbone.history.navigate("#user/manageUserList");
	options = options || {};
	var view = new ModuleManageUserView();
	App.layout[configs[module]['region']].show(view);
};

var logout = function (alias) {
  delete App.user;
	App.vent.trigger("routing:resolve");
};

var showCashierList = function(options){
	options = options || {};
	var collection = options.collection; 

	var view = new ModuleCashierListView({collection: collection});
	newRegion.cashierRegion.show(view);
};

var showOwnerList = function(options){
	options = options || {};
	var collection = options.collection; 

	var view = new ModuleOwnerListView({collection: collection});
	newRegion.OwnerRegion.show(view);
};

var showPoliceList = function(options){
	options = options || {};
	var collection = options.collection; 

	var view = new ModulePoliceListView({collection: collection});
	newRegion.policeRegion.show(view);
};

var showUserList = function(options){
	options = options || {};
	var collection = options.collection; 

	var view = new ModuleUserListView({collection: collection});
	newRegion.userRegion.show(view);
};

var refreshUser = function (alias) {
	App.user.fetch();
};

var resolve = function (alias) {
  displayLoginForm();
};

var filter = function (options) {
	options = options || {};
	// options.page = options.page || 1;
	options.action = 'findAllAdminAndUser';

	if (cachedCollection) {
		cachedCollection = null;
	}

	fetch(options, function (err, cachedCollection, response) {
		if (err) {
			App.Utils.showAlert({type: 'error', title: 'Error', content: 'Fetch failed'});
		} else {
			showUserList();
		}
	});
};

var isHKID = function (str) {
	return true;
 // var strValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

	// if (str.length < 8)
			// return false;

	// if (str.charAt(str.length-3) == '(' && str.charAt(str.length-1) == ')')
			// str = str.substring(0, str.length - 3) + str.charAt(str.length -2);

	// str = str.toUpperCase();

	// var hkidPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/;
	// var matchArray = str.match(hkidPat);

	// if (matchArray == null)
			// return false;

	// var charPart = matchArray[1];
	// var numPart = matchArray[2];
	// var checkDigit = matchArray[3];

	// var checkSum = 0;
	// if (charPart.length == 2) {
			// checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)));
			// checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)));
	// } else {
			// checkSum += 9 * 36;
			// checkSum += 8 * (10 + strValidChars.indexOf(charPart));
	// }

	// for (var i = 0, j = 7; i < numPart.length; i++, j--)
			// checkSum += j * numPart.charAt(i);

	// var remaining = checkSum % 11;
	// var verify = remaining == 0 ? 0 : 11 - remaining;

	// return verify == checkDigit || (verify == 10 && checkDigit == 'A');
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
	return User;   
});