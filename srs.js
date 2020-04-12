var gSrs = {
    canvas: undefined,
    context: undefined
};

/*************************************************/
gSrs.init = function() {
    gSrs.canvas = $("#srscanvas")[0];
    gSrs.context = gSrs.canvas.getContext("2d");

    jgl.newImage('./images/srs_bg.png', function(image) {
        gSrs.bg = image;
    });

    jgl.newImage('./images/marker_white.png', function(image) {
        gSrs.shipImg = image;
    });
/*
    jgl.newImage('./images/marker_yellow.png', function(image) {
        gSrs.sunImg = image;
    });

    jgl.newImage('./images/marker_green.png', function(image) {
        gSrs.planetImg = image;
    });
*/
    jgl.newImage('./images/marker_red.png', function(image) {
        gSrs.enemyImg = image;
    });

    jgl.newImage('./images/sun_icon.png', function(image) {
        gSrs.sunImg = image;
    });

    jgl.newImage('./images/planet_icon.png', function(image) {
        gSrs.planetImg = image;
    });

    jgl.newImage('./images/station_icon.png', function(image) {
        gSrs.starbaseImg = image;
    });
};

/*************************************************/
gSrs.draw = function() {

    var sector = gMap.data[gMap.currentSectorX][gMap.currentSectorY];

    var ctx = gSrs.context;

    ctx.drawImage(gSrs.bg, 0, 0);

    if (sector.planet) {
        ctx.drawImage(gSrs.planetImg, sector.planet.tileCol - 10, sector.planet.tileRow - 10);
    }

    if (sector.sun) {
        ctx.drawImage(gSrs.sunImg, sector.sun.tileCol - 10, sector.sun.tileRow - 10);
    }

    if (sector.starbase) {
        ctx.drawImage(gSrs.starbaseImg, sector.starbase.tileCol - 10, sector.starbase.tileRow - 10);
    }

    if (sector.hostiles) {
        sector.hostiles.forEach(function(ag,i) {
            ag.ships.forEach(function(ship,i) {
                ctx.drawImage(gSrs.enemyImg, ship.x / 128 - 4, ship.y / 128 - 4);
            });
        });
    }

    ctx.drawImage(gSrs.shipImg, gShip.x / 128 - 4, gShip.y / 128 - 4);

    ctx.fillStyle = "#FC0";
    ctx.font = "15px sans-serif";
    ctx.fillText("SHORT-RANGE SCAN", 16, 18);
    ctx.fillText("SECTOR: "+ gMap.currentSectorX +":"+gMap.currentSectorY, 16, 248);
};

