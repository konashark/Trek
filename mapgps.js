var mapgps = {};

/*************************************************/
mapgps.update = function (context) {
    context.font = "20px sans-serif";
    context.fillStyle = "green";
    var x = 32;
    var y = 436;
    var tab = 128;
    context.fillText("X:"+ ship.x.toFixed(2), x, y);
    context.fillText("Y:"+ ship.y.toFixed(2), x+=tab, y);
    context.fillText("V:"+ ship.thrust.toFixed(2), x+=tab, y);
    context.fillText("Rot:"+ ship.rotation.toFixed(2), x+=tab, y);
};
