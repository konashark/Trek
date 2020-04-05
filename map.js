// FEDERATION SPACE MAP
//
// SECTORS: 15 x 15 (225)
//      TILES: 100 x 100 (10000)
//          PIXELS: 256 x 256 (65535)
//
// SECTOR DIMENSION IN PIXELS: (25600 x 25600) sq (655,360,000)
// FULL MAP DIMENSIONS IN PIXELS: (384,000 x 384,000) = (6,553,600 x 225 sectors) = 147,456,000,000 pixels
//

var map = {
    data: [],
    currentSectorX: 7,
    currentSectorY: 7,
    SIZE: 15,
    NUM_PLANETS: 37,
    NUM_STARBASES: 16,
    NUM_SUNS: 64,

    planetsLost: 0,
    basesLost: 0,
    numHostiles: 48
};

/*************************************************/
map.init = function() {
    map.data = [];
    for (var x = 0; x < map.SIZE; x++) {
        map.data[x] = [];
        for (var y = 0; y < map.SIZE; y++) {
            map.data[x][y] = {
                x: x,
                y: y,
                starbase: undefined,
                planet: undefined,
                sun: undefined
            };
        }
    }

    map.placeSuns();
    map.placePlanets();
    map.placeStarbases();

    for (x = 0; x < map.SIZE; x++) {
        map.data[x] = [];
        for (y = 0; y < map.SIZE; y++) {
            console.log(map.data[x][y]);
        }
    }

    sector.initSector(map.x, map.y);
};

/*************************************************/
map.placeSuns = function() {
    var i, x, y;
    var placed = false;

    for (i = 0; i < map.NUM_SUNS; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,map.SIZE-1);
            y = jgl.randomRange(0,map.SIZE-1);
            var sector = map.data[x][y];
            if (!sector.sun) {
                var sun = {
                    name: "Sun " + i,
                    tileRow: jgl.randomRange(10, sector.MAP_ROWS - 10),
                    tileCol: jgl.randomRange(10, sector.MAP_COLS - 10),
                    damage: 0
                };
                map.data[x][y].sun = sun;
                placed = true;
            }
        }while(!placed);
    }
};

/*************************************************/
map.placePlanets = function() {
    var i, x, y;
    var placed = false;

    for (i = 0; i < map.NUM_PLANETS; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,map.SIZE-1);
            y = jgl.randomRange(0,map.SIZE-1);
            var sector = map.data[x][y];
            if (sector.sun && !sector.planet) {
                var planet = {
                    name: "Planet " + i,
                    tileRow: jgl.randomRange(10, sector.MAP_ROWS - 10),
                    tileCol: jgl.randomRange(10, sector.MAP_COLS - 10),
                    damage: 0
                };
                map.data[x][y].planet = planet;
                placed = true;
            }
        }while(!placed);
    }
};

/*************************************************/
map.placeStarbases = function() {
    var i, x, y;
    var placed = false;

    for (i = 0; i < map.NUM_STARBASES; i++) {
        do {
            placed = false;
            x = jgl.randomRange(0,map.SIZE-1);
            y = jgl.randomRange(0,map.SIZE-1);
            var sector = map.data[x][y];
            if (!sector.starbase) {
                var starbase = {
                    name: "Starbase " + i,
                    tileRow: jgl.randomRange(10, sector.MAP_ROWS - 10),
                    tileCol: jgl.randomRange(10, sector.MAP_COLS - 10),
                    damage: 0
                };
                map.data[x][y].starbase = starbase;
                placed = true;
            }
        }while(!placed);
    }
};
