define([
    'backbone'
], function(
    Backbone
){

    var Model = Backbone.Model.extend({
        defaults: {
            'username' : '',
            'score': 0
        }
    });

    return Model;
});
