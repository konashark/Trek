var gInfo = {
    canvas: undefined,
    context: undefined,
    WIDTH: 260,
    HEIGHT: 260
};

/*************************************************/
gInfo.init = function() {
    gInfo.canvas = $("#infocanvas")[0];
    gInfo.context = gInfo.canvas.getContext("2d");

    gInfo.draw();
};

/*************************************************/
gInfo.draw = function() {
    var ctx = gInfo.context;
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#888";
    ctx.fillRect(0,0,gInfo.WIDTH, gInfo.HEIGHT);
    ctx.strokeRect(0,0,gInfo.WIDTH, gInfo.HEIGHT);
    ctx.font = "15px sans-serif";
    ctx.fillStyle = "#FC0";
    ctx.fillText("MISSION STATUS", 16, 20);

    ctx.fillStyle = "#66aaff";
    ctx.fillText("HOSTILES: " + gMap.numHostiles, 16, 48);
    ctx.fillText("STARBASES LOST: " + gMap.basesLost, 16, 68);
    ctx.fillText("PLANETS LOST: " + gMap.planetsLost, 16, 88);

};

