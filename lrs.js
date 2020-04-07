var gLrs = {
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
gLrs.init = function() {
    // How big to make the canvas
    gLrs.WIDTH = gLrs.CELL_WIDTH * gMap.PARSEC_DIM + 100;
    gLrs.HEIGHT = gLrs.CELL_HEIGHT * gMap.PARSEC_DIM + 100;

    var offset = ($("#mapcanvas").width() - gLrs.WIDTH) / 2;
    $("#lrscanvas").css("left", offset );

    gLrs.canvas = $("#lrscanvas")[0];
    gLrs.context = gLrs.canvas.getContext("2d");

    jgl.newImage('./images/sun_icon.png', function(image) {
        gLrs.sun_icon = image;
    });

    jgl.newImage('./images/planet_icon.png', function(image) {
        gLrs.planet_icon = image;
    });

    jgl.newImage('./images/station_icon.png', function(image) {
        gLrs.starbase_icon = image;
    });

    gLrs.mx = gMap.currentSectorX;
    gLrs.my = gMap.currentSectorY;

    document.addEventListener("keydown", function (ev) {
        console.log("event");
        if (g.mode & MODE.LRS) {
            if(ev.keyCode === jgl.KEYS.LEFT){
                if (gLrs.mx) {
                    gLrs.mx--;
                }
            }
            if(ev.keyCode === jgl.KEYS.UP){
                if (gLrs.my) {
                    gLrs.my--;
                }
            }
            if(ev.keyCode === jgl.KEYS.RIGHT){
                if (gLrs.mx < (gMap.PARSEC_DIM - 1)) {
                    gLrs.mx++;
                }
            }
            if(ev.keyCode === jgl.KEYS.DOWN){
                if (gLrs.my < (gMap.PARSEC_DIM - 1)) {
                    gLrs.my++;
                }
            }

            if (ev.keyCode === jgl.KEYS.H || ev.keyCode === jgl.KEYS.ENTER) {

                if (gShip.jumping) {
                    console.log("TBD: Already jumping");
                    return;
                }

                if (gLrs.distance < 1) {
                    console.log("TBD: No destination");
                    return;
                }

                var energyNeeded = gLrs.distance * 10000;
                if (gShipstatus.systems[gShipstatus.ENERGY].level < energyNeeded) {
                    console.log("Not enough energy");
                    return;
                }

                if (!gShipstatus.systems[gShipstatus.WARPDRIVE].level) {
                    console.log("Warp drive off-line");
                    return;
                }

                gShip.jumping = true;
                gShipstatus.systems[gShipstatus.ENERGY].level -= energyNeeded;
                gShipstatus.systems[gShipstatus.WARPDRIVE].level -= 1;
                gShipstatus.numJumps++;

                g.mode &= (~MODE.LRS);
                $("#lrscanvas").css('display','none');


                $(".hyperjump").css("width", $("#viewscreen")[0].width+"px");
                $(".hyperjump").css("height", $("#viewscreen")[0].height+"px");
                $('.hyperjump').css('display','block');
                gMap.currentSectorX = gLrs.mx;
                gMap.currentSectorY = gLrs.my;

                setTimeout(function () {
                    gSector.initSector(gMap.data[gMap.currentSectorX][gMap.currentSectorY]);
                    gShip.thrust = 0;
                    gShip.targetThrust = 5;
                    setTimeout(function () {
                        $('.hyperjump').css('display', 'none');
                        gShip.jumping = false;
                    }, 2000);
                }, 2000);
            }
        }
    });

};

/*************************************************/
gLrs.draw = function() {
    var ctx = gLrs.context;


    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,gLrs.WIDTH,gLrs.HEIGHT);
    ctx.strokeStyle = "#888";
    ctx.strokeRect(0,0,gLrs.WIDTH,gLrs.HEIGHT);

    ctx.fillStyle = "#080808";
    ctx.fillRect(50,50,gLrs.WIDTH-50,gLrs.HEIGHT-50);
    ctx.strokeStyle = "#888";
    ctx.strokeRect(0,0,gLrs.WIDTH,gLrs.HEIGHT);

    ctx.strokeStyle = "#C80";
    ctx.fillStyle = "#FC0";
    ctx.font = "15px sans-serif";
    ctx.fillText("LONG-RANGE NAVIGATION", 50, 20);
    ctx.font = "16px sans-serif";

    // Indicate which sector we're navigating to
    ctx.strokeStyle = "#6af";
    ctx.lineWidth = 4;
    ctx.strokeRect(50 + (gLrs.mx * gLrs.CELL_WIDTH),
        50 + (gLrs.my * gLrs.CELL_HEIGHT),
        gLrs.CELL_WIDTH,
        gLrs.CELL_HEIGHT
    );
    ctx.lineWidth = 1;

    // Indicate which sector we're currently in
    ctx.fillStyle = "#fff";
    ctx.fillRect(50 + (gMap.currentSectorX * gLrs.CELL_WIDTH),
        50 + (gMap.currentSectorY * gLrs.CELL_HEIGHT),
        gLrs.CELL_WIDTH,
        gLrs.CELL_HEIGHT
    );

    ctx.strokeStyle = "#248";
    for (var x = 0; x < gMap.PARSEC_DIM; x++) {
        for (var y = 0; y < gMap.PARSEC_DIM; y++) {
            var sector = gMap.data[x][y];
            // Does this sector have a conflict?
            if (sector.hostiles && (sector.starbase || sector.planet)) {
                sector.conflict = true;
                ctx.fillStyle = "#811";
                ctx.fillRect(50 + (x * gLrs.CELL_WIDTH),
                    50 + (y * gLrs.CELL_HEIGHT),
                    gLrs.CELL_WIDTH,
                    gLrs.CELL_HEIGHT
                );
            } else {
                sector.conflict = false;
            }

            ctx.strokeRect(50 + (x * gLrs.CELL_WIDTH),
                50 + (y * gLrs.CELL_HEIGHT),
                gLrs.CELL_WIDTH,
                gLrs.CELL_HEIGHT
            );
            if (sector.planet) {
                ctx.drawImage(gLrs.planet_icon, 54 + (x * gLrs.CELL_WIDTH), 56 + (y * gLrs.CELL_HEIGHT));
            } else if (sector.sun) {
                ctx.drawImage(gLrs.sun_icon, 54 + (x * gLrs.CELL_WIDTH), 54 + (y * gLrs.CELL_HEIGHT));
            } else if (sector.starbase) {
                ctx.drawImage(gLrs.starbase_icon, 54 + (x * gLrs.CELL_WIDTH), 56 + (y * gLrs.CELL_HEIGHT));
            }
            if (sector.hostiles) {
                ctx.fillStyle = "white";
                ctx.fillText(sector.hostiles, 82 + (x * gLrs.CELL_WIDTH), 72 + (y * gLrs.CELL_HEIGHT));
            }
        }
    }

    // Update header - show hyperjump distance
    gLrs.distance = jgl.distance(gMap.currentSectorX, gMap.currentSectorY, gLrs.mx, gLrs.my).toFixed(2);
    ctx.fillText("DIST: " + gLrs.distance, 320, 20);
    ctx.fillText("ENERGY REQUIRED: " + ~~(gLrs.distance * 10000), 450, 20);

};

