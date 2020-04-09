var gShip = {
    sprite: undefined,
    MAX_THRUST: 100,
    x: gSector.MAP_WIDTH_PIXELS / 2 + 128, y: gSector.MAP_HEIGHT_PIXELS / 2 - 64,
    targetThrust: 0,
    thrust: 0,
    targetRotation: 0,
    rotation: 0,
    rotationSpeed: 0,
    radians: 0,
    firing: false,
    jumping: false,
    orbit: {
        states: {
            READY: 0,
            IN_PROGRESS: 1,
            ORBITING: 2
        },
        state: 0,
        distance: 0,
        angle: 0
    },

};

/*************************************************/
gShip.enterOrbit = function() {
    // ORBIT
    if (gShip.orbit.state !== gShip.orbit.states.READY) {
        console.log("TBD: Orbit cancelled");
        gShip.orbit.state = gShip.orbit.states.READY;
        gShip.targetThrust = gShip.thrust = 10;
        return;
    }
    var data = gMap.currentSector();
    if (!data.planet) {
        console.log("TBD: There is no planet in this sector!");
        return;
    }
    // Are we close enough?
    var dist = jgl.distance(gShip.x, gShip.y, gSector.SECTOR_CENTER_COORD, gSector.SECTOR_CENTER_COORD);
    console.log("Distance: " + dist);
    if (dist < 132 || dist > 200) {
        console.log("TBD: Out of range for orbit");
        return;
    }
    gShip.orbit.state = gShip.orbit.states.IN_PROGRESS;
    gShip.orbit.angle = jgl.rectToPolar(gSector.SECTOR_CENTER_COORD, gSector.SECTOR_CENTER_COORD, gShip.x, gShip.y).angle;
    gShip.targetRotation = (gShip.orbit.angle + 90) % 360;
    gShip.orbit.distance = dist;
};

/*************************************************/
gShip.prepOrbit = function() {
    if (gShip.doRotation()) {
        gShip.sprite.setRotation(gShip.rotation);
    } else {
        gShip.orbit.state = gShip.orbit.states.ORBITING;
    }
};

/*************************************************/
gShip.doOrbit = function() {
    gShip.orbit.angle  = (gShip.orbit.angle + .15) % 360;

    gShip.targetRotation = gShip.rotation = (gShip.orbit.angle + 90) % 360;
    gShip.sprite.setRotation(gShip.rotation);

    gShip.radians = gShip.orbit.angle * Math.PI/180;
    gShip.x = gSector.SECTOR_CENTER_COORD + (Math.sin(gShip.radians)) * (gShip.orbit.distance);
    gShip.y = gSector.SECTOR_CENTER_COORD - (Math.cos(gShip.radians)) * (gShip.orbit.distance);

    gSector.setMapCoordinates(gShip.x, gShip.y);
};

/*************************************************/
gShip.doRotation = function() {
    var delta = gShip.targetRotation.toFixed(1) - gShip.rotation.toFixed(1);

    if (delta) {
        if (delta > 180) {
            gShip.rotation -= 1;
        } else if (delta < -180) {
            gShip.rotation += 1;
        } else if (delta > 0) {
            gShip.rotation += 1;
        } else {
            gShip.rotation -= 1;
        }

        if (gShip.rotation < 0) {
            gShip.rotation += 360;
        }
        if (gShip.rotation > 360) {
            gShip.rotation -= 360;
        }
    }

    return Math.floor(delta);
};

/*************************************************/
gShip.init = function() {
    gShip.sprite = gSector.spriteList.newSprite({id: 'ship', width: 64, height: 64, image: './images/enterprise_sprite.png'});
    gShip.sprite.setPosition(gSector.CENTER_X, gSector.CENTER_Y);
    gShip.sprite.setRotation(gShip.rotation);
    gShip.sprite.setHotSpot(64 / 2, 64 / 2);
};

