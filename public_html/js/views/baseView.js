define(function (require) {
        var Backbone = require('backbone');
        var viewManager = require('views/viewManager');
        var View = Backbone.View.extend({
            template: {},
            requireAuth: false,
            initialize: function () {

            },
            render: function () {
                this.$el.html(this.template);
            },
            show: function () {
                this.trigger('show', this);
                this.$el.show();
            },
            hide: function () {
                this.$el.hide();
            }
        });
        return View;
    });

