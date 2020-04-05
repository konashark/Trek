var TILE_SIZE = 256;
var TILES_WIDE = (window.innerWidth - 260)/TILE_SIZE;
var TILES_HIGH = 3;

var sector = {
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

    spriteList: [],
    objList: []
};

/*************************************************/
sector.init = function() {
    // Configure viewscreen based on size of browser window
    $("#viewscreen")[0].width = sector.CANVAS_W;
    $("#viewscreen")[0].height = sector.CANVAS_H;

    // The bottom layer into which the map is drawn
    sector.mapcanvas = $("#mapcanvas")[0];//document.getElementById("mapcanvas");
    sector.mapcanvas.width = sector.CANVAS_W;
    sector.mapcanvas.height = sector.CANVAS_H;
    sector.mapcontext = sector.mapcanvas.getContext("2d");
    sector.mapcontext.fillStyle = "#eeeeff";

    // The layer above the map in which sprites are drawn
    sector.overlaycanvas = $("#overlaycanvas")[0];//document.getElementById("overlaycanvas");
    sector.overlaycanvas.width = sector.CANVAS_W;
    sector.overlaycanvas.height = sector.CANVAS_H;
    sector.overlaycontext = sector.overlaycanvas.getContext("2d");
    sector.overlaycontext.fillStyle = "#eeeeff";

    console.log("Creating new map...");
    sector.tmap = jgl.newTileMapCanvas({ context: sector.mapcontext, x:0, y:0, w:sector.MAP_VIEWPORT_WIDTH_PIXELS, h:sector.MAP_VIEWPORT_HEIGHT_PIXELS });

    // Initialize navigation overlay
    navOv.init();
    phaser.init();
    shields.init();

    // Create Sprite List
    sector.spriteList = jgl.newSpriteList();

    // Initialize ship overlay
    ship.init();
    phaser.init();
    torpedo.init();
};

