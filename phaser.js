var gPhaser = {
    active: false,
    offsetX: undefined,
    offsetY: undefined,
    sfx: undefined
};

/*************************************************/
gPhaser.init = function(context) {
    jgl.newImage('./images/phaser.png', function(image) {
        gPhaser.image = image;
    });

    gPhaser.sfx = new Audio('./sounds/phaser.mp3');

    $('#overlaycanvas').mousedown(gPhaser.fire);
    $('#overlaycanvas').mouseup(function() {
        gPhaser.sfx.pause();
        gPhaser.active = false;
    })
};

/*************************************************/
gPhaser.fire = function(event) {
    gPhaser.sfx.play();
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

        context.strokeStyle = jgl.rgbString(0,0,jgl.randomRange(160,220));
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(gPhaser.offsetX, gPhaser.offsetY);
        context.stroke();
    }
};

