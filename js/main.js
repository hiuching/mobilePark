require.config({
        baseUrl: "./js",
        paths: {
            // libraries
        "libs"        : "../libs",
        "backbone"    : "../libs/backbone/backbone-min",
        "bootstrap"   : "../libs/bootstrap/js/bootstrap",
        "jquery"      : "../libs/jquery/jquery-1.11.2.min",
				"jquery.cookie"      : "../libs/jquery.cookie/jquery.cookie",
				"jqueryui"      : "../libs/jqueryui/js/jquery-ui-1.11.2.min",
        "json2"       : "../libs/json2/json2",
				"tablesorter"       : "../libs/tablesorter/jquery.tablesorter",
				"tablesorterPager"       : "../libs/tablesorter/jquery.tablesorter.pager",
				"timepicker" : "../libs/jquery.timepicker/jquery.timepicker",
				"tablesorter.widgets"       : "../libs/tablesorter/jquery.tablesorter.widgets",
				"jquery.loadJSON"      : "../libs/jquery.loadJSON/jquery.loadJSON",
        "marionette"  : "../libs/backbone.marionette/backbone.marionette.min",
        "moment"  : "../libs/moment.min",
        'async': '../libs/async',
        "text"        : "../libs/requirejs/text",
        "underscore"  : "../libs/underscore/underscore-1.4.4.min",
        
				"date"				: "../tools/date",
        "tpl"         : "../usefulfile/tpl"
        },
  shim: {
    "underscore" : {
      exports: "_"
    },
    "backbone" : {
      deps: ["jquery", "underscore", "json2"],
      exports: "Backbone"
    },
    "tablesorter" : {
      deps: ["jquery"],
			exports: "$.fn.tablesorter"
    },
    "tablesorterPager" : {
      deps: ["jquery", "tablesorter"],
			exports: "$.fn.tablesorterPager"
    },
    "jqueryui" : {
      deps: ["jquery"]
    },
 		"timepicker" : {
			deps: ["jquery", "jqueryui"],
			exports: "$.fn.timepicker"
		},
    "tablesorter.widgets" : {
      deps: ["jquery"],
			exports: "$.tablesorter"
    },
		"jquery.loadJSON" : {
      deps: ["jquery"],
      exports: "$.fn.loadJSON"
    },
    "marionette" : {
      deps: ["backbone"],
      exports: "Backbone.Marionette"
    },
		"moment" : {
      deps: ["jquery"],
      exports: "moment"
    },
    "bootstrap" : {
      deps: ["jquery"],
      exports: "Bootstrap"
    }
}
});

require(['jquery', 'backbone','marionette',
'app',
'config',
'router',
"core/modal"
], function ($,Backbone,Marionette,
App,
Config,
Router,
Modal
){
        App.Config = new Config();
        App.addInitializer(function () {
					App.Router = new Router();
					App.vent.trigger("routing:started");
					//console.log('enter addinitializer');
        });
        App.addRegions({
                content: "#mainContent",
								modal: Modal
        });
        return   App.start();   
});