/*************************************************/
sector.initSector = function(x, y) {
    console.log("Creating tiles...");

    mapData = [];
    for (var y = 0; y < sector.MAP_COLS; y++) {
        mapData[y] = [];
        for (var x = 0; x < sector.MAP_ROWS; x++) {
            mapData[y][x] = jgl.random(100);
        }
    }

    // Load SUN image and place in map
    jgl.newImage('./images/sun.png', function(image) {
        sector.tmap.newTile({ index:sector.tile.SUN, img: image, x:0, y:0, w:sector.TILE_SIZE, h:sector.TILE_SIZE });
        mapData[49][48] = sector.tile.SUN;
    });

    jgl.newImage('./images/earth.png', function(image) {
        sector.tmap.newTile({ index:sector.tile.EARTH, img: image, x:0, y:0, w:sector.TILE_SIZE, h:sector.TILE_SIZE });
        mapData[49][51] = sector.tile.EARTH;
    });

    jgl.newImage('./images/station.png', function(image) {
        sector.tmap.newTile({ index:sector.tile.STATION, img: image, x:0, y:0, w:sector.TILE_SIZE, h:sector.TILE_SIZE });
        mapData[50][50] = sector.tile.STATION;
    });

    sector.tmap.attachMap({ numColumns: sector.MAP_COLS, numRows: sector.MAP_ROWS, tileWidth: sector.TILE_SIZE, tileHeight: sector.TILE_SIZE, mapData:mapData});
    sector.tmap.setPositionOffset(sector.MAP_ROWS / 2, sector.MAP_COLS / 2); // center of map is positioning hot spot

    var makeTile = function(blank) {
        var image = new Image(sector.TILE_SIZE, sector.TILE_SIZE);
        var canvas = jgl.convertImageToCanvas(image);
        var context = canvas.getContext("2d");
        context.fillStyle = "#000000";
        context.fillRect(0,0,sector.TILE_SIZE,sector.TILE_SIZE);
        if (!blank) {
            var numStars = jgl.randomRange(16,sector.TILE_SIZE / 4);
            for (var star = 0; star < numStars; star++) {
                var luminance = jgl.randomRange(48, 255);
                var size = jgl.randomRange(1, 3);
                context.fillStyle = 'rgb(' + luminance + ',' + luminance + ',' + luminance + ')';
                context.fillRect(jgl.random(sector.TILE_SIZE), jgl.random(sector.TILE_SIZE), size, size);
            }
        }

        // Draw grid lines in tile
        context.strokeStyle = "#004000";
        context.beginPath();
        context.moveTo(0,sector.TILE_SIZE/2);
        context.lineTo(sector.TILE_SIZE,sector.TILE_SIZE/2);
        context.stroke();
        context.beginPath();
        context.moveTo(sector.TILE_SIZE/2,0);
        context.lineTo(sector.TILE_SIZE/2,sector.TILE_SIZE);
        context.stroke();

        context.strokeStyle = "#002800";
        context.beginPath();
        context.moveTo(0,sector.TILE_SIZE/4);
        context.lineTo(sector.TILE_SIZE,sector.TILE_SIZE/4);
        context.stroke();
        context.beginPath();
        context.moveTo(sector.TILE_SIZE/4,0);
        context.lineTo(sector.TILE_SIZE/4,sector.TILE_SIZE);
        context.stroke();

        context.strokeStyle = "#002800";
        context.beginPath();
        context.moveTo(0,sector.TILE_SIZE *.75);
        context.lineTo(sector.TILE_SIZE,sector.TILE_SIZE *.75);
        context.stroke();
        context.beginPath();
        context.moveTo(sector.TILE_SIZE *.75,0);
        context.lineTo(sector.TILE_SIZE *.75,sector.TILE_SIZE);
        context.stroke();

        context.strokeStyle = "#007700";
        context.beginPath();
        context.moveTo(0,sector.TILE_SIZE-1);
        context.lineTo(0,0);
        context.lineTo(sector.TILE_SIZE-1,0);
        context.stroke();

        return canvas;
    };

    var image = new Image(sector.TILE_SIZE, sector.TILE_SIZE);
    var canvas = jgl.convertImageToCanvas(image);
    var context = canvas.getContext("2d");
    context.fillStyle = "#000033";
    context.fillRect(0,0,sector.TILE_SIZE,sector.TILE_SIZE);

    sector.tmap.setDefaultTile({ img: canvas, x:0, y:0, w:sector.TILE_SIZE, h:sector.TILE_SIZE });
    for (var index = 0; index < 100; index++) {
        sector.tmap.newTile({ index:index, img: makeTile(), x:0, y:0, w:sector.TILE_SIZE, h:sector.TILE_SIZE });
    }

    enemy.init(1,1);    // Create Romulan Birds-of-Prey and Klingon D7 cruiser
};

/*************************************************/
sector.draw = function() {
    ship.update();

    sector.tmap.drawMap(sector.mapX, sector.mapY);

    sector.overlaycontext.clearRect(0,0, sector.CANVAS_W, sector.CANVAS_H);

    navOv.draw(sector.overlaycontext);
    torpedo.update(sector.overlaycontext);
    shields.draw(sector.overlaycontext);

    sector.spriteList.drawSprites(sector.overlaycontext);
    phaser.draw(sector.overlaycontext);

    sector.gpsUpdate(sector.overlaycontext);
};

/*************************************************/
sector.gpsUpdate = function (context) {
    context.font = "20px sans-serif";
    context.fillStyle = "green";
    var x = 32;
    var y = sector.MAP_VIEWPORT_HEIGHT_PIXELS - 15;
    var tab = 140;
    var smtab = 90;
    context.fillText("Sector:["+ gmap.currentSectorX +"]["+gmap.currentSectorY+"]", x, y);
    context.fillText("X:"+ ship.x.toFixed(2), x+=tab+=20, y);
    context.fillText("Y:"+ ship.y.toFixed(2), x+=tab, y);
    context.fillText("Vel:"+ ship.thrust.toFixed(2), x+=tab, y);
    context.fillText("Head:"+ ship.rotation.toFixed(2), x+=tab, y);
};


