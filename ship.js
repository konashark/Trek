var ship = {
    sprite: undefined,
    x: sector.MAP_WIDTH_PIXELS / 2, y: sector.MAP_HEIGHT_PIXELS / 2,
    targetThrust: 0,
    thrust: 0,
    targetRotation: 0,
    rotation: 0,
    rotationSpeed: 0,
    radians: 0,
    firing: false,
    jumping: false
};

/*************************************************/
ship.init = function() {
    ship.sprite = sector.spriteList.newSprite({id: 'ship', width: 64, height: 64, image: './images/enterprise_sprite.png'});
    ship.sprite.setPosition(sector.CENTER_X, sector.CENTER_Y);
    ship.sprite.setRotation(ship.rotation);
    ship.sprite.setHotSpot(64 / 2, 64 / 2);
};

/*************************************************/
ship.update = function() {

    ship.processKeys();

    // ROTATION
    // Turn ship towards the target rotation position
    var delta = ship.targetRotation.toFixed(1) - ship.rotation.toFixed(1);

    if (delta) {
        if (ship.targetThrust < 25 && !ship.autoBrake) {
            ship.autoBrake = ship.targetThrust || 1;
            ship.targetThrust = 25;
        }
        if (delta  > 180) {
            ship.rotation -= 1;
        } else if (delta < -180) {
            ship.rotation += 1;
        } else if (delta > 0)  {
            ship.rotation += 1;
        } else {
            ship.rotation -= 1;
        }

        if (ship.rotation < 0) {
            ship.rotation += 360;
        }
        if (ship.rotation > 360) {
            ship.rotation -= 360;
        }
    } else {
        // If ship was turning and now it's not, reset the original speed
        if (ship.autoBrake) {
            //ship.targetThrust = ship.autoBrake;
            ship.autoBrake = 0;
        }
    }
    ship.radians = ship.rotation * Math.PI/180;
    ship.sprite.setRotation(ship.rotation);

    // SPEED
    if (ship.targetThrust > ship.thrust) {
        ship.thrust += 1;
    } else if (ship.targetThrust < ship.thrust) {
        ship.thrust -= 1;
    }

    if (ship.thrust < 0) {
        ship.thrust = 0;
    }

    // Update our ship's position
    ship.x += (Math.sin(ship.radians) / 4) * (ship.thrust / 10);
    ship.y -= (Math.cos(ship.radians) / 4) * (ship.thrust / 10);

    // Keep us within the map's universe
    if (ship.y > sector.MAP_HEIGHT_PIXELS + (sector.TILE_SIZE * 1.5)) {
        ship.y = sector.MAP_HEIGHT_PIXELS + (sector.TILE_SIZE * 1.5);
    } else if (ship.y < (sector.TILE_SIZE * 2.5)) {
        ship.y = sector.TILE_SIZE * 2.5;
    }
    if (ship.x > sector.MAP_WIDTH_PIXELS + (sector.TILE_SIZE * 3)) {
        ship.x = sector.MAP_WIDTH_PIXELS + (sector.TILE_SIZE * 3);
    } else if (ship.x < (sector.TILE_SIZE * 4)) {
        ship.x = sector.TILE_SIZE * 4;
    }

    // Set Map layer to be positioned relative to our centered ship
    sector.mapX = ship.x - sector.CENTER_X; //448;
    sector.mapY = ship.y - sector.CENTER_Y; //228;
};

/*************************************************/
ship.processKeys = function() {
    shields.active = jgl.KEY_STATE[jgl.KEYS.FORWARD_SLASH];

    // Is the player rotating?
    if (jgl.KEY_STATE[jgl.KEYS.LEFT]){
        navOv.active = true;
        ship.targetRotation -= 3;
        if (ship.targetRotation < 0) {
            ship.targetRotation += 360;
        }
    } else if (jgl.KEY_STATE[jgl.KEYS.RIGHT]){
        navOv.active = true;
        ship.targetRotation += 3;
        if (ship.targetRotation > 360) {
            ship.targetRotation -= 360;
        }
    } else {
        if (ship.targetRotation === ship.rotation)
            navOv.active = false;
    }

    if (jgl.KEY_STATE[jgl.KEYS.SPACE]) {
        if (!ship.firing) {
            torpedo.fire();
            ship.firing = true;
        }
    } else {
        ship.firing = false;
    }

    // Is the player accelerating?
    if (jgl.KEY_STATE[jgl.KEYS.UP]) {
        if (ship.targetThrust < sector.MAX_THRUST) {
            ship.targetThrust += 1;
        }
    }

    if (jgl.KEY_STATE[jgl.KEYS.DOWN]) {
        ship.targetThrust -= 1;
        if (ship.targetThrust < 0) {
            ship.targetThrust = 0;
        }
    }

    if (jgl.KEY_STATE[jgl.KEYS.N0]) {
        ship.targetThrust = 0;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N1]) {
        ship.targetThrust = 10;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N2]) {
        ship.targetThrust = 20;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N3]) {
        ship.targetThrust = 30;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N4]) {
        ship.targetThrust = 40;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N5]) {
        ship.targetThrust = 50;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N6]) {
        ship.targetThrust = 60;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N7]) {
        ship.targetThrust = 70;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N8]) {
        ship.targetThrust = 80;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N9]) {
        ship.targetThrust = 90;
    }

    if (jgl.KEY_STATE[jgl.KEYS.H]) {
        if (!ship.jumping) {
            ship.jumping = true;
            $(".hyperjump").css("width", $("#viewscreen")[0].width+"px");
            $(".hyperjump").css("height", $("#viewscreen")[0].height+"px");
            $('.hyperjump').css('display','block');
            setTimeout(function () {
                $('.hyperjump').css('display', 'none');
                ship.jumping = false;
            }, 13000);
        }
    }

};

