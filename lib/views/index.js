var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
var Handlebars = require('../templates');

var IndexView = Marionette.LayoutView.extend({
    template: Handlebars(__dirname + '/index.html')

});

module.exports = IndexView;
