define(function (require) {

    var OffScreenRenderer = require('./off_screen_renderer'),
        ScreenRenderer = require('./screen_renderer'),
        Camera = require('./camera'),
        Table = require('./table'),
        Hand = require('./hand');

    return function () {
        // var table = document.createElement('canvas');
            // offScreenRenderer = new OffScreenRenderer(table, 3400, 3400),
            // screenRenderer = new ScreenRenderer(document.getElementById('canvas'),
            //     new Camera(table, 0, 0, window.innerWidth, window.innerHeight), window.innerWidth, window.innerHeight);



        // offScreenRenderer.addDrawable(new Table(34, 34, 100, 100));
        // offScreenRenderer.render();

        // screenRenderer.addDrawable(new Hand());
        // screenRenderer.render();
    };
});