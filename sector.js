var TILE_SIZE = 256;
var TILES_WIDE = (window.innerWidth - 260)/TILE_SIZE;
var TILES_HIGH = 3;

var gSector = {
    CANVAS_W: TILE_SIZE * TILES_WIDE,
    CANVAS_H: TILE_SIZE * TILES_HIGH,
    CENTER_X: TILE_SIZE * TILES_WIDE / 2,
    CENTER_Y: TILE_SIZE * TILES_HIGH / 2,

    MAP_ROWS: 128,
    MAP_COLS: 128,
    MAP_WIDTH_PIXELS: 128 * TILE_SIZE,
    MAP_HEIGHT_PIXELS: 128 * TILE_SIZE,
    SECTOR_CENTER_COORD: 128 * TILE_SIZE / 2 - 64,
    MAP_VIEWPORT_WIDTH_PIXELS: TILE_SIZE * TILES_WIDE,
    MAP_VIEWPORT_HEIGHT_PIXELS: TILE_SIZE * TILES_HIGH,
    TILE_SIZE: TILE_SIZE,
    mapX: TILE_SIZE * TILES_WIDE / 2, mapY: TILE_SIZE * TILES_WIDE / 2,

    canvas: undefined,
    context: undefined,
    tmap: undefined,

    tile: {
        SUN: 100,
        STARBASE: 101,
        PLANET: 102 // 102-138
    },

    data: undefined,

    explosionSprite: undefined,
    explosionSound: undefined,

    spriteList: [],
    objList: []
};

/*************************************************/
gSector.init = function() {
    // Configure viewscreen based on size of browser window
    $("#viewscreen")[0].width = gSector.CANVAS_W;
    $("#viewscreen")[0].height = gSector.CANVAS_H;

    // The bottom layer into which the map is drawn
    gSector.mapcanvas = $("#mapcanvas")[0];//document.getElementById("mapcanvas");
    gSector.mapcanvas.width = gSector.CANVAS_W;
    gSector.mapcanvas.height = gSector.CANVAS_H;
    gSector.mapcontext = gSector.mapcanvas.getContext("2d");
    gSector.mapcontext.fillStyle = "#eeeeff";

    // The layer above the map in which sprites are drawn
    gSector.overlaycanvas = $("#overlaycanvas")[0];//document.getElementById("overlaycanvas");
    gSector.overlaycanvas.width = gSector.CANVAS_W;
    gSector.overlaycanvas.height = gSector.CANVAS_H;
    gSector.overlaycontext = gSector.overlaycanvas.getContext("2d");
    gSector.overlaycontext.fillStyle = "#eeeeff";

    console.log("Creating new map...");
    gSector.tmap = jgl.newTileMapCanvas({ context: gSector.mapcontext, x:0, y:0, w:gSector.MAP_VIEWPORT_WIDTH_PIXELS, h:gSector.MAP_VIEWPORT_HEIGHT_PIXELS });

    // Load SUN image and place in map
    jgl.newImage('./images/sun.png', function(image) {
        gSector.tmap.newTile({ index:gSector.tile.SUN, img: image, x:0, y:0, w:gSector.TILE_SIZE, h:gSector.TILE_SIZE });
    });

    jgl.newImage('./images/station.png', function(image) {
        gSector.tmap.newTile({ index:gSector.tile.STARBASE, img: image, x:0, y:0, w:gSector.TILE_SIZE, h:gSector.TILE_SIZE });
    });

    for (let i = 0; i < gMap.NUM_PLANETS; i++) {   // Using 'let' which binds the loop iterator to each callback. Yea!
        jgl.newImage('./images/planets/'+i+'.png', function(image) {
            gSector.tmap.newTile({ index: (gSector.tile.PLANET + i), img: image, x:0, y:0, w:gSector.TILE_SIZE, h:gSector.TILE_SIZE });
        });
    }

    // Initialize navigation overlay
    gNavOvly.init();
    gPhaser.init();
    gShields.init();

    // Create Sprite List
    gSector.spriteList = jgl.newSpriteList();

    // Initialize ship overlay
    gShip.init();
    gPhaser.init();
    gTorpedo.init();

    gEnemy.initSector();
};

