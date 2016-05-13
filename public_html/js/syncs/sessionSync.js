define(function(require) {
    var Backbone = require('backbone');
    return function(method, model, options) {

        var methods = {
            'create': {
                send: function() {
                    Backbone.sync('create', model, options);
                },

            },

            'read': {
                send: function() {
                    Backbone.sync('read', model, options);
                },
            },

            'update': {

                send: function() {
                    Backbone.sync(method,model,options);

                }
            },
            'delete': {
                send: function () {
                    Backbone.sync('delete', model, options);
                }
            }
        };

        return methods[method].send();
    };
});
