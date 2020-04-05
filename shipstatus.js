var shipstatus = {
    canvas: undefined,
    context: undefined
};

/*************************************************/
shipstatus.init = function() {
    shipstatus.canvas = $("#statuscanvas")[0];
    shipstatus.context = shipstatus.canvas.getContext("2d");
};

/*************************************************/
shipstatus.draw = function() {
    var ctx = shipstatus.context;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,260,260);

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(0,0,260,260);

    ctx.fillStyle = "#FC0";
    ctx.font = "18px sans-serif";

    ctx.fillStyle = "white";
    ctx.fillText("STATUS", 16, 24);

    ctx.fillStyle = "white";
    ctx.font = "14px sans-serif";
    ctx.fillText("MTIME: " + (g.missionTime/60).toFixed(0)+":"+g.missionTime%60, 128, 24);

    var y = 40, tab = 20;

    ctx.fillStyle = "#4488ff";
    ctx.fillText("ENERGY", 16, y+=tab);
    ctx.fillText("SHIELDS", 16, y+=tab);
    ctx.fillText("PHASERS", 16, y+=tab);
    ctx.fillText("TORPEDOES", 16, y+=tab);
    ctx.fillText("HYPERDRIVE", 16, y+=tab);
    ctx.fillText("COMPUTER", 16, y+=tab);

    ctx.fillStyle = "#66aaff";
    ctx.fillText("HOSTILES: " + gmap.numHostiles, 16, y+=42);
    ctx.fillText("STARBASES LOST: " + gmap.basesLost, 16, y+=tab);
    ctx.fillText("PLANETS LOST: " + gmap.planetsLost, 16, y+=tab);
};

