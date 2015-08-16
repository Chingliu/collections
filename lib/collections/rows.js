var Backbone = require('backbone');

var TableCollection = Backbone.Collection.extend({
    fetch: function(){
        var self = this;
        this.columns = [];
        window.db.all("SELECT * FROM "+this.name+" LIMIT 0, 100", function(err, rows) {
            self.add(rows);
            self.columns = Object.keys(rows[0]);
            self.trigger("sync");
        });
    }
});

module.exports = TableCollection;
