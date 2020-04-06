var shipstatus = {
    canvas: undefined,
    context: undefined,
    energy: 1000000,
    shields: 100,
    phasers: 100,
    torpedoes: (4 * 16),
    warpdrive: 100,
    numJumps: 0,
    computer: 100,
    lifesupport: 100,
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

    ctx.font = "15px sans-serif";
    ctx.fillStyle = "#FC0";
    ctx.fillText("STATUS", 16, 22);

    ctx.fillStyle = "white";
    ctx.fillText("MTIME: " + (g.missionTime/60).toFixed(0)+":"+g.missionTime%60, 128, 22);

    var y = 40, tab = 22;

    ctx.fillStyle = "#4488ff";
    ctx.fillText("ENERGY", 16, y+=tab);
    ctx.fillText("SHIELDS", 16, y+=tab);
    ctx.fillText("PHASERS", 16, y+=tab);
    ctx.fillText("TORP", 16, y+=tab);
    ctx.fillText("WARPDRV", 16, y+=tab);
    ctx.fillText("COMPUTER", 16, y+=tab);
    ctx.fillText("LIFESPRT", 16, y+=tab);
};

