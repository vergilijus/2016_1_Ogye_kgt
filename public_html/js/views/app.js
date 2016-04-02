define([
    'backbone'
], function(
    Backbone
) {
    var AppView = Backbone.View.extend({
        el: $('#page'),

        initialize: function () {
            this._views = {};
        },

        setViews: function(Views) {
            _.each(Views, function(View, name) {
                this._views[name] = {
                    viewConstructor: View
                }
            }, this);
        },

        getView: function(name) {
            var view = this._views[name];

            if (!view.instance) {
                view.instance = new view.viewConstructor();
                this.listenTo(view.instance, 'show', this.hideOtherViews);

                this.$el.append(view.instance.render().$el);

                this._views[name].instance = view.instance;
            }

            return view.instance;
        },

        hideOtherViews: function() {
            _.each(this._views, function(view) {
                if (view.instance) {
                    view.instance.hide();
                }
            }, this);
        }
    });

    return new AppView();
});