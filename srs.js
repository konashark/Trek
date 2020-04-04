var srs = {
    canvas: undefined,
    context: undefined
};

/*************************************************/
srs.init = function() {
    srs.canvas = $("#srscanvas")[0];
    srs.context = srs.canvas.getContext("2d");
};

/*************************************************/
srs.draw = function() {
    var ctx = srs.context;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,260,260);

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(0,0,260,260);

    ctx.fillStyle = "#FC0";
    ctx.font = "14px sans-serif";
    ctx.fillText("SHORT-RANGE SCAN", 8, 16);

};

