var info = {
    canvas: undefined,
    context: undefined,
    WIDTH: 260,
    HEIGHT: 260
};

/*************************************************/
info.init = function() {
    info.canvas = $("#infocanvas")[0];
    info.context = info.canvas.getContext("2d");

    info.draw();
};

/*************************************************/
info.draw = function() {
    var ctx = info.context;
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#888";
    ctx.fillRect(0,0,info.WIDTH, info.HEIGHT);
    ctx.strokeRect(0,0,info.WIDTH, info.HEIGHT);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#FC0";
    ctx.fillText("INFO", 8, 18);
};

