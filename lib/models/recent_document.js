var Backbone = require('backbone');
var path = require('path');

var RecentDocument = Backbone.Model.extend({
    name: function(){
        return path.basename(this.get("filename"));
    },
    save: function(){
        console.log("SAVE RECENT DOCUMENT");
        var storage = localStorage['recent'] || [];
        if(typeof(storage) == "string"){
            storage = JSON.parse(storage);
        }

        if(storage.indexOf(this.get("filename")) >= 0){
            // Push to top
            storage = _.without(storage,
                this.get("filename"));
        }

        // Add to local storage
        storage.unshift(this.get("filename"));
        storage = _.first(storage, 10);

        localStorage['recent'] = JSON.stringify(storage);
    }
});

module.exports = RecentDocument;
