;define([
  "jquery",
  "underscore",
  "backbone",
  "marionette",
  "bootstrap",
  "layout",

  "core/cookie",
  "core/cost",
  "core/export",
  "core/homepage",
  "core/menu",
  "core/park",
  "core/record",
  "core/report",
  "core/user",
  "core/utils"

], function($, _, Backbone, Marionette, Bootstrap, Layout,
Cookie,
Cost,
Export,
Homepage,
Menu,
Park,
Record,
Report,
User,
Utils
){    
        var module = "app";
        App = new Backbone.Marionette.Application();
		
		App.initializeLayout = function (layoutName) {
		  if ((!App.layout) || (App.layout.options.tmplName != layoutName)) {
			App.layout = new Layout({tmplName:layoutName});
			App.content.show(App.layout);
		  }
		};
/*********************************************
* Language functions
*********************************************/
	App.l = function (text, callback) {
		if (callback) {
			return App.l(callback(text));
		}
			return App.Language.l(text);
	};

/*********************************************
* Shortcut functions
*********************************************/

App.display = function (options) {
	options = options || {};
	var lang = App.Cookie.get("lang");
	this.fetch(options, function (err, collection) {
		if (typeof options.alias != 'undefined') {
		  collection = collection.filterAlias(options.alias).filterLanguage(lang);
		} else {
		  collection = collection.filterLanguage(lang);
		}
		if (collection.length > 0) {
			var view = new options.view({ collection: collection });
			if (options.region) {
			App.layout[options.region].show(view);
			} else {
			App.layout.contentRegion.show(view);
			}
		}
	});
};

// App.display = function (options) {
        // options = options || {};
        // this.fetch(options, function (err, collection) {
                // var view = new options.view({ collection: collection });
                // if (options.region) {
                        // App.layout[options.region].show(view);
                // }
        // });
// };
/*********************************************
* Listening events
*********************************************/      
        App.vent.on("routing:started", function () {
                if (!Backbone.History.started) {
                Backbone.history.start({ pushState: false });
                }
        });
				
				App.vent.on("routing:resolve", function (alias) {
					App.Router.resolve(alias);
				});
		
        App.on(module + ":display", function (options) {
                App.display(options);
        }); 
        
        
        App.addInitializer(function(options) {
            initComponents();
        });
		
		// App.addInitializer(function () {
			// App.Cookie = new Cookie();
			// if (App.Cookie.get("lang") == "") {
				// App.Cookie.save({lang: "en-us"});
			// }
		// });

/*********************************************
 * init functions
 *********************************************/
	function initComponents() {
		App.Cost = new Cost();
		App.Export = new Export();
		App.Homepage = new Homepage();
		App.Menu = new Menu();
		App.Park = new Park();
		App.Record = new Record();
		App.Report = new Report();
		App.User = new User();
		App.Utils = new Utils();
	};   
 /*********************************************
 * Return
 *********************************************/
        return App;
});