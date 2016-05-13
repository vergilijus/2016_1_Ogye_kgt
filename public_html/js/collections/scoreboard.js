define(function(require) {
        var Backbone = require('backbone');
        var underscore = require('underscore');
        var scores = require('models/scores');
        return Backbone.Collection.extend({
            model: scores,

            initialize: function() {
                this.initFakeScores();
            },

            comparator: function(item) {
                return -item.get('score');
            },

            initFakeScores: function() {
                this.set([
                    {name: 'Sedler', score: 2100},
                    {name: 'Nagibator666', score: 200},
                    {name: 'AntonLogvinov', score: 1010},
                    {name: 'IvanGroznuy', score: 1530},
                    {name: 'VictoryDay', score: 1945},
                    {name: 'MaxPower', score: 100500},
                    {name: 'VladTepes', score: 1431},
                    {name: 'AnjeySapkovskiy', score: 1948},
                    {name: 'RayBradbery', score: 2012},
                    {name: 'FranzKafka', score: 1924},
                ]);
            }
        });
});
