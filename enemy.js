var enemy = {
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
};

/*************************************************/
enemy.addBop = function() {
    var sprite = sector.spriteList.newSprite({id: 'bop', width: 64, height: 64, image: './images/klingon_sprite2.png'});

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
    var sprite = sector.spriteList.newSprite({id: 'd7', width: 64, height: 64, image: './images/d7_sprite.png'});

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