/*************************************************/
gSector.initSector = function(sectorData) {
    gSector.data = sectorData;
    gShip.orbit.state = gShip.orbit.states.READY;

    mapData = [];
    for (var y = 0; y < gSector.MAP_COLS; y++) {
        mapData[y] = [];
        for (var x = 0; x < gSector.MAP_ROWS; x++) {
            mapData[y][x] = jgl.random(100);
        }
    }

    // Place sector-specific objects onto sector map
    if (gSector.data.starbase) {
        mapData[63][63] = gSector.tile.STARBASE;
    }

    if (gSector.data.planet) {
        mapData[63][63] = gSector.tile.PLANET + gSector.data.planet.planetIndex;
        console.log("TBD: Arriving at planet " + gSector.data.planet.name);
    }

    if (gSector.data.sun) {
        mapData[gSector.data.sun.tileRow][gSector.data.sun.tileCol] = gSector.tile.SUN;
    }

    gSector.tmap.attachMap({ numColumns: gSector.MAP_COLS, numRows: gSector.MAP_ROWS, tileWidth: gSector.TILE_SIZE, tileHeight: gSector.TILE_SIZE, mapData:mapData});
    gSector.tmap.setPositionOffset(gSector.MAP_ROWS / 2, gSector.MAP_COLS / 2); // center of map is positioning hot spot

    var makeTile = function(blank) {
        var image = new Image(gSector.TILE_SIZE, gSector.TILE_SIZE);
        var canvas = jgl.convertImageToCanvas(image);
        var context = canvas.getContext("2d");
        context.fillStyle = "#000000";
        context.fillRect(0,0,gSector.TILE_SIZE,gSector.TILE_SIZE);
        if (!blank) {
            var numStars = jgl.randomRange(16,gSector.TILE_SIZE / 4);
            for (var star = 0; star < numStars; star++) {
                var luminance = jgl.randomRange(48, 255);
                var size = jgl.randomRange(1, 3);
                context.fillStyle = 'rgb(' + luminance + ',' + luminance + ',' + luminance + ')';
                context.fillRect(jgl.random(gSector.TILE_SIZE), jgl.random(gSector.TILE_SIZE), size, size);
            }
        }

        // Draw grid lines in tile
        context.strokeStyle = "#004000";
        context.beginPath();
        context.moveTo(0,gSector.TILE_SIZE/2);
        context.lineTo(gSector.TILE_SIZE,gSector.TILE_SIZE/2);
        context.stroke();
        context.beginPath();
        context.moveTo(gSector.TILE_SIZE/2,0);
        context.lineTo(gSector.TILE_SIZE/2,gSector.TILE_SIZE);
        context.stroke();

        context.strokeStyle = "#002800";
        context.beginPath();
        context.moveTo(0,gSector.TILE_SIZE/4);
        context.lineTo(gSector.TILE_SIZE,gSector.TILE_SIZE/4);
        context.stroke();
        context.beginPath();
        context.moveTo(gSector.TILE_SIZE/4,0);
        context.lineTo(gSector.TILE_SIZE/4,gSector.TILE_SIZE);
        context.stroke();

        context.strokeStyle = "#002800";
        context.beginPath();
        context.moveTo(0,gSector.TILE_SIZE *.75);
        context.lineTo(gSector.TILE_SIZE,gSector.TILE_SIZE *.75);
        context.stroke();
        context.beginPath();
        context.moveTo(gSector.TILE_SIZE *.75,0);
        context.lineTo(gSector.TILE_SIZE *.75,gSector.TILE_SIZE);
        context.stroke();

        context.strokeStyle = "#007700";
        context.beginPath();
        context.moveTo(0,gSector.TILE_SIZE-1);
        context.lineTo(0,0);
        context.lineTo(gSector.TILE_SIZE-1,0);
        context.stroke();

        return canvas;
    };

    var image = new Image(gSector.TILE_SIZE, gSector.TILE_SIZE);
    var canvas = jgl.convertImageToCanvas(image);
    var context = canvas.getContext("2d");
    context.fillStyle = "#000033";
    context.fillRect(0,0,gSector.TILE_SIZE,gSector.TILE_SIZE);

    gSector.tmap.setDefaultTile({ img: canvas, x:0, y:0, w:gSector.TILE_SIZE, h:gSector.TILE_SIZE });
    for (var index = 0; index < 100; index++) {
        gSector.tmap.newTile({ index:index, img: makeTile(), x:0, y:0, w:gSector.TILE_SIZE, h:gSector.TILE_SIZE });
    }
    gSector.tmap.drawMap(gSector.mapX, gSector.mapY, true); // Force refresh
};

/*************************************************/
gSector.setMapCoordinates = function(x, y) {
    gSector.mapX = x - gSector.CENTER_X;
    gSector.mapY = y - gSector.CENTER_Y;
};

/*************************************************/
gSector.draw = function() {
    gShip.update();

    gSector.tmap.drawMap(gSector.mapX, gSector.mapY);

    gSector.overlaycontext.clearRect(0,0, gSector.CANVAS_W, gSector.CANVAS_H);

    gNavOvly.draw(gSector.overlaycontext);
    gTorpedo.update(gSector.overlaycontext);
    gShields.draw(gSector.overlaycontext);

    gSector.spriteList.drawSprites(gSector.overlaycontext);
    gPhaser.draw(gSector.overlaycontext);

    gSector.gpsUpdate(gSector.overlaycontext);
};

/*************************************************/
gSector.gpsUpdate = function (context) {
    context.font = "20px sans-serif";
    context.fillStyle = "green";
    var x = 32;
    var y = gSector.MAP_VIEWPORT_HEIGHT_PIXELS - 15;
    var tab = 140;
    var smtab = 90;
    context.fillText("X:"+ gShip.x.toFixed(2), x+=tab+=20, y);
    context.fillText("Y:"+ gShip.y.toFixed(2), x+=tab, y);
    context.fillText("Vel:"+ gShip.thrust.toFixed(2), x+=tab, y);
    context.fillText("Head:"+ gShip.rotation.toFixed(2), x+=tab, y);
};


