var bop = {
    sprite: undefined
};

/*************************************************/
bop.init = function() {
    bop.sprite = map.spriteList.newSprite({id: 'bop', width: map.TILE_SIZE, height: map.TILE_SIZE, image: './images/klingon_sprite2.png'});

    bop.sprite.setPosition(750,180);
    bop.sprite.setRotation(230);
    bop.sprite.setHotSpot(32, 32);
    d7.init();
};

var d7 = {
    sprite: undefined
};

/*************************************************/
d7.init = function() {
    d7.sprite = map.spriteList.newSprite({id: 'd7', width: map.TILE_SIZE, height: map.TILE_SIZE, image: './images/d7_sprite.png'});

    d7.sprite.setPosition(300,400);
    d7.sprite.setRotation(33);
    d7.sprite.setHotSpot(32, 32);
};
