// FEDERATION SPACE MAP
//
// SECTORS: 15 x 15 (225)
//      TILES: 128 x 128 (16384)
//          PIXELS: 256 x 256 (65535)
//
// SECTOR DIMENSION IN PIXELS: (32768 x 32768) sq (1,073,741,824)
// FULL MAP DIMENSIONS IN PIXELS: (491,520 x 491,520) =  241,591,910,400 pixels
//

var gmap = {
    data: [],
    PARSEC_DIM: 15,
    SECTOR_TILE_DIM: 128,
    TILE_PIXELS: 256,
    SECTOR_PIXELS: 256 * 128,
    PARSEC_PIXELS: 256 * 128 * 15,

    currentSectorX: 7,
    currentSectorY: 7,

    NUM_PLANETS: 37,
    NUM_STARBASES: 16,
    NUM_SUNS: 64,
    NUM_HOSTILES: 48,

    planetsLost: 0,
    basesLost: 0,
    numHostiles: 48
};

/*************************************************/
gmap.init = function() {
    gmap.data = [];
    for (var x = 0; x < gmap.PARSEC_DIM; x++) {
        gmap.data[x] = [];
        for (var y = 0; y < gmap.PARSEC_DIM; y++) {
            gmap.data[x].push( {
                x: x,
                y: y,
                starbase: undefined,
                planet: undefined,
                sun: undefined,
                hostiles: 0
            });
        }
    }

    gmap.placeSuns();
    gmap.placePlanets();
    gmap.placeStarbases();
    gmap.placeHostiles();

    sector.initSector(gmap.data[gmap.currentSectorX][gmap.currentSectorY]);
};

/*************************************************/
gmap.currentSector = function() {
    return gmap.data[gmap.currentSectorX][gmap.currentSectorY];
};

/*************************************************/
gmap.placeSuns = function() {
    var i, x, y;
    var placed = false;

    for (i = 0; i < gmap.NUM_SUNS; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,gmap.PARSEC_DIM-1);
            y = jgl.randomRange(0,gmap.PARSEC_DIM-1);
            var sectorData = gmap.data[x][y];
            if (!sectorData.sun) {
                var sun = {
                    name: "Sun " + i,
                    tileRow: jgl.randomRange(10, sector.MAP_ROWS - 10),
                    tileCol: jgl.randomRange(10, sector.MAP_COLS - 10),
                    damage: 0
                };
                gmap.data[x][y].sun = sun;
                placed = true;
            }
        }while(!placed);
    }
};

/*************************************************/
gmap.placePlanets = function() {
    var i, x, y;
    var placed = false;

    // Place Earth at center-fixed location
    gmap.data[gmap.currentSectorX][gmap.currentSectorY].planet = {
        name: "Earth",
        planetIndex: 0,
        tileRow: 127,
        tileCol: 127,
        damage: 0
    };

    for (i = 1; i < gmap.NUM_PLANETS; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,gmap.PARSEC_DIM-1);
            y = jgl.randomRange(0,gmap.PARSEC_DIM-1);
            var sectorData = gmap.data[x][y];
            if (sectorData.sun && !sectorData.planet) {
                var planet = {
                    name: "Planet " + i,
                    planetIndex: i,
                    tileRow: 127,
                    tileCol: 127,
                    damage: 0
                };
                gmap.data[x][y].planet = planet;
                placed = true;
            }
        }while(!placed);
    }
};

/*************************************************/
gmap.placeStarbases = function() {
    var i, x, y;
    var placed = false;

    for (i = 0; i < gmap.NUM_STARBASES; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,gmap.PARSEC_DIM-1);
            y = jgl.randomRange(0,gmap.PARSEC_DIM-1);
            var sectorData = gmap.data[x][y];
            if (!sectorData.sun && !sectorData.planet && !sectorData.starbase) {
                var starbase = {
                    name: "Starbase " + i,
                    tileRow: 127,
                    tileCol: 127,
                    damage: 0
                };
                gmap.data[x][y].starbase = starbase;
                placed = true;
            }
        }while(!placed);
    }
};

/*************************************************/
gmap.placeHostiles = function() {
    var i, x, y;

    for (i = 0; i < gmap.NUM_HOSTILES; i++) {
        x = jgl.randomRange(0,gmap.PARSEC_DIM-1);
        y = jgl.randomRange(0,gmap.PARSEC_DIM-1);
        gmap.data[x][y].hostiles++;
    }
};
