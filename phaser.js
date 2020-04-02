var phaser = {
    active: false,
    offsetX: undefined,
    offsetY: undefined,
    image: undefined,
    pattern: undefined
};

/*************************************************/
phaser.init = function(context) {
    jgl.newImage('./images/phaser.png', function(image) {
        phaser.image = image;
    });

    $('#overlaycanvas').mousedown(phaser.fire);
    $('#overlaycanvas').mouseup(function() {
        phaser.active = false;
    })
};

/*************************************************/
phaser.fire = function(event) {
    phaser.active = true;
    phaser.offsetX = event.offsetX;
    phaser.offsetY = event.offsetY;
};

/*************************************************/
phaser.draw = function(context) {
    // Dependencies: ship, map
    if (phaser.active) {
        var x = map.CENTER_X + (Math.sin(ship.rotation * Math.PI/180) * 24);
        var y = map.CENTER_Y - (Math.cos(ship.rotation * Math.PI/180) * 24);

        if (!phaser.pattern) {
            phaser.pattern = context.createPattern(phaser.image, "repeat");
        }
        phaser.gradient = context.createLinearGradient(0, 0, jgl.randomRange(8,32), 0);
        phaser.gradient.addColorStop("0", "#000066");
        phaser.gradient.addColorStop("1" ,"#0000cc");

        context.strokeStyle = phaser.gradient; //"#eecc00";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(phaser.offsetX, phaser.offsetY);
        context.stroke();
    }
};

