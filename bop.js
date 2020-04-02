var bop = {

};

/*************************************************/
bop.init = function() {
    map.bop.sprite = map.spriteList.newSprite({id: 'bop', width: map.TILE_SIZE, height: map.TILE_SIZE, image: './images/klingon_sprite2.png'});

    map.bop.sprite.setPosition(750,180);
    map.bop.sprite.setRotation(230);
    map.bop.sprite.setHotSpot(map.TILE_SIZE / 2, map.TILE_SIZE / 2);
};
