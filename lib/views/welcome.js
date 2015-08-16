var remote = require('remote');
var dialog = remote.require('dialog');

var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var Handlebars = require('../templates');

var sqlite3 = require('sqlite3');

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

    onOpenDatabase: function(){
        var response = dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: [ 'openFile' ],
            filters: [
                { name: 'Databases', extensions: ['sqlite', 'sqlite3', 'db3'] },
            ]
        });
        if(response != undefined){
            window.db = new sqlite3.Database(response[0], function(err){
                if(err){
                    // TOOD: Failure
                } else{
                    remote.getCurrentWindow().setRepresentedFilename(response[0]);
                    Backbone.history.navigate(
                        '/dbindex',
                        {trigger: true}
                    );
                    window.db.on("trace", function(sql){
                        console.log(sql);
                    });
                }
            });
        }
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
    }
});

module.exports = WelcomeView;
