var gPhaser = {
    active: false,
    offsetX: undefined,
    offsetY: undefined,
    image: undefined,
    pattern: undefined
};

/*************************************************/
gPhaser.init = function(context) {
    jgl.newImage('./images/phaser.png', function(image) {
        gPhaser.image = image;
    });

    $('#overlaycanvas').mousedown(gPhaser.fire);
    $('#overlaycanvas').mouseup(function() {
        gPhaser.active = false;
    })
};

/*************************************************/
gPhaser.fire = function(event) {
    gPhaser.active = true;
    gPhaser.offsetX = event.offsetX;
    gPhaser.offsetY = event.offsetY;
};

/*************************************************/
gPhaser.draw = function(context) {
    // Dependencies: ship, map
    if (gPhaser.active) {
        var x = gSector.CENTER_X + (Math.sin(gShip.rotation * Math.PI/180) * 24);
        var y = gSector.CENTER_Y - (Math.cos(gShip.rotation * Math.PI/180) * 24);

        if (!gPhaser.pattern) {
            gPhaser.pattern = context.createPattern(gPhaser.image, "repeat");
        }
        gPhaser.gradient = context.createLinearGradient(0, 0, jgl.randomRange(8,32), 0);
        gPhaser.gradient.addColorStop("0", "#000066");
        gPhaser.gradient.addColorStop("1" ,"#0000cc");

        context.strokeStyle = gPhaser.gradient; //"#eecc00";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(gPhaser.offsetX, gPhaser.offsetY);
        context.stroke();
    }
};

