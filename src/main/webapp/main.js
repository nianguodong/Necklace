// angular.module('main', ['components']);

var inputs = [{
    beginDt: '2013-12-01 12:34:11',
    endDt: '2013-12-01 12:50:10',
    taskName: 'searchInfo'
}, {
    beginDt: '2013-12-01 12:50:11',
    endDt: '2013-12-01 13:30:00',
    taskName: 'gettingInfo'
}, {
    beginDt: '2013-12-01 13:40:12',
    endDt: '2013-12-01 14:40:12',
    taskName: 'pending'
}, {
    beginDt: '2013-12-01 14:43:12',
    endDt: '2013-12-01 15:00:00',
    taskName: 'logging'
}, {
    beginDt: '2013-12-01 15:01:12',
    endDt: '2013-12-01 15:39:23',
    taskName: 'printing'
}];

var xs = [], ys = [];

for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];

    xs.push(input.taskName);
    ys.push({
        beginDt: input.beginDt,
        endDt: input.endDt
    });

}
GantChart.initSvgCanvas({
    dom: document.getElementById('gant'),
    width: 1000,
    height: 1000,
    x: xs,
    y: ys,
    callbacks: {
        onInit: function() {
            console.log(1);
        }
    },
    isAnimate: true
});