/*************************************************/
gShip.update = function() {

    gShip.processKeys();
    if (gShip.orbit.state) {
        if (gShip.orbit.state === gShip.orbit.states.IN_PROGRESS) {
            gShip.prepOrbit();
        }
        if (gShip.orbit.state === gShip.orbit.states.ORBITING) {
            gShip.doOrbit();
        }
        return;
    }

    // ROTATION
    // Turn ship towards the target rotation position
    if (gShip.doRotation()) {
        if (gShip.targetThrust < 25 && !gShip.autoBrake) {
            gShip.autoBrake = gShip.targetThrust || 1;
            gShip.targetThrust = 25;
        }
    } else {
        // If ship was turning and now it's not, reset the original speed
        if (gShip.autoBrake) {
            gShip.autoBrake = 0;
        }
    }

    gShip.radians = gShip.rotation * Math.PI/180;
    gShip.sprite.setRotation(gShip.rotation);

    // SPEED
    if (gShip.targetThrust > gShip.thrust) {
        gShip.thrust += 1;
    } else if (gShip.targetThrust < gShip.thrust) {
        gShip.thrust -= 1;
    }

    if (gShip.thrust < 0) {
        gShip.thrust = 0;
    }

    // Update our ship's position
    gShip.x += (Math.sin(gShip.radians) / 4) * (gShip.thrust / 10);
    gShip.y -= (Math.cos(gShip.radians) / 4) * (gShip.thrust / 10);

    // Keep us within the map's universe
    if (gShip.y > gSector.MAP_HEIGHT_PIXELS + (gSector.TILE_SIZE * 1.5)) {
        gShip.y = gSector.MAP_HEIGHT_PIXELS + (gSector.TILE_SIZE * 1.5);
    } else if (gShip.y < (gSector.TILE_SIZE * 2.5)) {
        gShip.y = gSector.TILE_SIZE * 2.5;
    }
    if (gShip.x > gSector.MAP_WIDTH_PIXELS + (gSector.TILE_SIZE * 3)) {
        gShip.x = gSector.MAP_WIDTH_PIXELS + (gSector.TILE_SIZE * 3);
    } else if (gShip.x < (gSector.TILE_SIZE * 4)) {
        gShip.x = gSector.TILE_SIZE * 4;
    }

    // Set Map layer to be positioned relative to our centered ship
    gSector.setMapCoordinates(gShip.x, gShip.y);
};

/*************************************************/
gShip.processKeys = function() {
    if (g.mode & MODE.LRS) {
        return;
    }

    gShields.active = jgl.KEY_STATE[jgl.KEYS.FORWARD_SLASH];

    // Is the player rotating?
    if (jgl.KEY_STATE[jgl.KEYS.LEFT]){
        gNavOvly.active = true;
        gShip.targetRotation -= 3;
        if (gShip.targetRotation < 0) {
            gShip.targetRotation += 360;
        }
    } else if (jgl.KEY_STATE[jgl.KEYS.RIGHT]){
        gNavOvly.active = true;
        gShip.targetRotation += 3;
        if (gShip.targetRotation > 360) {
            gShip.targetRotation -= 360;
        }
    } else {
        if (gShip.targetRotation === gShip.rotation)
            gNavOvly.active = false;
    }

    if (jgl.KEY_STATE[jgl.KEYS.SPACE]) {
        if (!gShip.firing) {
            gTorpedo.fire();
            gShip.firing = true;
        }
    } else {
        gShip.firing = false;
    }

    // Is the player accelerating?
    if (jgl.KEY_STATE[jgl.KEYS.UP]) {
        if (gShip.targetThrust < gShip.MAX_THRUST) {
            gShip.targetThrust += 1;
        }
    }

    if (jgl.KEY_STATE[jgl.KEYS.DOWN]) {
        gShip.targetThrust -= 1;
        if (gShip.targetThrust < 0) {
            gShip.targetThrust = 0;
        }
    }

    if (jgl.KEY_STATE[jgl.KEYS.N0]) {
        gShip.targetThrust = 0;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N1]) {
        gShip.targetThrust = 10;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N2]) {
        gShip.targetThrust = 20;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N3]) {
        gShip.targetThrust = 30;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N4]) {
        gShip.targetThrust = 40;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N5]) {
        gShip.targetThrust = 50;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N6]) {
        gShip.targetThrust = 60;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N7]) {
        gShip.targetThrust = 70;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N8]) {
        gShip.targetThrust = 80;
    }
    if (jgl.KEY_STATE[jgl.KEYS.N9]) {
        gShip.targetThrust = 90;
    }

};

