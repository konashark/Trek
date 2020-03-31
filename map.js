var map = {

//var g = g || {};
//g = Object.assign(g, {
    CANVAS_W: 960,
    CANVAS_H: 448,
    FIRING_SPEED: 6,       // How often we can fire (in frames)
    MAX_SPEED: 4.0,      // Maximum speed of our ship (in pixels per frame)
    MAX_THRUST: 10.0,      // Maximum speed of our ship (in pixels per frame)
    MAP_ROWS: 256,
    MAP_COLS: 256,
    MAP_WIDTH_PIXELS: 256 * 64,
    MAP_HEIGHT_PIXELS: 256 * 64,
    TILE_SIZE: 64,
    mapX: 0, mapY: 0,
    img: [],
    canvas: null,
    context: null,
    tmap: null,

    ship: {
        sprite: undefined,
        x: 10480, y: 10228,
        speedX: 0, speedY: 0,
        thrust: 0,
        viewportX: 480, viewportY: 228,
        targetRotation: 0,
        rotation: 0,
        rotationSpeed: 0,
        radians: 0,
        allstop: false
    },

    bop: {
        sprite: undefined
    }
};

/*************************************************/
map.init = function() {
    map.mapcanvas = document.getElementById("mapcanvas");
    map.mapcontext = map.mapcanvas.getContext("2d");
    map.mapcontext.fillStyle = "#eeeeff";

    map.overlaycanvas = document.getElementById("overlaycanvas");
    map.overlaycontext = map.overlaycanvas.getContext("2d");
    map.overlaycontext.fillStyle = "#eeeeff";

    console.log("Creating new map...");
    map.tmap = jgl.newTileMapCanvas({ context: map.mapcontext, x:0, y:0, w:(15*64), h:(7*64) });

    console.log("Creating tiles...");

    mapData = [];
    for (var y = 0; y < 256; y++) {
        mapData[y] = [];
        for (var x = 0; x < 256; x++) {
            mapData[y][x] = jgl.random(100);
        }
    }
    map.tmap.attachMap({ numColumns: map.MAP_COLS, numRows: map.MAP_ROWS, tileWidth: map.TILE_SIZE, tileHeight: map.TILE_SIZE, mapData:mapData});

    map.tmap.setPositionOffset(256, 128); // center of map is positioning hot spot

    var makeStar = function(blank) {
        var image = new Image(map.TILE_SIZE, map.TILE_SIZE);
        var canvas = jgl.convertImageToCanvas(image);
        var context = canvas.getContext("2d");
        context.fillStyle = "#000000";
        context.fillRect(0,0,map.TILE_SIZE,map.TILE_SIZE);
        if (!blank) {
            var numStars = jgl.randomRange(4,10);
            for (var star = 0; star < numStars; star++) {
                var luminance = jgl.randomRange(48, 255);
                var size = jgl.randomRange(1, 3);
                context.fillStyle = 'rgb(' + luminance + ',' + luminance + ',' + luminance + ')';
                context.fillRect(jgl.random(64), jgl.random(64), size, size);
            }
        }
        context.strokeStyle = "#00aa00";
        context.beginPath();
        context.moveTo(0,map.TILE_SIZE-1);
        context.lineTo(0,0);
        context.lineTo(map.TILE_SIZE-1,0);
        context.stroke();

        return canvas;
    };

    var image = new Image(map.TILE_SIZE, map.TILE_SIZE);
    var canvas = jgl.convertImageToCanvas(image);
    var context = canvas.getContext("2d");
    context.fillStyle = "#000033";
    context.fillRect(0,0,map.TILE_SIZE,map.TILE_SIZE);

    map.tmap.setDefaultTile({ img: canvas, x:0, y:0, w:map.TILE_SIZE, h:map.TILE_SIZE });
    for (var index = 0; index < 100; index++) {
        map.tmap.newTile({ index:index, img: makeStar(), x:0, y:0, w:map.TILE_SIZE, h:map.TILE_SIZE });
    }


    map.spriteList = jgl.newSpriteList();

    map.ship.sprite = map.spriteList.newSprite({id: 'ship', width: map.TILE_SIZE, height: map.TILE_SIZE, image: './images/enterprise_sprite.png'});
    map.ship.sprite.setPosition(map.ship.viewportX, map.ship.viewportY);
    map.ship.sprite.setRotation(map.ship.rotation);
    map.ship.sprite.setHotSpot(map.TILE_SIZE / 2, map.TILE_SIZE / 2);

    map.bop.sprite = map.spriteList.newSprite({id: 'bop', width: map.TILE_SIZE, height: map.TILE_SIZE, image: './images/klingon_sprite2.png'});
    map.bop.sprite.setPosition(750,180);
    map.bop.sprite.setRotation(230);
    map.bop.sprite.setHotSpot(map.TILE_SIZE / 2, map.TILE_SIZE / 2);

};

