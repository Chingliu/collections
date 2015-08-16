var Handlebars = require('handlebars');
var fs = require('fs');

module.exports = function(name){
    return Handlebars.compile(fs.readFileSync(name).toString());
}
