Template.pageStats.helpers({

    conversions: function() {

        if (this.model == 'salespage' || this.model == 'leadgen' || this.model == 'tripwire') {

            var now = new Date();
            var limitDate = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30);

            var visits = Sessions.find({ date: { $gte: limitDate }, pageId: this._id, type: 'visit' }).fetch().length;
            var clicks = Sessions.find({ date: { $gte: limitDate }, pageId: this._id, type: 'click' }).fetch().length;

            if (visits != 0) {
                return (clicks / visits * 100).toFixed(2) + '%';
            } else {
                return '0%';
            }
        }

    }

});

Template.pageStats.onRendered(function() {

    Meteor.call('getGraphData', this.data._id, 'trend', function(err, graphData) {

        var ctx = document.getElementById("sessions-chart");

        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: graphData,
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }]
                }
            }
        });

    });

    Meteor.call('getGraphData', this.data._id, 'conversion', function(err, graphData) {

        var ctx = document.getElementById("conversions-chart");

        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: graphData,
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }]
                }
            }
        });

    });

});
