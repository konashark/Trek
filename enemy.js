var enemy = {
    attackGroups: [],
    objList: undefined
};

/*************************************************/
enemy.init = function(bop, d7) {
    enemy.objList = [];

    for (var i = 0; i < bop; i++ ) {
        enemy.addBop();
    }

    for (i = 0; i < d7; i++ ) {
        enemy.addD7();
    }

    enemy.placeAttackGroups();
};

/*************************************************/
enemy.addBop = function() {
    var sprite = sector.spriteList.newSprite({id: 'bop', width: 64, height: 64, image: './images/klingon_sprite2.png', center: false});

    sprite.setPosition(750,180);
    sprite.setRotation(230);
    sprite.setHotSpot(32, 32);

    enemy.objList.push({
        type: "bop",
        sprite: sprite
    });
};

var d7 = {
    sprite: undefined
};

/*************************************************/
enemy.addD7 = function() {
    var sprite = sector.spriteList.newSprite({id: 'd7', width: 64, height: 64, image: './images/d7_sprite.png', center: false});

    sprite.setPosition(300,400);
    sprite.setRotation(33);
    sprite.setHotSpot(32, 32);

    enemy.objList.push({
        type: "d7",
        sprite: sprite
    });
};

/*************************************************/
enemy.didCollide = function(torpedo) {
    var hitObj = undefined;
    enemy.objList.forEach(function(obj, index) {
        if(sector.spriteList.collision(torpedo, obj.sprite, 0, true)) {
            hitObj = obj;
        }
    });
    return hitObj;
};

/*************************************************/
enemy.placeAttackGroups = function() {

    for (var i = 1; i <= 3; i++) {  // 'i' is number of ships in each attack group. There are 5 attack groups for each number 1-3
        for (var ag = 0; ag < 5; ag++) {
            // Define Attack Group
            var placed = false;
            var sx, sy;
            do {
                sx = jgl.randomRange(1,13);
                sy = jgl.randomRange(0,2);
                if (!gmap.data[sx][sy].taken){
                    placed = true;
                }
            }while(!placed);

            gmap.data[sx][sy].taken = true;
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
                    globalX: sx * gmap.SECTOR_PIXELS + x,
                    globalY: (sy - 2) * gmap.SECTOR_PIXELS + y,
                    targetX: gmap.PARSEC_PIXELS / 2,    // Update to point at starbase or planet
                    targetY: gmap.PARSEC_PIXELS / 2,
                    damage: 0,
                    weapons: 100,
                    drive: 100,
                    type: "D7"
                }
            }
            enemy.attackGroups.push(attackGroup);
        }
    }
};
