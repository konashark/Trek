var gEnemy = {
    attackGroups: [],
    objList: undefined
};

/*************************************************/
gEnemy.init = function() {
    gEnemy.objList = [];
    gEnemy.placeAttackGroups();
    gEnemy.assignTargets();
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
            // Find an empty sector to place our attack group
            do {
                sx = jgl.randomRange(1,gMap.PARSEC_DIM - 2);
                sy = jgl.randomRange(0,2);
                if (!gMap.data[sx][sy].taken){
                    placed = true;
                }
            }while(!placed);

            gMap.data[sx][sy].taken = true;

            var attackGroup = {
                sectorX: sx,
                sectorY: sy,
                parsecX: 0,
                parsecY: 0,
                targetX: 0,    // Update to point at starbase or planet
                targetY: 0,
                angle: 0,
                speed: 40,
                type: "D7",
                ships: []
            };
            attackGroup.parsecX = sx * gMap.SECTOR_PIXELS + jgl.randomRange(3000, 10000);  // Choose a base location within the sector around which we'll place some ships;
            attackGroup.parsecY = (sy - 2) * gMap.SECTOR_PIXELS + jgl.randomRange(3000, 10000); // '-2' because we want two of the 3 rows to be outside of Federation space

            // Place 'i' number of ships into the attack group
            for (var s = 0; s < i; s++) {
                var ship = {
                    // Place enemy ship
                    xOffset: attackGroup.x + jgl.random(700),     // Within sector map
                    yOffset: attackGroup.y + jgl.random(700),
                    x: 0,   // Used to track coordinates while in current sector
                    y: 0,
                    angle: 0,
                    speed: 0,
                    damage: 0,
                    weapons: 100,
                    drive: 100,
                    type: "D7"
                };
                attackGroup.ships.push(ship);
            }
            gEnemy.attackGroups.push(attackGroup);
        }
    }

    // Erase the markers we stuck in while placing hostiles, just cuz
    for (sy = 0; sy < 2; sy++) {
        for (sx = 0; sx < gMap.PARSEC_DIM; sx++) {
            if (gMap.data[sx][sy].taken) {
                gMap.data[sx][sy].taken = false;
            }
        }
    }
};

/*************************************************/
gEnemy.assignTargets = function() {
    // Assign each attack group and desgtination planet or starbase
    // We have a total of 30 attack groups (5 each of 1,2,3 & 4 ships)
    // We're going to assign them starbases and planets to attack
    var destination;

    for (var i = 0; i < gEnemy.attackGroups.length; i++) {
        if (i < 8) {    // Half the starbased are target - other half will be targets of other fleet
            destination = gMap.starbaseList[i];
        } else {
            destination = gMap.planetList[i - 8];
        }
        // Destination to somewhere near starbase/planet
        gEnemy.attackGroups[i].targetX = destination.parsecX + (Math.sin(jgl.random()*(2*Math.PI)));
        gEnemy.attackGroups[i].targetY = destination.parsecY - (Math.cos(jgl.random()*(2*Math.PI)));
    }
};

/*************************************************/
gEnemy.updateFleetPosition = function() {

    gEnemy.attackGroups.forEach(function(ag, i){
        ag.angle = jgl.rectToPolar(ag.parsecX, ag.parsecY, ag.targetX, ag.targetY).angle;

        var radians = ag.angle * Math.PI/180;
        //ship.sprite.setRotation(ship.rotation);
        ag.parsecX += (Math.sin(ag.radians) / 4) * (ag.speed / 10);
        ag.parsecY -= (Math.cos(ag.radians) / 4) * (ag.speed / 10);
    });
};

/*************************************************/
gEnemy.addToSector = function() {
    // Are any enemies in the specified sector. If so, activate them
};

