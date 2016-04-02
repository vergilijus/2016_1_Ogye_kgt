define(function(require){

    var Backbone = require('backbone');
        mainView = require('views/main'),
        loginView = require('views/login'),
        gameView = require('views/game'),
        scoreboardView = require('views/scoreboard');
        registrationView = require('views/registration');

var app = require('views/app');
    app.setViews({
        'main': mainView,
        'login': loginView,
        'scoreboard': scoreboardView,
        'game': gameView,
        'reg': registrationView
    });

    var Router = Backbone.Router.extend({

        routes: {
            'scoreboard': 'scoreboardAction',
            'game': 'gameAction',
            'login': 'loginAction',
            'registration': 'regAction',
            '*default': 'defaultActions'
        },

        defaultActions: function () {
//            console.log("Second: " + this.session.isAuth);
            app.getView('main').show();
        },

        scoreboardAction: function () {
            app.getView('scoreboard').show();
        },

        gameAction: function () {
            app.getView('game').show();
        },

        loginAction: function () {
            app.getView('login').show();
        },

        regAction: function () {
            app.getView('reg').show();
        },

    });

    return new Router();

});