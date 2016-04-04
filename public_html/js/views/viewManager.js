define([
    'backbone'
], function(
    Backbone
){
    var viewManager = Backbone.View.extend({
        el: '#page',
        views: [],
        showView: function (thisView) {
            if(this.views.current != undefined){
                $(this.views.current.el).hide();
            }
            this.views.current = thisView;
            $(this.views.current.el).show();
            /*
            for (var viewIndex in this.views) {
                if (this.views[viewIndex] !== thisView) {
                    this.views[viewIndex].hide();
                }
            }*/
        },
        addView: function(view) {
            if (this.views.indexOf(view) == -1) {
                this.views.push(view.render());
                this.$el.append(view.$el);
                this.listenTo(view, 'show', this.showView.bind(this, view));
            }
        }

    });

    return new viewManager();
});
