var remote = require('remote');
var dialog = remote.require('dialog');
var path = require('path');

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var Handlebars = require('../templates');

var RecentDocumentCollection = require('../collections/recent_documents');
var RecentDocument = require('../models/recent_document');

var sqlite3 = require('sqlite3');

var RecentDocumentView = Marionette.LayoutView.extend({
    template: Handlebars(__dirname + '/recent_document.html'),
    tagName: "a",
    className: "list-group-item",

    templateHelpers: function(){
        return {
            name: this.model.name()
        }
    },

    onRender: function(){
        this.$el.attr("href", "#");
        this.$el.on("click", _.bind(this.trigger, this, 'open'));
    }
});

var NoRecentDocumentsView = Marionette.LayoutView.extend({
    template: Handlebars(__dirname + "/no_recent_documents.html")
})

var RecentDocumentList = Marionette.CollectionView.extend({
    tagName: "div",
    className: "list-group",
    childView: RecentDocumentView,
    emptyView: NoRecentDocumentsView,

    initialize: function(){
        this.collection = new RecentDocumentCollection();
        this.collection.fetch();
    },

    collectionEvents: {
        "sync": "render"
    },

    onChildviewOpen: function(child){
        this.trigger("open", child.model.get("filename"));
    }
});

var WelcomeView = Marionette.LayoutView.extend({
    template: Handlebars(__dirname + '/welcome.html'),

    ui: {
        newDatabase: "#new",
        openDatabase: "#open"
    },

    triggers: {
        "click @ui.newDatabase": "newDatabase",
        "click @ui.openDatabase": "openDatabase"
    },

    regions: {
        recentDocuments: "#recentDocuments"
    },

    onOpenDatabase: function(){
        var response = dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: [ 'openFile' ],
            filters: [
                { name: 'Databases', extensions: ['sqlite', 'sqlite3', 'db3'] },
            ]
        });
        if(response != undefined){
            this.openLocalDatabase(response[0]);
        }
    },

    openLocalDatabase: function(what){
        window.db = new sqlite3.Database(what, function(err){
            if(err){
                // TOOD: Failure
            } else{
                remote.getCurrentWindow().setRepresentedFilename(what);
                remote.getCurrentWindow().setTitle(path.basename(what));
                Backbone.history.navigate(
                    '/dbindex',
                    {trigger: true}
                );
                var recentDoc = new RecentDocument({
                    filename: what
                });
                recentDoc.save();

                window.db.on("trace", function(sql){
                    console.log(sql);
                });
            }
        });
    },

    onNewDatabase: function(){
        // Switch to new DB screen
        window.db = new sqlite3.Database(":memory:", function(err){
            if(err){
                // TOOD: Failure
            } else{
                Backbone.history.navigate(
                    '/dbindex',
                    {trigger: true}
                );
            }
        });
    },

    onRender: function(){
        var view = new RecentDocumentList();
        this.showChildView('recentDocuments', view);
        this.listenTo(view, 'open', this.openLocalDatabase);
    }
});

module.exports = WelcomeView;
