var Backbone = require('backbone');
var Handlebars = require('handlebars');

function ForeignKey(args){
    return _.extend(args, {
        toString: function(){
            var val = Handlebars.Utils.escapeExpression(this.value);
            var table = Handlebars.Utils.escapeExpression(this.table);
            var to = Handlebars.Utils.escapeExpression(this.to);
            return '<a href="#viewrow/'+table+'/'+to+'/'+val+'">' +
                val +
                '</a>';
        },
        hasSafeValue: true
    })
}

function Column(args){
    return _.extend(args, {
        toString: function(){
            return this.name;
        }
    })
}

var TableCollection = Backbone.Collection.extend({
    fetch: function(){
        var self = this;
        this.columns = [];
        window.db.all("SELECT * FROM "+this.name+" LIMIT 0, 100", function(err, rows) {
            self.add(rows);
            self.columns = _.map(Object.keys(rows[0]), function(col){
                return new Column({
                    "name": col
                });
            });

            window.db.all("PRAGMA foreign_key_list("+self.name+");", function(err, rows){
                _.each(rows, function(row){
                    var col = _.findWhere(self.columns, {name: row.from});
                    col.foreign_key = row.table + "." + row.to;

                    self.each(function(r){
                        r.set(row.from, new ForeignKey({
                            value: r.get(row.from),
                            to: row.to,
                            table: row.table
                        }))
                    });
                });
                self.trigger("sync");
            });
        });
    }
});

module.exports = TableCollection;
