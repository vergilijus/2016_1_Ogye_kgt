define(function(require){

    var Backbone = require('backbone'),
        mainView = require('views/main'),
        loginView = require('views/login'),
        gameView = require('views/game'),
        scoreboardView = require('views/scoreboard'),
        registrationView = require('views/registration'),
        viewManager = require('views/viewManager');

    var Router = Backbone.Router.extend({
        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'login': 'loginAction',
            'registration': 'regAction',
            '*default': 'defaultActions'
        },


        /*
            var app = require('views/app');
                viewManager.addView({
                    'main': mainView,
                    'login': loginView,
                    'scoreboard': scoreboardView,
                    'game': gameView,
                    'reg': registrationView
                });
        */

        manageView: function (view) {
            viewManager.addView(view);
            view.show();
        },

        defaultActions: function () {
            this.manageView(mainView);
        },
        scoreboardAction: function () {
            this.manageView(scoreboardView);
        },

        gameAction: function () {
            this.manageView(gameView);
        },

        loginAction: function () {
            this.manageView(loginView);
        },

        regAction: function () {
            this.manageView(registrationView);
        }
    });

    return new Router();
});



