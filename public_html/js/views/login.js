define([
    'backbone',
    'tmpl/login'
], function(
    Backbone,
    tmpl
){

    var LoginView = Backbone.View.extend({

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

    return new LoginView();
});
