var TILE_SIZE = 256;
var TILES_WIDE = 4;
var TILES_HIGH = 2;

var map = {
    CANVAS_W: TILE_SIZE * TILES_WIDE,
    CANVAS_H: TILE_SIZE * TILES_HIGH,
    CENTER_X: TILE_SIZE * TILES_WIDE / 2,
    CENTER_Y: TILE_SIZE * TILES_HIGH / 2,

    MAX_THRUST: 100,        // Maximum speed of our ship (in pixels per frame)
    MAP_ROWS: 100,
    MAP_COLS: 100,
    MAP_WIDTH_PIXELS: 100 * TILE_SIZE,
    MAP_HEIGHT_PIXELS: 100 * TILE_SIZE,
    MAP_VIEWPORT_WIDTH_PIXELS: TILE_SIZE * TILES_WIDE,
    MAP_VIEWPORT_HEIGHT_PIXELS: TILE_SIZE * TILES_HIGH,
    TILE_SIZE: TILE_SIZE,
    mapX: 0, mapY: 0,

    img: [],
    canvas: undefined,
    context: undefined,
    tmap: undefined,

    tile: {
        SUN: 101,
        EARTH: 102,
        STATION: 103
    },

    explosionSprite: undefined,
    explosionSound: undefined,

    objList: []
};

/*************************************************/
map.init = function() {
    // The bottom layer into which the map is drawn
    map.mapcanvas = document.getElementById("mapcanvas");
    map.mapcanvas.width = map.CANVAS_W;
    map.mapcanvas.height = map.CANVAS_H;
    map.mapcontext = map.mapcanvas.getContext("2d");
    map.mapcontext.fillStyle = "#eeeeff";

    // The layer above the map in which sprites are drawn
    map.overlaycanvas = document.getElementById("overlaycanvas");
    map.overlaycanvas.width = map.CANVAS_W;
    map.overlaycanvas.height = map.CANVAS_H;
    map.overlaycontext = map.overlaycanvas.getContext("2d");
    map.overlaycontext.fillStyle = "#eeeeff";

    console.log("Creating new map...");
    map.tmap = jgl.newTileMapCanvas({ context: map.mapcontext, x:0, y:0, w:map.MAP_VIEWPORT_WIDTH_PIXELS, h:map.MAP_VIEWPORT_HEIGHT_PIXELS });

    console.log("Creating tiles...");

    mapData = [];
    for (var y = 0; y < map.MAP_COLS; y++) {
        mapData[y] = [];
        for (var x = 0; x < map.MAP_ROWS; x++) {
            mapData[y][x] = jgl.random(100);
        }
    }

    // Load SUN image and place in map
    jgl.newImage('./images/sun.png', function(image) {
        map.tmap.newTile({ index:map.tile.SUN, img: image, x:0, y:0, w:map.TILE_SIZE, h:map.TILE_SIZE });
        mapData[49][48] = map.tile.SUN;
    });

    jgl.newImage('./images/earth.png', function(image) {
        map.tmap.newTile({ index:map.tile.EARTH, img: image, x:0, y:0, w:map.TILE_SIZE, h:map.TILE_SIZE });
        mapData[49][51] = map.tile.EARTH;
    });

    jgl.newImage('./images/station.png', function(image) {
        map.tmap.newTile({ index:map.tile.STATION, img: image, x:0, y:0, w:map.TILE_SIZE, h:map.TILE_SIZE });
        mapData[50][50] = map.tile.STATION;
    });

    map.tmap.attachMap({ numColumns: map.MAP_COLS, numRows: map.MAP_ROWS, tileWidth: map.TILE_SIZE, tileHeight: map.TILE_SIZE, mapData:mapData});
    map.tmap.setPositionOffset(map.MAP_ROWS / 2, map.MAP_COLS / 2); // center of map is positioning hot spot

    var makeTile = function(blank) {
        var image = new Image(map.TILE_SIZE, map.TILE_SIZE);
        var canvas = jgl.convertImageToCanvas(image);
        var context = canvas.getContext("2d");
        context.fillStyle = "#000000";
        context.fillRect(0,0,map.TILE_SIZE,map.TILE_SIZE);
        if (!blank) {
            var numStars = jgl.randomRange(8,map.TILE_SIZE / 4);
            for (var star = 0; star < numStars; star++) {
                var luminance = jgl.randomRange(48, 255);
                var size = jgl.randomRange(1, 3);
                context.fillStyle = 'rgb(' + luminance + ',' + luminance + ',' + luminance + ')';
                context.fillRect(jgl.random(map.TILE_SIZE), jgl.random(map.TILE_SIZE), size, size);
            }
        }

        // Draw grid lines in tile
        context.strokeStyle = "#004000";
        context.beginPath();
        context.moveTo(0,map.TILE_SIZE/2);
        context.lineTo(map.TILE_SIZE,map.TILE_SIZE/2);
        context.stroke();
        context.beginPath();
        context.moveTo(map.TILE_SIZE/2,0);
        context.lineTo(map.TILE_SIZE/2,map.TILE_SIZE);
        context.stroke();

        context.strokeStyle = "#002800";
        context.beginPath();
        context.moveTo(0,map.TILE_SIZE/4);
        context.lineTo(map.TILE_SIZE,map.TILE_SIZE/4);
        context.stroke();
        context.beginPath();
        context.moveTo(map.TILE_SIZE/4,0);
        context.lineTo(map.TILE_SIZE/4,map.TILE_SIZE);
        context.stroke();

        context.strokeStyle = "#002800";
        context.beginPath();
        context.moveTo(0,map.TILE_SIZE *.75);
        context.lineTo(map.TILE_SIZE,map.TILE_SIZE *.75);
        context.stroke();
        context.beginPath();
        context.moveTo(map.TILE_SIZE *.75,0);
        context.lineTo(map.TILE_SIZE *.75,map.TILE_SIZE);
        context.stroke();

        context.strokeStyle = "#007700";
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
        map.tmap.newTile({ index:index, img: makeTile(), x:0, y:0, w:map.TILE_SIZE, h:map.TILE_SIZE });
    }

    // Initialize navigation overlay
    navOv.init();
    phaser.init();
    shields.init();

    // Create Sprite List
    map.spriteList = jgl.newSpriteList();

    // Initialize ship overlay
    ship.init();
    bop.init();
    phaser.init();
    torpedo.init();

};

/*************************************************/
map.initSector = function(x, y) {
};

/*************************************************/
map.draw = function() {
    ship.update();

    map.tmap.drawMap(map.mapX, map.mapY);

    map.overlaycontext.clearRect(0,0, map.CANVAS_W, map.CANVAS_H);

    navOv.draw(map.overlaycontext);
    torpedo.update(map.overlaycontext);
    shields.draw(map.overlaycontext);

    map.spriteList.drawSprites(map.overlaycontext);
    phaser.draw(map.overlaycontext);

    mapgps.update(map.overlaycontext);
};

