var shields = {
    canvas: undefined,
    context: undefined,
    active: false,
//    image: undefined,
    gradient: undefined
};

/*************************************************/
shields.init = function() {
//    jgl.newImage('./images/shield.png', function(image) {
//        shields.image = image;
//    });

    var img = new Image(96, 96);
    shields.canvas = jgl.convertImageToCanvas(img);
    shields.context = shields.canvas.getContext("2d");
    shields.gradient = shields.context.createLinearGradient(0, 0, 10, 0);
    shields.gradient.addColorStop("0", "#000066");
    shields.gradient.addColorStop("1" ,"#0000cc");
};

/*************************************************/
shields.draw = function(context) {
    // Dependencies: ship
    if (shields.active){
        shields.context.clearRect(0,0,96,96);
        shields.context.strokeStyle = shields.gradient;
        shields.context.lineWidth = 3;
        shields.context.save();
        shields.context.translate(46 + jgl.random(3), 46 + jgl.random(3));
        shields.context.rotate((Math.random() * 360) * Math.PI / 180);
        shields.context.beginPath();
        shields.context.arc(0,0,45,0,2 * Math.PI);
        shields.context.stroke();

        context.drawImage(shields.canvas, sector.CENTER_X-48, sector.CENTER_Y-48);
        shields.context.restore();
    }
};
