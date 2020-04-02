var map = {

//var g = g || {};
//g = Object.assign(g, {
    CANVAS_W: 960,
    CANVAS_H: 448,
    CENTERX: 480,
    CENTERY: 228,

    MAX_THRUST: 100,        // Maximum speed of our ship (in pixels per frame)
    MAP_ROWS: 256,
    MAP_COLS: 256,
    MAP_WIDTH_PIXELS: 256 * 64,
    MAP_HEIGHT_PIXELS: 256 * 64,
    TILE_SIZE: 64,
    mapX: 0, mapY: 0,
    img: [],
    canvas: undefined,
    context: undefined,
    tmap: undefined,

    shieldCanvas: undefined,
    shieldContext: undefined,
    shieldOverlayActive: false,

    bop: {
        sprite: undefined
    }
};

/*************************************************/
map.init = function() {
    // The bottom layer into which the map is drawn
    map.mapcanvas = document.getElementById("mapcanvas");
    map.mapcontext = map.mapcanvas.getContext("2d");
    map.mapcontext.fillStyle = "#eeeeff";

    // The layer above the map in which sprites are drawn
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

