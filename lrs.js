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
    lrs.WIDTH = lrs.CELL_WIDTH * map.SIZE + 100;
    lrs.HEIGHT = lrs.CELL_HEIGHT * map.SIZE + 100;

    lrs.canvas = $("#lrscanvas")[0];
    lrs.context = lrs.canvas.getContext("2d");

    jgl.newImage('./images/sun_icon.png', function(image) {
        lrs.sun_icon = image;
    });
/*
    jgl.newImage('./images/marker_white.png', function(image) {
        srs.shipImg = image;
    });

    jgl.newImage('./images/marker_yellow.png', function(image) {
        srs.sunImg = image;
    });

    jgl.newImage('./images/marker_green.png', function(image) {
        srs.planetImg = image;
    });

    jgl.newImage('./images/marker_red.png', function(image) {
        srs.enemyImg = image;
    });
*/
    lrs.mx = map.currentSectorX;
    lrs.my = map.currentSectorY;

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
                if (lrs.mx < (map.SIZE - 1)) {
                    lrs.mx++;
                }
            }
            if(ev.keyCode === jgl.KEYS.DOWN){
                if (lrs.my < (map.SIZE - 1)) {
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

    // Indicate which sector we're navigating to
    ctx.fillStyle = "#999";
    ctx.fillRect(50 + (lrs.mx * lrs.CELL_WIDTH),
        50 + (lrs.my * lrs.CELL_HEIGHT),
        lrs.CELL_WIDTH,
        lrs.CELL_HEIGHT
    );

    // Indicate which sector we're currently in
    ctx.fillStyle = "#fff";
    ctx.fillRect(50 + (map.currentSectorX * lrs.CELL_WIDTH),
        50 + (map.currentSectorY * lrs.CELL_HEIGHT),
        lrs.CELL_WIDTH,
        lrs.CELL_HEIGHT
    );

    ctx.strokeStyle = "#248";
    for (var x = 0; x < map.SIZE; x++) {
        for (var y = 0; y < map.SIZE; y++) {
            var sector = map.data[x][y];
            ctx.strokeRect(50 + (x * lrs.CELL_WIDTH),
                50 + (y * lrs.CELL_HEIGHT),
                lrs.CELL_WIDTH,
                lrs.CELL_HEIGHT
            );
            if (sector && sector.sun) {
                ctx.drawImage(lrs.sun_icon, 60 + (x * lrs.CELL_WIDTH), 54 + (y * lrs.CELL_HEIGHT));
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

