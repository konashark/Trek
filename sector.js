var sector = {
    data: [[]],
    x: 0,
    y: 0,
    MAX: 32
};

/*************************************************/
sector.init = function() {
    sector.data = [];
    for (var x = 0; x < sector.MAX; x++) {
        sector.data[x] = [];
        for (var y = 0; y < sector.MAX; y++) {
            sector.data[x][y] = {
                x: x,
                y: y
            };
        }
    }
};
