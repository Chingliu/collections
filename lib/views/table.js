var Marionette = require('backbone.marionette');
var Handlebars = require('../templates');

var RowCollection = require('../collections/rows');

var TableRowView = Marionette.LayoutView.extend({
    template: Handlebars(__dirname + "/table.row.html"),
    templateHelpers: function(){
        return {
            columns: _.map(this.model.attributes, function(value){ return {value: value} })
        }
    },
    tagName: "tr"
})

var TableListView = Marionette.CompositeView.extend({
    template: Handlebars(__dirname + "/table.rows.html"),
    childViewContainer: "tbody",
    childView: TableRowView,
    templateHelpers: function(){
        console.log(this.collection.columns);
        return {
            columns: this.collection.columns
        }
    },

    collectionEvents: {
        "sync": "render"
    }
});

var TableView = Marionette.LayoutView.extend({
    template: Handlebars(__dirname + "/table.html"),

    regions: {
        contents: "#contents"
    },

    onRender: function(){
        var col = new RowCollection();
        col.name = this.model.get("name");
        this.showChildView("contents", new TableListView({
            collection: col
        }));
        col.fetch();
    }
});

module.exports = TableView;
