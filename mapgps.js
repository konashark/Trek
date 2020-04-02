var mapgps = {};

/*************************************************/
mapgps.update = function (context) {
    context.font = "20px sans-serif";
    context.fillStyle = "green";
    var x = 32;
    var y = map.MAP_VIEWPORT_HEIGHT_PIXELS - 15;
    var tab = 140;
    var smtab = 90;
    context.fillText("Sector:"+ map.sectorX +","+map.sectorY, x, y);
    context.fillText("X:"+ ship.x.toFixed(2), x+=tab+=20, y);
    context.fillText("Y:"+ ship.y.toFixed(2), x+=tab, y);
    context.fillText("Vel:"+ ship.thrust.toFixed(2), x+=tab, y);
    context.fillText("Head:"+ ship.rotation.toFixed(2), x+=tab, y);
};
