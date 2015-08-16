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
    header: "#header"
  }
});
var regions = window.regions;

var WelcomeView = require('./lib/views/welcome.js');
var IndexView = require('./lib/views/index.js');
var HeaderView = require('./lib/views/header.js');
var TableView = require('./lib/views/table.js');

var ApplicationRouter = Backbone.Router.extend({
    routes: {
        "": "index",
        "dbindex": "dbIndex",
        "table/:tablename": "dbTable"
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
    }
});
new ApplicationRouter();

if(Backbone.History.started != true){
    document.location.hash = "#";
    Backbone.history.start({pushState: false});
}
window.Backbone = Backbone;