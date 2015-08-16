var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var Handlebars = require('../templates');

var TableCollection = require('../collections/tables');

var TableView = Marionette.LayoutView.extend({
    template: Handlebars(__dirname + '/header.table.html'),
    tagName: 'li',
    ui: {
        link: "a"
    }
});

var TableListView = Marionette.CollectionView.extend({
    childView: TableView,
    tagName: "ul",
    className: "dropdown-menu",
    collectionEvents: {
        "sync": "render"
    },
    onRender: function(){
        this.$el.attr("aria-labelledby", "tableDrop");
        this.$el.unwrap();
    }
});

var HeaderView = Marionette.LayoutView.extend({
    template: Handlebars(__dirname + '/header.html'),

    ui: {
        dropdown: ".dropdown-toggle"
    },

    regions: {
        tableList: "#tableList"
    },

    onRender: function(){
        var col = new TableCollection();
        this.showChildView("tableList", new TableListView({
            collection: col
        }));
        col.fetch();
        this.ui.dropdown.dropdown();
    }
});

module.exports = HeaderView;
