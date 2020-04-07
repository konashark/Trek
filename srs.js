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

    jgl.newImage('./images/marker_yellow.png', function(image) {
        gSrs.sunImg = image;
    });

    jgl.newImage('./images/marker_green.png', function(image) {
        gSrs.planetImg = image;
    });

    jgl.newImage('./images/marker_red.png', function(image) {
        gSrs.enemyImg = image;
    });
};

/*************************************************/
gSrs.draw = function() {
    var ctx = gSrs.context;

    ctx.drawImage(gSrs.bg, 0, 0);

    ctx.fillStyle = "#FC0";
    ctx.font = "15px sans-serif";
    ctx.fillText("SHORT-RANGE SCAN", 16, 18);

    ctx.drawImage(gSrs.sunImg, 74, 100);
    ctx.drawImage(gSrs.planetImg, 164, 160);
    ctx.drawImage(gSrs.enemyImg, 100, 144);
    ctx.drawImage(gSrs.shipImg, 124, 124);

//    context.font = "20px sans-serif";
//    context.fillStyle = "green";
    ctx.fillText("SECTOR: "+ gMap.currentSectorX +":"+gMap.currentSectorY, 16, 248);

};

