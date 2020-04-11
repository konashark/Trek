var gTorpedo = {
    image: undefined,
    objList: [],
};

/*************************************************/
gTorpedo.init = function() {

    jgl.newImage('./images/torpedo2.png', function(image) {
        gTorpedo.image = image;
        for (var i = 0; i < 4; i++ ) {
            var t = {
                sprite: gSector.spriteList.newSprite({id: 'torpedo'+i, image: image, width: 8, height: 20, center: true }),
                angle: 0,
                distance: 24,
                active: false,
                fireSfx: new Audio('./sounds/torpedo.mp3'),
                explosionSfx: new Audio('./sounds/crash.mp3')
            };
            //t.sprite.setHotSpot(4, 6);
            t.sprite.hide();
            // Add it to the list of sprite
            gTorpedo.objList.push(t);
        }
    });

    // Example of loading and defining an animated sprite
    // Create an animated explosion sprite for each torpedo
    explosionImg = jgl.newImage("./images/explosion.png", function() {
        for (i = 0; i < 4; i++) {
            sprite = gSector.spriteList.newSprite({
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
            gTorpedo.objList[i].explosionSprite = sprite;
        }

        // Large explosion
        gSector.explosionSprite = gSector.spriteList.newSprite({
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
            gSector.explosionSprite.setAnimFrame(frame, explosionImg, frame * 88, 0, 88, 90);
        }
        gSector.explosionSound = new Audio('./sounds/tinyexplosion.mp3');

        //loadComplete();
    });
};

/*************************************************/
gTorpedo.update = function(context) {
    for (var i = 0; i < 4; i++ ) {
        var t = gTorpedo.objList[i];
        if (t.active) {
            if ((t.distance += 6) > gSector.CENTER_X) {
                t.sprite.hide();
                t.active = false;
            } else {
                t.sprite.setPosition(
                    gSector.CENTER_X + (Math.sin(t.angle * Math.PI/180) * t.distance),
                    gSector.CENTER_Y - (Math.cos(t.angle * Math.PI/180) * t.distance));

                // Technically, should wait until after drawing to do a collision check
                if (gEnemy.didCollide(t.sprite)) {
                    gTorpedo.doExplosion(i);
                    t.sprite.hide();
                    t.active = false;
                }
            }
        }
    }
};

/*************************************************/
gTorpedo.fire = function(context) {
    for (var i = 0; i < 4; i++ ) {
        var t = gTorpedo.objList[i];
        if (t.active === false) {
            t.fireSfx.play();
            t.angle = gShip.rotation;
            t.distance = 24;
            t.sprite.setPosition(
                gSector.CENTER_X + (Math.sin(t.angle * Math.PI/180) * t.distance),
                gSector.CENTER_Y - (Math.cos(t.angle * Math.PI/180) * t.distance));
            t.sprite.setRotation(t.angle);
            t.active = true;
            t.sprite.show();
            break;
        }
    }
};

/*************************************************/
gTorpedo.doExplosion = function(index) {
    var t = gTorpedo.objList[index];
    t.explosionSfx.play();
    var sprite = t.explosionSprite;
    sprite.setRotation(Math.floor(Math.random() * 360));
    sprite.setAnimActions(true);
    sprite.setPosition(t.sprite.x, t.sprite.y);
    sprite.setCurrentFrame(0);
    sprite.show();
};
