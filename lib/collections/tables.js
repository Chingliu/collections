var Backbone = require('backbone');

var TableCollection = Backbone.Collection.extend({
    fetch: function(){
        // sql attribute on this table will be useful
        // remember it
        var self = this;
        window.db.each("SELECT name FROM sqlite_master WHERE type='table';", function(err, row) {
            self.add({
                name: row.name
            });
        });
        this.trigger("sync");
    }
});

module.exports = TableCollection;
