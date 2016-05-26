require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        three: "lib/three.min",
        detector: "Detector",
        orbit: "controls/OrbitControls"
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'detector': {
            deps: ['jquery',],
            exports: 'detector'
        },
        'orbit': {
            deps: ['three', 'detector'],
            exports: 'orbit'
        }
    }
});

define([
    'backbone',
    'router',
    'app'
], function(
    Backbone,
    router,
    app
){
    Backbone.history.start();
});

