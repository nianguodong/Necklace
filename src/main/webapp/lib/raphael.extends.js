(function(R) {
    R = Raphael || {};

    /**
     * 绘制grid表格
     * @param  {[type]} beginX 开始x轴
     * @param  {[type]} beginY 开始y轴
     * @param  {[type]} numX   x刻度数
     * @param  {[type]} numY   y刻度数
     * @param  {[type]} deltaWidth  x刻度间距
     * @param  {[type]} deltaHeight y刻度间距
     * @param  {[type]} color  线的颜色
     * @return {[type]}        [description]
     */
    R.fn.drawGrid = function (beginX, beginY, numX, numY, deltaWidth, deltaHeight, color) {
        var width = (numX - 1) * deltaWidth,
            height = (numY - 1) * deltaHeight;

        color = color || "#aaa";

        //刻画竖直方向刻度线
        for (var idxX = 0; idxX < numX; idxX++) {
            var x = deltaWidth * idxX,
                moveToV = 'M ' + (x + beginX) + ',' + beginY,
                lineToV = 'L ' + (x + beginX) + ',' + (beginY + height);

            this.path(moveToV + ' ' + lineToV).attr({
                'stroke-width': 0.4,
                'stroke': color
            });
        }
        //刻画水平方向刻度线
        for (var idxY = 0; idxY < numY; idxY++) {
            var y = deltaHeight * idxY,
                moveToH = 'M ' + beginX + ',' + (y + beginY),
                lineToH = 'L ' + (beginX + width) + ',' + (y + beginY);

            this.path(moveToH + ' ' + lineToH).attr({
                'stroke-width': 0.4,
                'stroke': color
            });
        }

        return this;
    };

})(Raphael);