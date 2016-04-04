define(function(require){

    var Backbone = require('backbone'),
        mainView = require('views/main'),
        loginView = require('views/login'),
        gameView = require('views/game'),
        scoreboardView = require('views/scoreboard'),
        registrationView = require('views/registration'),
        viewManager = require('views/viewManager');

        viewManager.addView(mainView);
        viewManager.addView(loginView);
        viewManager.addView(scoreboardView);
        viewManager.addView(gameView);
        viewManager.addView(registrationView);

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'login': 'loginAction',
            'registration': 'regAction',
            '*default': 'defaultActions'
        },


        defaultActions: function () {
            mainView.show();
        },
        scoreboardAction: function () {
            scoreboardView.show();
        },

        gameAction: function () {
            gameView.show();
        },

        loginAction: function () {
            loginView.show();
        },

        regAction: function () {
            registrationView.show();
        }
    });

    return new Router();
});



