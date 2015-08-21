var Backbone = require('backbone');
var _ = require('underscore');

var Row = Backbone.Model.extend({
    fetch: function(){
        var self = this;
        window.db.all.apply(window.db, _.union(this.sql, [function(err, rows) {
            if(err){ console.log(err); }
            console.log(rows);
            self.set(rows[0]);
            self.trigger("sync");
        }]));
    }
});

module.exports = Row;
