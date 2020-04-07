var gShields = {
    canvas: undefined,
    context: undefined,
    active: false,
//    image: undefined,
    gradient: undefined
};

/*************************************************/
gShields.init = function() {
//    jgl.newImage('./images/shield.png', function(image) {
//        gShields.image = image;
//    });

    var img = new Image(96, 96);
    gShields.canvas = jgl.convertImageToCanvas(img);
    gShields.context = gShields.canvas.getContext("2d");
    gShields.gradient = gShields.context.createLinearGradient(0, 0, 10, 0);
    gShields.gradient.addColorStop("0", "#000066");
    gShields.gradient.addColorStop("1" ,"#0000cc");
};

/*************************************************/
gShields.draw = function(context) {
    // Dependencies: ship
    if (gShields.active){
        gShields.context.clearRect(0,0,96,96);
        gShields.context.strokeStyle = gShields.gradient;
        gShields.context.lineWidth = 3;
        gShields.context.save();
        gShields.context.translate(46 + jgl.random(3), 46 + jgl.random(3));
        gShields.context.rotate((Math.random() * 360) * Math.PI / 180);
        gShields.context.beginPath();
        gShields.context.arc(0,0,45,0,2 * Math.PI);
        gShields.context.stroke();

        context.drawImage(gShields.canvas, gSector.CENTER_X-48, gSector.CENTER_Y-48);
        gShields.context.restore();
    }
};
