var ship = {
    sprite: undefined,
    MAX_THRUST: 100,
    x: sector.MAP_WIDTH_PIXELS / 2 + 128, y: sector.MAP_HEIGHT_PIXELS / 2 - 64,
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
ship.enterOrbit = function() {
    // ORBIT
    if (ship.orbit.state !== ship.orbit.states.READY) {
        console.log("TBD: Orbit cancelled");
        ship.orbit.state = ship.orbit.states.READY;
        ship.targetThrust = ship.thrust = 10;
        return;
    }
    var data = gmap.currentSector();
    if (!data.planet) {
        console.log("TBD: There is no planet in this sector!");
        return;
    }
    // Are we close enough?
    var dist = jgl.distance(ship.x, ship.y, sector.SECTOR_CENTER_COORD, sector.SECTOR_CENTER_COORD);
    console.log("Distance: " + dist);
    if (dist < 132 || dist > 200) {
        console.log("TBD: Out of range for orbit");
        return;
    }
    ship.orbit.state = ship.orbit.states.IN_PROGRESS;
    ship.orbit.angle = jgl.rectToPolar(sector.SECTOR_CENTER_COORD, sector.SECTOR_CENTER_COORD, ship.x, ship.y).angle;
    ship.targetRotation = (ship.orbit.angle + 90) % 360;
    ship.orbit.distance = dist;
};

/*************************************************/
ship.prepOrbit = function() {
    if (ship.doRotation()) {
        ship.sprite.setRotation(ship.rotation);
    } else {
        ship.orbit.state = ship.orbit.states.ORBITING;
    }
};

/*************************************************/
ship.doOrbit = function() {
    ship.orbit.angle  = (ship.orbit.angle + .15) % 360;

    ship.targetRotation = ship.rotation = (ship.orbit.angle + 90) % 360;
    ship.sprite.setRotation(ship.rotation);

    ship.radians = ship.orbit.angle * Math.PI/180;
    ship.x = sector.SECTOR_CENTER_COORD + (Math.sin(ship.radians)) * (ship.orbit.distance);
    ship.y = sector.SECTOR_CENTER_COORD - (Math.cos(ship.radians)) * (ship.orbit.distance);

    sector.mapX = ship.x - sector.CENTER_X;
    sector.mapY = ship.y - sector.CENTER_Y;
};

/*************************************************/
ship.doRotation = function() {
    var delta = ship.targetRotation.toFixed(1) - ship.rotation.toFixed(1);

    if (delta) {
        if (delta > 180) {
            ship.rotation -= 1;
        } else if (delta < -180) {
            ship.rotation += 1;
        } else if (delta > 0) {
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
    }

    return delta;
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
    if (ship.orbit.state) {
        if (ship.orbit.state === ship.orbit.states.IN_PROGRESS) {
            ship.prepOrbit();
        }
        if (ship.orbit.state === ship.orbit.states.ORBITING) {
            ship.doOrbit();
        }
        return;
    }

    // ROTATION
    // Turn ship towards the target rotation position
    if (ship.doRotation()) {
        if (ship.targetThrust < 25 && !ship.autoBrake) {
            ship.autoBrake = ship.targetThrust || 1;
            ship.targetThrust = 25;
        }
    } else {
        // If ship was turning and now it's not, reset the original speed
        if (ship.autoBrake) {
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
    if (g.mode & MODE.LRS) {
        return;
    }

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
        if (ship.targetThrust < ship.MAX_THRUST) {
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

};

