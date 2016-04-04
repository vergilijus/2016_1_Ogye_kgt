define(function (require) {

    QUnit.module("views/viewManager");

    QUnit.test('viewManager adds views', function (assert) {

        var gameView = require('views/game'),
            scoreboardView = require('views/scoreboard'),
            viewManager = require('views/viewManager');

        if (Function.prototype.bind === undefined) {
            Function.prototype.bind = function ()
            {
                var fn = this,
                    args = Array.prototype.slice.call(arguments),
                    object = args.shift();
                return function ()
                {
                    return fn.apply(object,
                        args.concat(Array.prototype.slice.call(arguments)));
                };
           };
        }

        viewManager.addView(gameView);
        assert.notOk(viewManager.views.length != 1 || viewManager.views[viewManager.views.length - 1] != gameView, 'Second addition ok');

        viewManager.addView(scoreboardView);
        assert.notOk(viewManager.views.length != 2 || viewManager.views[viewManager.views.length - 1] != scoreboardView, 'Third addition ok');

    });

    QUnit.test("AppView correctly shows and hides views", function () {
        	var viewManager = require('views/viewManager');

            var mainView = require('views/main'),
                scoreboardView = require('views/scoreboard');

            viewManager.addView(mainView);
            viewManager.addView(scoreboardView);

            viewManager.showView(mainView);
            QUnit.equal(viewManager.views.current, mainView, 'The mainView is visible');

            viewManager.showView(scoreboardView);
            QUnit.equal(viewManager.views.current, scoreboardView, 'The scoreboardView is visible');
            QUnit.notEqual(viewManager.views.current, mainView, 'The scoreboardView is visible');

        });

});
