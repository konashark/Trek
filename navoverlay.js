var gNavOvly = {
    canvas: undefined,
    context: undefined,
    active: false
};

/*************************************************/
gNavOvly.init = function() {
    // Create NAV overlay
    var navImg = new Image(128, 128);
    gNavOvly.canvas = jgl.convertImageToCanvas(navImg);
    gNavOvly.context = gNavOvly.canvas.getContext("2d");
};

/*************************************************/
gNavOvly.draw = function(context) {
    // Update Nav Overlay
    // Dependencies: ship
    if (gNavOvly.active){
        var x = (Math.sin(gShip.targetRotation * Math.PI/180) * 64);
        var y = (Math.cos(gShip.targetRotation * Math.PI/180) * 64);

        gNavOvly.context.clearRect(0,0,128,128);
        gNavOvly.context.strokeStyle = "#eecc00";
        gNavOvly.context.beginPath();
        gNavOvly.context.moveTo(64,64);
        gNavOvly.context.lineTo(64+x, 64-y);
        gNavOvly.context.stroke();

        context.drawImage(gNavOvly.canvas, gSector.CENTER_X-64, gSector.CENTER_Y-64);
    }
};


