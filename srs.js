var srs = {
    canvas: undefined,
    context: undefined
};

/*************************************************/
srs.init = function() {
    srs.canvas = $("#srscanvas")[0];
    srs.context = srs.canvas.getContext("2d");

    jgl.newImage('./images/srs_bg.png', function(image) {
        srs.bg = image;
    });

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
};

/*************************************************/
srs.draw = function() {
    var ctx = srs.context;

    ctx.drawImage(srs.bg, 0, 0);

    ctx.fillStyle = "#FC0";
    ctx.font = "14px sans-serif";
    ctx.fillText("SHORT-RANGE SCAN", 8, 18);

    ctx.drawImage(srs.sunImg, 74, 100);
    ctx.drawImage(srs.planetImg, 164, 160);
    ctx.drawImage(srs.enemyImg, 100, 144);
    ctx.drawImage(srs.shipImg, 124, 124);
};

