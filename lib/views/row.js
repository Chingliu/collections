var Marionette = require('backbone.marionette');
var Handlebars = require('../templates');

var DialogView = require('./dialog');
var Row = require('../models/row');

var RowView = DialogView.extend({
    template: Handlebars(__dirname + "/row.html"),
    initialize: function(){
        console.log(this.options);
        this.model = new Row();
        this.model.sql = this.options.sql;
        this.listenTo(this.model, "sync", function(){
            this.render();
            this.onShowDialog();
        });
        this.model.fetch();
    },

    templateHelpers: function(){
        console.log(this.model);
        var context = {
            attrs: _.map(this.model.attributes, function(value, key){
                return {key: key, value: value};
            })
        };
        console.log(context);
        return context;
    }
});

module.exports = RowView;
