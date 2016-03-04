define([
    'backbone',
    'tmpl/scoreboard',
    'collections/scoreboard'
], function(
    Backbone,
    tmpl,
    Scoreboard
){

    var ScoreboardView = Backbone.View.extend({
        template: tmpl,
        collection: new Scoreboard(),

        initialize: function () {
            // TODO
        },
        render: function () {
            this.$el.html(this.template(this.collection.toJSON()));
            return this;
        },
        show: function () {
            // TODO
        },
        hide: function () {
            // TODO
        }

    });

    return new ScoreboardView();
});
