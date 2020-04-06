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
    ctx.font = "15px sans-serif";
    ctx.fillStyle = "#FC0";
    ctx.fillText("MISSION STATUS", 16, 20);

    ctx.fillStyle = "#66aaff";
    ctx.fillText("HOSTILES: " + gmap.numHostiles, 16, 48);
    ctx.fillText("STARBASES LOST: " + gmap.basesLost, 16, 68);
    ctx.fillText("PLANETS LOST: " + gmap.planetsLost, 16, 88);

};

