var map = {
    data: undefined,
    x: 0,
    y: 0,
    MAX: 32
};

/*************************************************/
map.init = function() {
    map.data = [];
    for (var x = 0; x < map.MAX; x++) {
        map.data[x] = [];
        for (var y = 0; y < map.MAX; y++) {
            map.data[x][y] = {
                x: x,
                y: y
            };
        }
    }

    sector.initSector(map.x, map.y);
};
