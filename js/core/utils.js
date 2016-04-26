/*********************************************
 * Utility module
 *
 * author: Don Lee
 * created: 2013-09-12T15:16:00Z
 * modified: 2013-09-20T15:16:00Z
 *
 *********************************************/

;define([
  "jquery",
  "marionette",
	'text!tpl/alert.html',
],

function ($, Marionette, alertTemplateString) {
/*********************************************
 * Templates
 *********************************************/
	var tplModalView = $('#ModalView', '<div>' + alertTemplateString + '</div>').html();
	
/*********************************************
 * Configurations
 *********************************************/
	var module = "utils"; // lowercase only
	var configs = {};

/*********************************************
 * Main function (export)
 *********************************************/
	var Utils = function () {
		configs[module] = {
			//showPopupByModalView: true,
			showModalDuration: 3000
		};
		$.extend(true, configs, App.Config.toJSON());
	};

	var ModuleItem = Backbone.Model.extend({
		idAttribute: '_id',
		default: function () {
			return {
				_id: null,
				title: '',
				content: ''
			};
		}
	});
/*********************************************
 * ItemView
 *********************************************/
var ModuleAlertView = Backbone.Marionette.ItemView.extend({
	template: _.template(tplModalView),
	serializeData : function(){
		return {
			title: this.options.title,
			type: this.options.type,
			content: this.options.content,
		};
	},
	onShow: function () {
	},
	events: {
	}
});
/*********************************************
 * functions
 *********************************************/

	// Utils.prototype.detectmoblie = function() {
		// if( navigator.userAgent.match(/Android/i)
		// || navigator.userAgent.match(/webOS/i)
		// || navigator.userAgent.match(/iPhone/i)
		// || navigator.userAgent.match(/iPad/i)
		// || navigator.userAgent.match(/iPod/i)
		// || navigator.userAgent.match(/BlackBerry/i)
		// || navigator.userAgent.match(/Windows Phone/i)
		// ){
			// return true;
		// }
		// else {
			// return false;
		// }
	// };
	
	Utils.prototype.detectmoblie = function() {
		if(window.innerWidth <= 800 && window.innerHeight <= 600) {
		 return true;
		} else {
		 return false;
		}
	};

	Utils.prototype.setUrl = function(options) {
		options = options || App.Config.toJSON();
		return options.proto + options.host + ':' + options.port + options.path;
	};

	Utils.prototype.setUrlPath = function (options) {
		options = options || {};

		window.location.href = window.location.pathname.substring(0, window.location.pathname.lastIndexOf( '/' ) + 1 ) + options.pathname;
		// QuestCMS.Cookie.save({alias: options.pathname});
	};
	
	Utils.prototype.showAlert = function (options) {
		options = options || {};
		options.type = (options.type == 'error') ? 'errorAlert':'successAlert'
		var view = new ModuleAlertView(options);
		App.modal.show(view);
	};

/*********************************************
 * Return
 *********************************************/
    return Utils;

});
