var GantChart = (function(R) {
    var _Y_SCALE_NUM = 11, _DELTA_X = 80, _DELTA_Y = 80,

        //x轴y轴字体样式
        _FONT_X = {
            font: '14px Helvetica, Arial',
            fill: '#000'
        },
        _FONT_Y = {
            font: '12px Helvetica, Arial',
            fill: '#888'
        },

        // _STYLE_RECT = {
        //     stroke: '#fff'
        // },
        _STYLE_RECT_STROKE = '#fff',
        _STYLE_RECT_COLOR_DEFAULT = '#4ba9e6',
        _STYLE_RECT_COLOR_INIT = '#E3E3E3',
        _STYLE_RECT_COLOR_SUCCESS = '#458B00';

        _ANIMA_SPEED = 1000;

    var _width = null, _height = null,
        _gridX = 150, _gridY = 60,

        _paper;

    var _strToDt = function(strDt) {
        return Date.parse(strDt.replace(/-/g, '/'));
    };
    /**
     * 计算Y轴范围
     * @param  {[type]} yScales [description]
     * @return {[type]}         [description]
     */
    var _calcDeltaY = function(yScales) {
        var minY = yScales[0].beginDt,
            maxY = yScales[yScales.length - 1].endDt,

            minMsY = _strToDt(minY),
            maxMsY = _strToDt(maxY);

        var offset = 0;
        while (((offset + (maxMsY - minMsY)) / 1000) % (_Y_SCALE_NUM - 1) !== 0) {
            offset++;
        }

        maxMsY = maxMsY + offset;

        return {
            msPerScale: (maxMsY - minMsY) / (_Y_SCALE_NUM - 1),
            minMs: minMsY,
            maxMs: maxMsY,
            msToWidth: (_Y_SCALE_NUM - 1.0) * _DELTA_Y / (maxMsY - minMsY)
        };
    };

    /**
     * 渲染刻度
     * @param  {[type]} xVals         [description]
     * @param  {[type]} yVals         [description]
     * @param  {[type]} yScaleOptions [description]
     * @return {[type]}               [description]
     */
    var _showScale = function(xVals, yVals, yScaleOptions) {
        var minMs = yScaleOptions.minMs,
            maxMs = yScaleOptions.maxMs,
            msPerScale = yScaleOptions.msPerScale,
            msToWidth = yScaleOptions.msToWidth;

        //画x轴刻度
        for (var i = 0; i < xVals.length; i++) {
            var x = _gridX + (i - 1) * _DELTA_X + 110,
                y = _gridY - 25;

            _paper.text(x, y, xVals[i]).attr(_FONT_X);
        }

        for (var j = 0; j < _Y_SCALE_NUM; j++) {
            var dtMs = minMs + (j - 1) * msPerScale,
                dt = new Date(dtMs);

            var x = _gridX - 70,
                y = (dtMs - minMs) * msToWidth + 140;

            _paper.text(x, y, dt.format('yyyy-M-d h:m:s')).attr(_FONT_Y);
        }
    };

    /**
     * 通过动
     * 
     * 画画矩形
     * @param  {[type]} xVals         options.x
     * @param  {[type]} yVals         options.y
     * @param  {[type]} yScaleOptions _calcDeltaY
     * @return {[type]}               [description]
     */
    var _drawRectsWithAnimation = function(xVals, yVals, yScaleOptions) {
        var flag = 0,
            beginDtY = _strToDt(yVals[0].beginDt);

        var _animaRect = function() {
            if (flag ===  xVals.length) {
                return;
            } else {
                var beginDt = _strToDt(yVals[flag].beginDt),
                    endDt = _strToDt(yVals[flag].endDt);

                var x = _gridX + flag * _DELTA_X,
                    y = _gridY + (beginDt - beginDtY)* yScaleOptions.msToWidth,

                    width = _DELTA_X, height = (endDt - beginDt) * yScaleOptions.msToWidth,
                    time = (endDt - beginDt) / _ANIMA_SPEED;

                _paper.rect(x, y, width, 0, 10).attr({
                        fill: _STYLE_RECT_COLOR_INIT,
                        stroke: _STYLE_RECT_STROKE
                    })
                    .animate({
                        fill: _STYLE_RECT_COLOR_DEFAULT,
                        height: height
                    }, time, '<');

                flag++;
                setTimeout(_animaRect, time);
            }
        };
        
        _animaRect();
    };

    /**
     * 画矩形
     * @param  {[type]} xVals         [description]
     * @param  {[type]} yVals         [description]
     * @param  {[type]} yScaleOptions [description]
     * @return {[type]}               [description]
     */
    var _drawRects = function(xVals, yVals, yScaleOptions) {
        var beginDtY = _strToDt(yVals[0].beginDt);

        for (var i = 0; i < xVals.length; i++) {
            var beginDt = _strToDt(yVals[i].beginDt),
                endDt = _strToDt(yVals[i].endDt);

            var x = _gridX + i * _DELTA_X,
                y = _gridY + (beginDt - beginDtY)* yScaleOptions.msToWidth,

                width = _DELTA_X, height = (endDt - beginDt) * yScaleOptions.msToWidth;

            _paper.rect(x, y, width, height, 10).attr({
                fill: _STYLE_RECT_COLOR_DEFAULT,
                stroke: _STYLE_RECT_STROKE
            });
        }
    };

    return {
        /**
         * 画布初始化
         * @param  {[type]} options {
         *                              dom: '',
         *                              width: 400,
         *                              height: 800,
         *                              x: ['task0', 'task1', 'task2'],
         *                              y: [{
         *                                  beginDt: '',
         *                                  endDt: ''
         *                              }, {
         *                                  beginDt: '',
         *                                  endDt: ''
         *                              }, {
         *                                  beginDt: '',
         *                                  endDt: ''
         *                              }],
         *                              callbacks: {
         *                                  onInit: function() {
         *                                  }
         *                              },
         *                              isAnimate: false
         *                          }
         * @return {[type]}         [description]
         */
        initSvgCanvas: function(options) {
            _width = options.width;
            _height = options.height;

            var yScale = _calcDeltaY(options.y, 1000);
            _paper = R(options.dom, _width, _height);

            _paper.drawGrid(
                _gridX, _gridY,
                (options.x.length + 1), _Y_SCALE_NUM,
                _DELTA_X, _DELTA_Y, _DELTA_Y * _Y_SCALE_NUM);

            _showScale(options.x, options.y, yScale);

            if (options.isAnimate) {
                _drawRectsWithAnimation(options.x, options.y, yScale);
            } else {
               _drawRects(options.x, options.y, yScale);
            }
        }
    };
})(Raphael);