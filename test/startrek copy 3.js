window.addEventListener("load", jglApp, false);

var jgl = null;
var g = {
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
    keyState: [],
    KEY: { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40 },
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

function jglApp() {
    g.mapcanvas = document.getElementById("mapcanvas");
    g.mapcontext = g.mapcanvas.getContext("2d");
    g.mapcontext.fillStyle = "#eeeeff";

    g.overlaycanvas = document.getElementById("overlaycanvas");
    g.overlaycontext = g.overlaycanvas.getContext("2d");
    g.overlaycontext.fillStyle = "#eeeeff";

    jgl = new Jgl;

    console.log("Creating new map...");
    g.tmap = jgl.newTileMapCanvas({ context: g.mapcontext, x:0, y:0, w:(15*64), h:(7*64) });

    console.log("Creating tiles...");

    mapData = [];
    for (var y = 0; y < 256; y++) {
        mapData[y] = [];
        for (var x = 0; x < 256; x++) {
            mapData[y][x] = jgl.random(100);
        }
    }
    g.tmap.attachMap({ numColumns: g.MAP_COLS, numRows: g.MAP_ROWS, tileWidth: g.TILE_SIZE, tileHeight: g.TILE_SIZE, mapData:mapData});

    g.tmap.setPositionOffset(256, 128); // center of map is positioning hot spot

    var makeStar = function(blank) {
        var image = new Image(g.TILE_SIZE, g.TILE_SIZE);
        var canvas = jgl.convertImageToCanvas(image);
        var context = canvas.getContext("2d");
        context.fillStyle = "#000000";
        context.fillRect(0,0,g.TILE_SIZE,g.TILE_SIZE);
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
        context.moveTo(0,g.TILE_SIZE-1);
        context.lineTo(0,0);
        context.lineTo(g.TILE_SIZE-1,0);
        context.stroke();

        return canvas;
    };

    var image = new Image(g.TILE_SIZE, g.TILE_SIZE);
    var canvas = jgl.convertImageToCanvas(image);
    var context = canvas.getContext("2d");
    context.fillStyle = "#000033";
    context.fillRect(0,0,g.TILE_SIZE,g.TILE_SIZE);

    g.tmap.setDefaultTile({ img: canvas, x:0, y:0, w:g.TILE_SIZE, h:g.TILE_SIZE });
    for (var index = 0; index < 100; index++) {
        g.tmap.newTile({ index:index, img: makeStar(), x:0, y:0, w:g.TILE_SIZE, h:g.TILE_SIZE });
    }


    g.spriteList = jgl.newSpriteList();

    g.ship.sprite = g.spriteList.newSprite({id: 'ship', width: g.TILE_SIZE, height: g.TILE_SIZE, image: './images/enterprise_sprite.png'});
    g.ship.sprite.setPosition(g.ship.viewportX, g.ship.viewportY);
    g.ship.sprite.setRotation(g.ship.rotation);
    g.ship.sprite.setHotSpot(g.TILE_SIZE / 2, g.TILE_SIZE / 2);

    g.bop.sprite = g.spriteList.newSprite({id: 'bop', width: g.TILE_SIZE, height: g.TILE_SIZE, image: './images/klingon_sprite2.png'});
    g.bop.sprite.setPosition(750,180);
    g.bop.sprite.setRotation(230);
    g.bop.sprite.setHotSpot(g.TILE_SIZE / 2, g.TILE_SIZE / 2);

    gameLoop();
}

/*************************************************/
function gameLoop()
{
    updateShip();

    g.tmap.drawMap(g.mapX, g.mapY);

    g.overlaycontext.clearRect(0,0, g.CANVAS_W, g.CANVAS_H);
    g.spriteList.drawSprites(g.overlaycontext);

    updateHelm();

    window.requestAnimFrame(gameLoop);
}

/*************************************************/
function updateShip() {

    if (jgl.KEY_STATE[jgl.KEYS.FORWARD_SLASH]){
        g.ship.allstop = true;
    }

    // Is the player rotating?
    if (jgl.KEY_STATE[jgl.KEYS.LEFT]){
        g.ship.targetRotation -= 6;
        if (g.ship.targetRotation < 0) {
            g.ship.targetRotation += 360;
        }
    }

    if (jgl.KEY_STATE[jgl.KEYS.RIGHT]){
        g.ship.targetRotation += 6;
        if (g.ship.targetRotation > 360) {
            g.ship.targetRotation -= 360;
        }
    }

    // Update rotation and convert to radians
    var delta = g.ship.targetRotation - g.ship.rotation;

    if (delta) {
        if (delta  > 180) {
            g.ship.rotation -= 1;
        } else if (delta < -180) {
            g.ship.rotation += 1;
        } else if (delta > 0)  {
            g.ship.rotation += 1;
        } else {
            g.ship.rotation -= 1;
        }

        if (g.ship.rotation < 0) {
            g.ship.rotation += 360;
        }
        if (g.ship.rotation > 360) {
            g.ship.rotation -= 360;
        }
    }
    g.ship.radians = g.ship.rotation * Math.PI/180;

    if (g.ship.allstop) {
        g.ship.thrust *= .95;
        if (g.ship.thrust < .1) {
            g.ship.thrust = 0;
            g.ship.allstop = false;
        }
    }
    // Is the player accelerating?
    if (jgl.KEY_STATE[jgl.KEYS.UP]) {
        g.ship.allstop = false;
        if (g.ship.thrust < g.MAX_THRUST) {
            g.ship.thrust += 0.1;
        }
    }

    if (jgl.KEY_STATE[jgl.KEYS.DOWN]) {
        g.ship.thrust -= 0.1;
        g.ship.thrust = g.ship.thrust;
        if (g.ship.thrust < .1) {
            g.ship.thrust = 0;
            g.ship.allstop = false;
        }
    }

    g.ship.thrustX = (Math.sin(g.ship.radians) / 4) * g.ship.thrust;
    g.ship.thrustY = (Math.cos(g.ship.radians) / 4) * g.ship.thrust;

    // Update our ship's position
    g.ship.x += g.ship.thrustX;
    g.ship.y -= g.ship.thrustY;

    // Keep us within the map's universe
    if (g.ship.y > g.MAP_HEIGHT_PIXELS + (g.TILE_SIZE * 1.5)) {
        g.ship.y = g.MAP_HEIGHT_PIXELS + (g.TILE_SIZE * 1.5);
    } else if (g.ship.y < (g.TILE_SIZE * 2.5)) {
        g.ship.y = g.TILE_SIZE * 2.5;
    }
    if (g.ship.x > g.MAP_WIDTH_PIXELS + (g.TILE_SIZE * 3)) {
        g.ship.x = g.MAP_WIDTH_PIXELS + (g.TILE_SIZE * 3);
    } else if (g.ship.x < (g.TILE_SIZE * 4)) {
        g.ship.x = g.TILE_SIZE * 4;
    }

    //g.ship.sprite.setPosition(g.ship.x, g.ship.y);
    g.mapX = g.ship.x - 448;
    g.mapY = g.ship.y - 228;
    g.ship.sprite.setRotation(g.ship.rotation);

}

/*************************************************/
function updateHelm() {
    g.overlaycontext.font = "20px sans-serif";
    g.overlaycontext.fillStyle = "green";
    var x = 32;
    var y = 436;
    var tab = 128;
    g.overlaycontext.fillText("X:"+ g.ship.x.toFixed(2), x, y);
    g.overlaycontext.fillText("Y:"+ g.ship.y.toFixed(2), x+=tab, y);
    g.overlaycontext.fillText("dX:"+ g.ship.speedX.toFixed(2), x+=tab, y);
    g.overlaycontext.fillText("dY:"+ g.ship.speedY.toFixed(2), x+=tab, y);
    g.overlaycontext.fillText("Rot:"+ g.ship.rotation.toFixed(2), x+=tab, y);
}
