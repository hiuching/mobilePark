;define([
  "app"
],
function (App) {


/*********************************************
 * Main function (export)
 *********************************************/
	var Controller = {
		resolve: function (alias) {
			alias = alias || "";
			var self = this;

			var layoutName = "layout";

			if (! App.user) {
				layoutName = 'layout-login'
			}

			App.initializeLayout(layoutName);
			// App.Cookie.save({alias: alias});

			/*********************************************
			* Routes
			*********************************************/
			if (!App.user) {
				
				if (alias.indexOf("register") === 0) {
					this.register(alias);
				} else if (alias.indexOf("forgotPassword") === 0) {
					this.forgotPassword(alias);
				} else {
					this.login(alias);
				}
			} else {
				if (alias.indexOf("homepage") === 0) {
					this.homepage(alias);
				} else if (alias.indexOf("export") === 0) {
					this.export(alias);
				} else if (alias.indexOf("user") === 0) {
					this.user(alias);
				} else if (alias.indexOf("park") === 0) {
					this.park(alias);
				} else if (alias.indexOf("record") === 0) {
					this.record(alias);
				} else if (alias.indexOf("report") === 0) {
					this.report(alias);
				} else {
					this.homepage(alias);
				}
			}
		},


		/*********************************************
			* Functions
			*********************************************/
		homepage: function(alias){
			App.vent.trigger('homepage:resolve', alias);
		},
		forgotPassword: function(alias){
			App.vent.trigger('user:forgotPassword', alias);
		},
		login: function(alias) {
			App.vent.trigger("user:resolve", alias);
		},
		export: function(alias){
			App.vent.trigger('export:URLController', alias);
		},
		park: function (alias) {
			App.vent.trigger('park:URLController', alias);
		},
		record: function (alias) {
			App.vent.trigger('record:URLController', alias);
		},
		report: function (alias) {
			App.vent.trigger('report:URLController', alias);
		},
		register: function (alias) {
			App.vent.trigger('user:registerUser', alias);
		},
		user: function (alias) {
			App.vent.trigger('user:URLController', alias);
		}
	};


/*********************************************
 * Return
 *********************************************/
    return Controller;

});
