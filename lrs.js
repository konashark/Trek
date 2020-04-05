var lrs = {
    canvas: undefined,
    context: undefined,
    CELL_WIDTH: 50,
    CELL_HEIGHT: 32,
    WIDTH: undefined,
    HEIGHT: undefined,
    mx: 0,      // Where on the map we've highlighted
    my: 0,
};

/*************************************************/
lrs.init = function() {
    lrs.WIDTH = lrs.CELL_WIDTH * gmap.SIZE + 100;
    lrs.HEIGHT = lrs.CELL_HEIGHT * gmap.SIZE + 100;

    lrs.canvas = $("#lrscanvas")[0];
    lrs.context = lrs.canvas.getContext("2d");

    jgl.newImage('./images/sun_icon.png', function(image) {
        lrs.sun_icon = image;
    });

    jgl.newImage('./images/planet_icon.png', function(image) {
        lrs.planet_icon = image;
    });

    jgl.newImage('./images/station_icon.png', function(image) {
        lrs.starbase_icon = image;
    });

    lrs.mx = gmap.currentSectorX;
    lrs.my = gmap.currentSectorY;

    document.addEventListener("keydown", function (ev) {
        console.log("event");
        if (g.mode & MODE.LRS) {
            if(ev.keyCode === jgl.KEYS.LEFT){
                if (lrs.mx) {
                    lrs.mx--;
                }
            }
            if(ev.keyCode === jgl.KEYS.UP){
                if (lrs.my) {
                    lrs.my--;
                }
            }
            if(ev.keyCode === jgl.KEYS.RIGHT){
                if (lrs.mx < (gmap.SIZE - 1)) {
                    lrs.mx++;
                }
            }
            if(ev.keyCode === jgl.KEYS.DOWN){
                if (lrs.my < (gmap.SIZE - 1)) {
                    lrs.my++;
                }
            }
        }
    });

};

/*************************************************/
lrs.draw = function() {
    var ctx = lrs.context;


    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,lrs.WIDTH,lrs.HEIGHT);
    ctx.strokeStyle = "#888";
    ctx.strokeRect(0,0,lrs.WIDTH,lrs.HEIGHT);

    ctx.strokeStyle = "#C80";
    ctx.fillStyle = "#FC0";
    ctx.font = "14px sans-serif";
    ctx.fillText("LONG-RANGE SCAN", 20, 20);
    ctx.font = "16px sans-serif";

    // Indicate which sector we're navigating to
    ctx.fillStyle = "#6af";
    ctx.fillRect(50 + (lrs.mx * lrs.CELL_WIDTH),
        50 + (lrs.my * lrs.CELL_HEIGHT),
        lrs.CELL_WIDTH,
        lrs.CELL_HEIGHT
    );

    // Indicate which sector we're currently in
    ctx.fillStyle = "#fff";
    ctx.fillRect(50 + (gmap.currentSectorX * lrs.CELL_WIDTH),
        50 + (gmap.currentSectorY * lrs.CELL_HEIGHT),
        lrs.CELL_WIDTH,
        lrs.CELL_HEIGHT
    );

    ctx.strokeStyle = "#248";
    for (var x = 0; x < gmap.SIZE; x++) {
        for (var y = 0; y < gmap.SIZE; y++) {
            var sector = gmap.data[x][y];
            ctx.strokeRect(50 + (x * lrs.CELL_WIDTH),
                50 + (y * lrs.CELL_HEIGHT),
                lrs.CELL_WIDTH,
                lrs.CELL_HEIGHT
            );
            if (sector.planet) {
                ctx.drawImage(lrs.planet_icon, 54 + (x * lrs.CELL_WIDTH), 56 + (y * lrs.CELL_HEIGHT));
            } else if (sector.sun) {
                ctx.drawImage(lrs.sun_icon, 54 + (x * lrs.CELL_WIDTH), 54 + (y * lrs.CELL_HEIGHT));
            } else if (sector.starbase) {
                ctx.drawImage(lrs.starbase_icon, 54 + (x * lrs.CELL_WIDTH), 56 + (y * lrs.CELL_HEIGHT));
            }
            if (sector.hostiles) {
                ctx.fillText(sector.hostiles, 82 + (x * lrs.CELL_WIDTH), 72 + (y * lrs.CELL_HEIGHT));
            }
        }
    }

    //ctx.drawImage(lrs.bg, 0, 0);

/*
    ctx.drawImage(srs.sunImg, 74, 100);
    ctx.drawImage(srs.planetImg, 164, 160);
    ctx.drawImage(srs.enemyImg, 100, 144);
    ctx.drawImage(srs.shipImg, 124, 124);
    */
};

