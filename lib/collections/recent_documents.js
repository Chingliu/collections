var Backbone = require('backbone');
var _ = require('underscore');
var path = require('path');

var RecentDocument = require('../models/recent_document');

var RecentDocumentCollection = Backbone.Collection.extend({
    fetch: function(){
        var self = this;
        var storage = localStorage['recent'] || [];
        if(typeof(storage) == "string"){
            storage = JSON.parse(storage);
        }

        _.each(storage, function(filename) {
            self.add({
                filename: filename
            });
        });
        this.trigger("sync");
    },
    model: RecentDocument
});

module.exports = RecentDocumentCollection;
