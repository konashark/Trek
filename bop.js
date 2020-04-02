var bop = {
    sprite: undefined
};

/*************************************************/
bop.init = function() {
    bop.sprite = map.spriteList.newSprite({id: 'bop', width: map.TILE_SIZE, height: map.TILE_SIZE, image: './images/klingon_sprite2.png'});

    bop.sprite.setPosition(750,180);
    bop.sprite.setRotation(230);
    bop.sprite.setHotSpot(map.TILE_SIZE / 2, map.TILE_SIZE / 2);
};
