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
    ctx.fillRect(0,0,260,312);

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(0,0,260,312);

    ctx.fillStyle = "#FC0";
    ctx.font = "14px sans-serif";
    ctx.fillText("STATUS", 8, 16);

};

