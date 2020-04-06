var lrs = {
    canvas: undefined,
    context: undefined,
    CELL_WIDTH: 50,
    CELL_HEIGHT: 32,
    WIDTH: undefined,
    HEIGHT: undefined,
    mx: 0,      // Where on the map we've highlighted
    my: 0,
    distance: 0
};

/*************************************************/
lrs.init = function() {
    lrs.WIDTH = lrs.CELL_WIDTH * gmap.SIZE + 100;
    lrs.HEIGHT = lrs.CELL_HEIGHT * gmap.SIZE + 100;

    var offset = ($("#mapcanvas").width() - lrs.WIDTH) / 2;
    $("#lrscanvas").css("left", offset );

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

            if (ev.keyCode === jgl.KEYS.H || ev.keyCode === jgl.KEYS.ENTER) {
                if (ship.jumping) {
                    console.log("TBD: Already jumping");
                    return;
                }
                if (!lrs.distance) {
                    console.log("TBD: No destination");
                    return;
                }

                var energyNeeded = lrs.distance * 10000;
                if (shipstatus.energy < energyNeeded) {
                    console.log("Not enough energy");
                    return;
                }

                if (!shipstatus.warpdrive) {
                    console.log("Warp drive off-line");
                    return;
                }

                ship.jumping = true;
                shipstatus.energy -= energyNeeded;
                shipstatus.warpdrive -= 1;
                shipstatus.numJumps++;

                g.mode &= (~MODE.LRS);
                $("#lrscanvas").css('display','none');


                $(".hyperjump").css("width", $("#viewscreen")[0].width+"px");
                $(".hyperjump").css("height", $("#viewscreen")[0].height+"px");
                $('.hyperjump').css('display','block');
                gmap.currentSectorX = lrs.mx;
                gmap.currentSectorY = lrs.my;

                setTimeout(function () {
                    $('.hyperjump').css('display', 'none');
                    ship.jumping = false;
                    sector.initSector(gmap.data[gmap.currentSectorX][gmap.currentSectorY]);
                    sector.mapX--; // trigger a redraw
                    sector.mapY++; // trigger a redraw
                    ship.thrust = 0;
                    ship.targetThrust = 10;
                }, 11000);
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

    ctx.fillStyle = "#080808";
    ctx.fillRect(50,50,lrs.WIDTH-50,lrs.HEIGHT-50);
    ctx.strokeStyle = "#888";
    ctx.strokeRect(0,0,lrs.WIDTH,lrs.HEIGHT);

    ctx.strokeStyle = "#C80";
    ctx.fillStyle = "#FC0";
    ctx.font = "15px sans-serif";
    ctx.fillText("LONG-RANGE NAVIGATION", 50, 20);
    ctx.font = "16px sans-serif";

    // Indicate which sector we're navigating to
    ctx.strokeStyle = "#6af";
    ctx.lineWidth = 4;
    ctx.strokeRect(50 + (lrs.mx * lrs.CELL_WIDTH),
        50 + (lrs.my * lrs.CELL_HEIGHT),
        lrs.CELL_WIDTH,
        lrs.CELL_HEIGHT
    );
    ctx.lineWidth = 1;

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
            // Does this sector have a conflict?
            if (sector.hostiles && (sector.starbase || sector.planet)) {
                sector.conflict = true;
                ctx.fillStyle = "#811";
                ctx.fillRect(50 + (x * lrs.CELL_WIDTH),
                    50 + (y * lrs.CELL_HEIGHT),
                    lrs.CELL_WIDTH,
                    lrs.CELL_HEIGHT
                );
            } else {
                sector.conflict = false;
            }

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
                ctx.fillStyle = "white";
                ctx.fillText(sector.hostiles, 82 + (x * lrs.CELL_WIDTH), 72 + (y * lrs.CELL_HEIGHT));
            }
        }
    }

    // Update header - show hyperjump distance
    lrs.distance = jgl.distance(gmap.currentSectorX, gmap.currentSectorY, lrs.mx, lrs.my).toFixed(2);
    ctx.fillText("DIST: " + lrs.distance, 320, 20);
    ctx.fillText("ENERGY REQUIRED: " + ~~(lrs.distance * 10000), 450, 20);

};

