define(function(require){

    var Backbone = require('backbone');
        mainView = require('views/main'),
        loginView = require('views/login'),
        gameView = require('views/game'),
        scoreboardView = require('views/scoreboard');

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'login': 'loginAction',
            '*default': 'defaultActions'
        },
        defaultActions: function () {
            console.log(mainView);
            $('#page').html(mainView.render().$el);
        },
        scoreboardAction: function () {
            console.log('the #scoreboard route');
            $('#page').html(scoreboardView.render().$el);
        },
        gameAction: function () {
            console.log('the #game route');
            $('#page').html(gameView.render().$el);
        },
        loginAction: function () {
            console.log('the #login route');
            $('#page').html(loginView.render().$el);
        }
    });

    return new Router();
});
