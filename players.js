
/**
 * Request Example (Players)
 */
$.get('https://raw.githubusercontent.com/chaimaal/chart_bar/master/api.json', function (res) {
    const apiJson = $.parseJSON(res);
    const data = apiJson.data.DAILY.dates.map((v, k) => {
        return {
            label: v ? (v.substr(0, 4) + "-" + v.substr(4, 2) + "-" + v.substr(6, 2)) : '0',
            value: Object.values(apiJson.data.DAILY.dataByMember.players).map(res => res.points)
        }
    })

    // settings.dictionary
    new ChaimaChart({
        canvasId: "myCanvas",
        data: data,
        colors: ["red", "blue"],
        title: apiJson.settings.label,
        barWidth: 10,
        minValue: 0,
        maxValue: 1000,
        players: Object.keys(apiJson.settings.dictionary)
    });
});


/**
 * Chaima Bar Chart 
 */
function ChaimaChart(config) {
    // user defined properties
    this.canvas = document.getElementById(config.canvasId);
    this.data = config.data;
    this.title = config.title;
    this.data1 = config.data1;
    this.colors = config.colors;
    this.players = config.players;
    this.barWidth = config.barWidth;

    this.maxValue = config.maxValue;
    this.minValue = config.minValue;

    // constants
    this.font = "12pt Calibri";
    this.axisColor = "#555";
    this.gridColor = "#aaa";

    // relationships
    this.context = this.canvas.getContext("2d");
    this.range = this.maxValue - this.minValue;
    this.numGridLines = Math.round(this.range / 200);
    this.x = 50
    this.y = 25;
    this.width = 800;
    this.height = 300
    this.offsets = [0, 80]
    this.drawAxis();
    this.drawBars(this.data);
    this.drawYVAlues();
    this.drawXLabels();
    this.drawTitle();
    this.drawMap(this.players, this.colors, this.offsets);
}

/**
 * Draw All Bars
 */
ChaimaChart.prototype.drawBars = function (data) {
    var context = this.context;
    context.save();
    var barSpacing = this.width / data.length;
    var unitHeight = this.height / this.range;

    for (var n = 0; n < data.length; n++) {
        var bar = data[n];
        var barHeight = (data[n].value[0][n] - this.minValue) * unitHeight;
        if (barHeight > 0) {
            context.save();
            context.translate(Math.round(this.x + ((n + 1 / 2) * barSpacing)), Math.round(this.y + this.height));
            context.scale(1, -1);
            context.beginPath();
            context.rect(-this.barWidth, 0, this.barWidth, barHeight);
            context.fillStyle = this.colors[0];
            context.fill();
            context.restore();
        }
        var barHeight = (data[n].value[1][n] - this.minValue) * unitHeight;
        if (barHeight > 0) {
            context.save();
            context.translate(Math.round(this.x + ((n + 1 / 2) * barSpacing)), Math.round(this.y + this.height));
            context.scale(1, -1);
            context.beginPath();
            context.rect(this.barWidth, 0, this.barWidth, barHeight);
            context.fillStyle = this.colors[1];
            context.fill();
            context.restore();
        }
    }
    context.restore();
};

/**
 * Draw Label Y -Axis
 */
ChaimaChart.prototype.drawYVAlues = function () {
    var context = this.context;
    context.save();
    context.font = this.font;
    context.fillStyle = "black";
    context.textAlign = "right";
    context.textBaseline = "middle";

    for (var n = 0; n <= this.numGridLines; n++) {
        var value = this.maxValue - (n * 2);
        var thisY = (n * this.height / this.numGridLines) + this.y;
        context.fillText(value, this.x - 5, thisY);
    }

    context.restore();
};

/**
 * Draw Label X -Axis
 */
ChaimaChart.prototype.drawXLabels = function () {
    var context = this.context;
    context.save();
    var data = this.data;
    var barSpacing = this.width / data.length;

    for (var n = 0; n < data.length; n++) {
        var label = data[n].label;
        context.save();
        context.translate(this.x + ((n + 1 / 2) * barSpacing), this.y + this.height + 10);
        context.rotate(-1 * Math.PI / 4); // rotate 45 degrees
        context.font = this.font;
        context.fillStyle = "black";
        context.textAlign = "right";
        context.textBaseline = "middle";
        context.fillText(label, 0, 0);
        context.restore();
    }
    context.restore();
};

/**
 * Draw Title
 */
ChaimaChart.prototype.drawTitle = function () {
    var context = this.context;
    context.save();
    context.translate(this.width / 2 + 50, this.y + this.height + 100);
    context.font = this.font;
    context.fillStyle = "black";
    context.textAlign = "right";
    context.textBaseline = "middle";
    context.fillText(this.title, 0, 0);
    context.restore();

}


/**
 * Draw indicator Map
 */
ChaimaChart.prototype.drawMap = function (title, colors, offset) {
    title.map((players, k) => {
        var context = this.context;
        context.beginPath()
        context.save();
        context.translate(this.width - 100, this.y + this.height + 100);
        context.rect(40 + offset[k], -10, 20, 20);
        context.fillStyle = colors[k];
        context.fillText(players, 10 + offset[k], 0);
        context.fill();
        context.restore();
    })
}

/**
 * Draw  X Axis
 */
ChaimaChart.prototype.drawAxis = function () {
    var context = this.context;
    context.save();
    context.beginPath();
    context.moveTo(this.x, this.y + this.height);
    context.lineTo(this.x + this.width, this.y + this.height);
    context.moveTo(this.x, this.y);
    context.lineTo(this.x, this.height + this.y);
    context.strokeStyle = this.axisColor;
    context.lineWidth = 2;
    context.stroke();
    context.restore();
};




