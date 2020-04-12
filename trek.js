window.addEventListener("load", jglApp, false);

var jgl = new Jgl;
var MODE = {
    INTRO: 1,
    MAPVIEW: 2,
    LRS: 4,
    END: 64
};

var g = {
    paused: false,
    mute: true,
    mode: MODE.MAPVIEW,
    missionTime: 0,
    bridgeAudio: undefined
};

//g = Object.assign(g, {});

function jglApp() {
    // Init sub-modules
    gSector.init();
    gMap.init();
    gSrs.init();
    gLrs.init();
    gComm.init();
    gInfo.init();
    gShipstatus.init();
    gEnemy.init();

    g.bridgeAudio = new Audio('./sounds/bridgebackground.mp3');
    $("body").on("keydown", function () {
        g.bridgeAudio.loop = true;
//        g.bridgeAudio.play();
        $("body").off("keydown");
    });


    document.addEventListener("keydown", function (ev) {
        //console.log("KEY: ", ev.keyCode);
        if(ev.keyCode === jgl.KEYS.P){
            g.paused = !g.paused;
        }

        if (ev.keyCode === jgl.KEYS.L) {
            if (g.mode & MODE.LRS) {
                g.mode &= (~MODE.LRS);
                $("#lrscanvas").css('display','none');
            } else {
                g.mode |= MODE.LRS;
                $("#lrscanvas").css('display','block');
            }
        }

        if(ev.keyCode === jgl.KEYS.O){
            gShip.enterOrbit();
        }

        if(ev.keyCode === jgl.KEYS.M){
            g.mute = !g.mute;
            if (g.mute) {
                g.bridgeAudio.pause();
            } else {
                g.bridgeAudio.play();
            }
        }
    });


    // Kick off the main animation loop
    setTimeout(function() {
        gameLoop();
    }, 500);
}

/*************************************************/
function gameLoop() {
    // Tell the sub-modules to draw if active
    if (!g.paused && g.mode & MODE.MAPVIEW) {
        gSector.draw();
        g.missionTime++;

        // These elements don't need to update at 60fps, so throttle
        if (g.missionTime%10 === 0) {
            gSrs.draw();
            if (g.mode & MODE.LRS) {
                gLrs.draw();
            }
            gShipstatus.draw();
        }
        // Every 5 seconds, update the enemy fleet locations
        if (g.missionTime%300 === 0) {
            gEnemy.updateFleetPosition();
        }
    }

    window.requestAnimFrame(gameLoop);
}
