define([
    'backbone'
], function(
    Backbone
){
    var viewManager = Backbone.View.extend({
        el: '#page',
        views: [],
        showView: function (thisView) {
            this.views.push(thisView.render());
            if(this.views.current != undefined){
                this.views.current.hide();
            }
            this.views.current = thisView;
            /*
            for (var viewIndex in this.views) {
                if (this.views[viewIndex] !== thisView) {
                    this.views[viewIndex].hide();
                }
            }*/
        },
        addView: function(view) {
            if (this.views.indexOf(view) == -1) {
                this.$el.append(view.$el);
                this.listenTo(view, 'show', this.showView.bind(this, view));
            }
            this.hideViews();
        },
        hideViews: function () {
            for (var view in this.views) {
                this.views[view].hide();
            }
        }

    });

    return new viewManager();
});
