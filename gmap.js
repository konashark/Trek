// FEDERATION SPACE MAP
//
// SECTORS: 15 x 15 (225)
//      TILES: 128 x 128 (16384)
//          PIXELS: 256 x 256 (65535)
//
// SECTOR DIMENSION IN PIXELS: (32768 x 32768) sq (1,073,741,824)
// FULL MAP DIMENSIONS IN PIXELS: (491,520 x 491,520) =  241,591,910,400 pixels
//

var gMap = {
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
    numHostiles: 48,

    planetList: [],
    starbaseList: [],
};

/*************************************************/
gMap.init = function() {
    gMap.data = [];
    for (var x = 0; x < gMap.PARSEC_DIM; x++) {
        gMap.data[x] = [];
        for (var y = 0; y < gMap.PARSEC_DIM; y++) {
            gMap.data[x].push( {
                x: x,
                y: y,
                parsecX: x * gSector.MAP_WIDTH_PIXELS,
                parsecY: y * gSector.MAP_WIDTH_PIXELS,
                starbase: undefined,
                planet: undefined,
                sun: undefined,
                hostiles: 0,
                underAttack: false
            });
        }
    }

    gMap.placeSuns();
    gMap.placePlanets();
    gMap.placeStarbases();
    gMap.placeHostiles();

    gSector.initSector(gMap.data[gMap.currentSectorX][gMap.currentSectorY]);
};

/*************************************************/
gMap.currentSector = function() {
    return gMap.data[gMap.currentSectorX][gMap.currentSectorY];
};

/*************************************************/
gMap.placeSuns = function() {
    var i, x, y;
    var placed = false;

    for (i = 0; i < gMap.NUM_SUNS; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,gMap.PARSEC_DIM-1);
            y = jgl.randomRange(0,gMap.PARSEC_DIM-1);
            var sectorData = gMap.data[x][y];
            if (!sectorData.sun) {
                var sun = {
                    name: "Sun " + i,
                    tileRow: jgl.randomRange(10, gSector.MAP_ROWS - 10),
                    tileCol: jgl.randomRange(10, gSector.MAP_COLS - 10),
                    damage: 0
                };
                gMap.data[x][y].sun = sun;
                placed = true;
            }
        }while(!placed);
    }
};

/*************************************************/
gMap.placePlanets = function() {
    var i, x, y;
    var placed = false;
    var nameBaseIndex = jgl.random(gPlanetNames.length - gMap.NUM_PLANETS);

    // Place Earth at center-fixed location
    gMap.data[gMap.currentSectorX][gMap.currentSectorY].planet = {
        name: "Earth",
        planetIndex: 0,
        sectorX: gMap.currentSectorX,
        sectorY: gMap.currentSectorY,
        tileRow: 127,
        tileCol: 127,
        damage: 0
    };
    gMap.planetList.push(planet);

    for (i = 1; i < gMap.NUM_PLANETS; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,gMap.PARSEC_DIM-1);
            y = jgl.randomRange(1,gMap.PARSEC_DIM-2);
            var sectorData = gMap.data[x][y];
            if (sectorData.sun && !sectorData.planet) {
                var planet = {
                    name: gPlanetNames[nameBaseIndex + i],
                    planetIndex: i,
                    sectorX: x,
                    sectorY: y,
                    tileRow: 127,
                    tileCol: 127,
                    damage: 0
                };
                gMap.data[x][y].planet = planet;
                gMap.planetList.push(planet);
                placed = true;
            }
        }while(!placed);
    }
};

/*************************************************/
gMap.placeStarbases = function() {
    var i, x, y;
    var placed = false;

    for (i = 0; i < gMap.NUM_STARBASES; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,gMap.PARSEC_DIM-1);
            y = jgl.randomRange(0,gMap.PARSEC_DIM-1);
            var sectorData = gMap.data[x][y];
            if (!sectorData.sun && !sectorData.planet && !sectorData.starbase) {
                var starbase = {
                    name: "Starbase " + i,
                    sectorX: x,
                    sectorY: y,
                    tileRow: 127,
                    tileCol: 127,
                    damage: 0
                };
                gMap.data[x][y].starbase = starbase;
                gMap.starbaseList.push(starbase);
                placed = true;
            }
        }while(!placed);
    }
};

/*************************************************/
gMap.placeHostiles = function() {
    var i, x, y;

    for (i = 0; i < gMap.NUM_HOSTILES; i++) {
        x = jgl.randomRange(0,gMap.PARSEC_DIM-1);
        y = jgl.randomRange(0,gMap.PARSEC_DIM-1);
        gMap.data[x][y].hostiles++;
    }
};