/*************************************************/
map.draw = function() {
    map.updateShip();

    map.tmap.drawMap(map.mapX, map.mapY);

    map.overlaycontext.clearRect(0,0, map.CANVAS_W, map.CANVAS_H);
    map.spriteList.drawSprites(map.overlaycontext);

    map.updateHelm();
};

/*************************************************/
map.updateShip = function() {

    if (jgl.KEY_STATE[jgl.KEYS.FORWARD_SLASH]){
        map.ship.allstop = true;
    }

    // Is the player rotating?
    if (jgl.KEY_STATE[jgl.KEYS.LEFT]){
        map.ship.targetRotation -= 3;
        if (map.ship.targetRotation < 0) {
            map.ship.targetRotation += 360;
        }
    }

    if (jgl.KEY_STATE[jgl.KEYS.RIGHT]){
        map.ship.targetRotation += 3;
        if (map.ship.targetRotation > 360) {
            map.ship.targetRotation -= 360;
        }
    }

    // Update rotation and convert to radians
    var delta = map.ship.targetRotation - map.ship.rotation;

    if (delta) {
        if (delta  > 180) {
            map.ship.rotation -= 1;
        } else if (delta < -180) {
            map.ship.rotation += 1;
        } else if (delta > 0)  {
            map.ship.rotation += 1;
        } else {
            map.ship.rotation -= 1;
        }

        if (map.ship.rotation < 0) {
            map.ship.rotation += 360;
        }
        if (map.ship.rotation > 360) {
            map.ship.rotation -= 360;
        }
    }
    map.ship.radians = map.ship.rotation * Math.PI/180;

    if (map.ship.allstop) {
        map.ship.thrust *= .95;
        if (map.ship.thrust < .1) {
            map.ship.thrust = 0;
            map.ship.allstop = false;
        }
    }
    // Is the player accelerating?
    if (jgl.KEY_STATE[jgl.KEYS.UP]) {
        map.ship.allstop = false;
        if (map.ship.thrust < map.MAX_THRUST) {
            map.ship.thrust += 0.1;
        }
    }

    if (jgl.KEY_STATE[jgl.KEYS.DOWN]) {
        map.ship.thrust -= 0.1;
        if (map.ship.thrust < .1) {
            map.ship.thrust = 0;
            map.ship.allstop = false;
        }
    }

    map.ship.thrustX = (Math.sin(map.ship.radians) / 4) * map.ship.thrust;
    map.ship.thrustY = (Math.cos(map.ship.radians) / 4) * map.ship.thrust;

    // Update our ship's position
    map.ship.x += map.ship.thrustX;
    map.ship.y -= map.ship.thrustY;

    // Keep us within the map's universe
    if (map.ship.y > map.MAP_HEIGHT_PIXELS + (map.TILE_SIZE * 1.5)) {
        map.ship.y = map.MAP_HEIGHT_PIXELS + (map.TILE_SIZE * 1.5);
    } else if (map.ship.y < (map.TILE_SIZE * 2.5)) {
        map.ship.y = map.TILE_SIZE * 2.5;
    }
    if (map.ship.x > map.MAP_WIDTH_PIXELS + (map.TILE_SIZE * 3)) {
        map.ship.x = map.MAP_WIDTH_PIXELS + (map.TILE_SIZE * 3);
    } else if (map.ship.x < (map.TILE_SIZE * 4)) {
        map.ship.x = map.TILE_SIZE * 4;
    }

    //map.ship.sprite.setPosition(map.ship.x, map.ship.y);
    map.mapX = map.ship.x - 448;
    map.mapY = map.ship.y - 228;
    map.ship.sprite.setRotation(map.ship.rotation);

};

/*************************************************/
map.updateHelm = function () {
    map.overlaycontext.font = "20px sans-serif";
    map.overlaycontext.fillStyle = "green";
    var x = 32;
    var y = 436;
    var tab = 128;
    map.overlaycontext.fillText("X:"+ map.ship.x.toFixed(2), x, y);
    map.overlaycontext.fillText("Y:"+ map.ship.y.toFixed(2), x+=tab, y);
    map.overlaycontext.fillText("dX:"+ map.ship.speedX.toFixed(2), x+=tab, y);
    map.overlaycontext.fillText("dY:"+ map.ship.speedY.toFixed(2), x+=tab, y);
    map.overlaycontext.fillText("Rot:"+ map.ship.rotation.toFixed(2), x+=tab, y);
};
