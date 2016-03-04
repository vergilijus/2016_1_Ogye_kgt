define([
    'backbone'
], function(
    Backbone
){

    var View = Backbone.View.extend({

        template: {},
        initialize: function () {
            this.render();
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        },
        show: function () {
            this.$el.show();
        },
        hide: function () {
            // TODO
        }

    });

    return new View();
});
