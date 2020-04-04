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
            active: false,
            fireSfx: new Audio('./sounds/laser.mp3'),
            explosionSfx: new Audio('./sounds/crash.mp3')
    };
        t.sprite.setHotSpot(4, 4);
        t.sprite.hide();
        // Add it to the list of sprite
        torpedo.sprites.push(t);
    }

    // Example of loading and defining an animated sprite
    // Create an animated explosion sprite for each torpedo
    explosionImg = jgl.newImage("./images/explosion.png", function() {
        for (i = 0; i < 4; i++) {
            sprite = map.spriteList.newSprite({
                width: 88, height: 90, center: true,
                image: explosionImg,
                animate: true,
                autoLoop: false,
                autoDeactivate: true,
                currentFrame: 0,
                startFrame: 0,
                endFrame: 39,
                active: false
            });

            // Define animation frames
            for (frame = 0; frame < 40; frame++) {
                sprite.setAnimFrame(frame, explosionImg, frame * 88, 0, 88, 90);
            }
            torpedo.sprites[i].explosionSprite = sprite;
        }

        // Large explosion
        map.explosionSprite = map.spriteList.newSprite({
            width: 88, height: 90, scale: 4, center: true,
            image: explosionImg,
            animate: true,
            autoLoop: false,
            autoDeactivate: true,
            currentFrame: 0,
            startFrame: 0,
            endFrame: 39,
            active: false
        });

        // Define animation frames
        for (frame = 0; frame < 40; frame++) {
            map.explosionSprite.setAnimFrame(frame, explosionImg, frame * 88, 0, 88, 90);
        }
        map.explosionSound = new Audio('./sounds/crash.mp3');

        //loadComplete();
    });
};

/*************************************************/
torpedo.update = function(context) {
    for (var i = 0; i < 4; i++ ) {
        var t = torpedo.sprites[i];
        if (t.active) {
            if ((t.distance += 6) > (map.CENTER_X / 2)) {
                torpedo.doExplosion(i, undefined);
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
            t.fireSfx.play();
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

/*************************************************/
torpedo.doExplosion = function(index, hitObj) {
    var t = torpedo.sprites[index];
    t.explosionSfx.play();
    var sprite = t.explosionSprite;
    sprite.setRotation(Math.floor(Math.random() * 360));
    sprite.setAnimActions(true);
    sprite.setPosition(t.sprite.x, t.sprite.y);
    sprite.setCurrentFrame(0);
    sprite.show();
};