define([
    'backbone',
    'tmpl/registration'
], function(
    Backbone,
    tmpl
){

    var RegistrationView = Backbone.View.extend({

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

    return new RegistrationView();
});
