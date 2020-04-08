var gEnemy = {
    attackGroups: [],
    objList: undefined
};

/*************************************************/
gEnemy.init = function() {
    gEnemy.objList = [];
    gEnemy.placeAttackGroups();
};

/*************************************************/
gEnemy.initSector = function(bop, d7) {
    for (var i = 0; i < bop; i++ ) {
        gEnemy.addBop();
    }

    for (i = 0; i < d7; i++ ) {
        gEnemy.addD7();
    }
};

/*************************************************/
gEnemy.addBop = function() {
    var sprite = gSector.spriteList.newSprite({id: 'bop', width: 64, height: 64, image: './images/klingon_sprite2.png', center: false});

    sprite.setPosition(750,180);
    sprite.setRotation(230);
    sprite.setHotSpot(32, 32);

    gEnemy.objList.push({
        type: "bop",
        sprite: sprite
    });
};

var d7 = {
    sprite: undefined
};

/*************************************************/
gEnemy.addD7 = function() {
    var sprite = gSector.spriteList.newSprite({id: 'd7', width: 64, height: 64, image: './images/d7_sprite.png', center: false});

    sprite.setPosition(300,400);
    sprite.setRotation(33);
    sprite.setHotSpot(32, 32);

    gEnemy.objList.push({
        type: "d7",
        sprite: sprite
    });
};

/*************************************************/
gEnemy.didCollide = function(torpedo) {
    var hitObj = undefined;
    gEnemy.objList.forEach(function(obj, index) {
        if(gSector.spriteList.collision(torpedo, obj.sprite, 0, true)) {
            hitObj = obj;
        }
    });
    return hitObj;
};

/*************************************************/
gEnemy.placeAttackGroups = function() {

    for (var i = 1; i <= 3; i++) {  // 'i' is number of ships in each attack group. There are 5 attack groups for each number 1-3
        for (var ag = 0; ag < 5; ag++) {
            // Define Attack Group
            var placed = false;
            var sx, sy;
            do {
                sx = jgl.randomRange(1,13);
                sy = jgl.randomRange(0,2);
                if (!gMap.data[sx][sy].taken){
                    placed = true;
                }
            }while(!placed);

            gMap.data[sx][sy].taken = true;
            var attackGroup = [];

            var bx = jgl.randomRange(3000, 10000);
            var by = jgl.randomRange(3000, 10000);
            for (var s = 0; s < i; s++) {
                // Place enemy ship
                var x = bx + jgl.random(700);
                var y = by + jgl.random(700);

                attackGroup[s] = {
                    x: x,
                    y: y,
                    globalX: sx * gMap.SECTOR_PIXELS + x,
                    globalY: (sy - 2) * gMap.SECTOR_PIXELS + y,
                    targetX: gMap.PARSEC_PIXELS / 2,    // Update to point at starbase or planet
                    targetY: gMap.PARSEC_PIXELS / 2,
                    damage: 0,
                    weapons: 100,
                    drive: 100,
                    type: "D7"
                }
            }
            gEnemy.attackGroups.push(attackGroup);
        }
    }
};
