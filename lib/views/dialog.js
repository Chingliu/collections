var Marionette = require('backbone.marionette');

var DialogView = Marionette.LayoutView.extend({
    ui: {
        modal: ".modal"
    },

    onShowDialog: function(){
        this.ui.modal.on('hide.bs.modal', function(){
            window.history.back();
        });
        this.ui.modal.modal('show');
    }
});

module.exports = DialogView;
