define([
    'backbone',
    'tmpl/main'
], function(
    Backbone,
    tmpl
){

    var MainView = Backbone.View.extend({

        template: tmpl,
        initialize: function () {
            // TODO
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        show: function () {
            // TODO
        },
        hide: function () {
            // TODO
        }

    });

    return new MainView();
});
