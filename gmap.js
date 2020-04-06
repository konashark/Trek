// FEDERATION SPACE MAP
//
// SECTORS: 15 x 15 (225)
//      TILES: 100 x 100 (10000)
//          PIXELS: 256 x 256 (65535)
//
// SECTOR DIMENSION IN PIXELS: (25600 x 25600) sq (655,360,000)
// FULL MAP DIMENSIONS IN PIXELS: (384,000 x 384,000) = (6,553,600 x 225 sectors) = 147,456,000,000 pixels
//

var gmap = {
    data: [],
    currentSectorX: 7,
    currentSectorY: 7,
    SIZE: 15,
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
    for (var x = 0; x < gmap.SIZE; x++) {
        gmap.data[x] = [];
        for (var y = 0; y < gmap.SIZE; y++) {
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
gmap.placeSuns = function() {
    var i, x, y;
    var placed = false;

    for (i = 0; i < gmap.NUM_SUNS; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,gmap.SIZE-1);
            y = jgl.randomRange(0,gmap.SIZE-1);
            var sectorData = gmap.data[x][y];
            if (!sectorData.sun) {
                var sun = {
                    name: "Sun " + i,
                    tileRow: jgl.randomRange(10, sector.MAP_ROWS - 10),
                    tileCol: jgl.randomRange(10, sector.MAP_COLS - 10),
                    damage: 0
                }; console.log(sun.tileRow);
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
            x = jgl.randomRange(0,gmap.SIZE-1);
            y = jgl.randomRange(0,gmap.SIZE-1);
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
            x = jgl.randomRange(0,gmap.SIZE-1);
            y = jgl.randomRange(0,gmap.SIZE-1);
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
        x = jgl.randomRange(0,gmap.SIZE-1);
        y = jgl.randomRange(0,gmap.SIZE-1);
        gmap.data[x][y].hostiles++;
    }
};
