var torpedo = {
    image: undefined,
    sprites: [],
};

/*************************************************/
torpedo.init = function() {
    jgl.newImage('./images/torpedo.png', function(image) {
        torpedo.image = image;
        for (var i = 0; i < 4; i++ ) {
            torpedo.sprites[i].sprite.setImage(torpedo.image, 0, 0, 8, 10);
        }
    });

    for (var i = 0; i < 4; i++ ) {
        var t = {
            sprite: map.spriteList.newSprite({id: 'torpedo'+i, width: 8, height: 10 }),
            angle: 0,
            distance: 24,
            active: false
        };
        t.sprite.setHotSpot(4, 4);
        t.sprite.hide();
        torpedo.sprites.push(t);
    }
};

/*************************************************/
torpedo.update = function(context) {
    for (var i = 0; i < 4; i++ ) {
        var t = torpedo.sprites[i];
        if (t.active) {
            if ((t.distance += 6) > map.CENTER_X) {
                t.sprite.hide();
                t.active = false;
            } else {
                t.sprite.setPosition(
                    map.CENTER_X + (Math.sin(t.angle * Math.PI/180) * t.distance),
                    map.CENTER_Y - (Math.cos(t.angle * Math.PI/180) * t.distance));
            }
        }
    }
};

/*************************************************/
torpedo.fire = function(context) {
    for (var i = 0; i < 4; i++ ) {
        var t = torpedo.sprites[i];
        if (t.active === false) {
            t.angle = ship.rotation;
            t.distance = 24;
            t.sprite.setPosition(
                map.CENTER_X + (Math.sin(t.angle * Math.PI/180) * t.distance),
                map.CENTER_Y - (Math.cos(t.angle * Math.PI/180) * t.distance));
            t.sprite.setRotation(t.angle);
            t.active = true;
            t.sprite.show();
            break;
        }
    }
};
