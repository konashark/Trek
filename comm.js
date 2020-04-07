var gComm = {
    canvas: undefined,
    context: undefined,
    WIDTH: 0,
    HEIGHT: 64
};

/*************************************************/
gComm.init = function() {
    gComm.canvas = $("#commcanvas")[0];
    gComm.canvas.width = gComm.WIDTH = window.innerWidth;
    gComm.context = gComm.canvas.getContext("2d");

    gComm.draw();
};

/*************************************************/
gComm.draw = function() {
    var ctx = gComm.context;
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#888";
    ctx.fillRect(0,0,gComm.WIDTH, gComm.HEIGHT);
    ctx.strokeRect(0,0,gComm.WIDTH, gComm.HEIGHT);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#FC0";
    ctx.fillText("COMM", 8, 18);
};

