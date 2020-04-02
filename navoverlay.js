var navOv = {
    canvas: undefined,
    context: undefined,
    active: false
};

/*************************************************/
navOv.init = function() {
    // Create NAV overlay
    var navImg = new Image(128, 128);
    navOv.canvas = jgl.convertImageToCanvas(navImg);
    navOv.context = navOv.canvas.getContext("2d");
};

/*************************************************/
navOv.draw = function(context) {
    // Update Nav Overlay
    // Dependencies: ship
    if (navOv.active){
        var x = (Math.sin(ship.targetRotation * Math.PI/180) * 64);
        var y = (Math.cos(ship.targetRotation * Math.PI/180) * 64);

        navOv.context.clearRect(0,0,128,128);
        navOv.context.strokeStyle = "#eecc00";
        navOv.context.beginPath();
        navOv.context.moveTo(64,64);
        navOv.context.lineTo(64+x, 64-y);
        navOv.context.stroke();

        context.drawImage(navOv.canvas, map.CENTER_X-64, map.CENTER_Y-64);
    }
};


