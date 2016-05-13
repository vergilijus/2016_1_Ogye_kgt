define(function (require) {

    var Backbone = require('backbone'),
        tmpl = require('tmpl/game'),
        game = require('../game/main');

        var GameView = Backbone.View.extend({

            template: tmpl,
            initialize: function () {
                // TODO
            },
            render: function() {
                this.$el.html(this.template());
                return this;
            },

            show: function () {
                this.trigger('show');
                game.init();
                this.$el.show();
            },

            hide: function () {
                this.endGame();
                this.$el.remove();
                this.$el.hide();
            },
            
            endGame: function () {
                $('canvas').remove();
            }
        });

        return new GameView();
});
