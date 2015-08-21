/*
Collections.app
*/
window._ = require('underscore');
window.$ = window.jQuery = require('jquery');
require('bootstrap');

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');

window.regions = new Marionette.RegionManager({
  regions: {
    body: "#app",
    header: "#header",
    dialog: "#dialog"
  }
});
var regions = window.regions;

var WelcomeView = require('./lib/views/welcome.js');
var IndexView = require('./lib/views/index.js');
var HeaderView = require('./lib/views/header.js');
var TableView = require('./lib/views/table.js');
var RowView = require('./lib/views/row.js');

var ApplicationRouter = Backbone.Router.extend({
    routes: {
        "": "index",
        "dbindex": "dbIndex",
        "table/:tablename": "dbTable",
        "viewrow/:tablename/:column/:value": "dbRow"
    },

    index: function(){
        regions.get("body").show(new WelcomeView());
    },

    dbIndex: function(){
        regions.get("body").show(new IndexView());
        regions.get("header").show(new HeaderView());
    },

    dbTable: function(tablename){
        regions.get("body").show(new TableView({
            model: new Backbone.Model({
                name: tablename
            })
        }));
    },

    dbRow: function(tablename, column, value){
        regions.get("dialog").show(new RowView({
            sql: ["SELECT * FROM ["+tablename+"] WHERE ["+column+"] = ?",
                value]
        }));
    }
});
new ApplicationRouter();

if(Backbone.History.started != true){
    document.location.hash = "#";
    Backbone.history.start({pushState: false});
}
window.Backbone = Backbone;
