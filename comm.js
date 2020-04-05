var comm = {
    canvas: undefined,
    context: undefined,
    WIDTH: 0,
    HEIGHT: 64
};

/*************************************************/
comm.init = function() {
    comm.canvas = $("#commcanvas")[0];
    comm.canvas.width = comm.WIDTH = window.innerWidth;
    comm.context = comm.canvas.getContext("2d");

    comm.draw();
};

/*************************************************/
comm.draw = function() {
    var ctx = comm.context;
    ctx.fillStyle = "#111";
    ctx.strokeStyle = "#888";
    ctx.fillRect(0,0,comm.WIDTH, comm.HEIGHT);
    ctx.strokeRect(0,0,comm.WIDTH, comm.HEIGHT);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#FC0";
    ctx.fillText("COMM", 8, 18);
};

