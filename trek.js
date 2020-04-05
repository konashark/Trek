window.addEventListener("load", jglApp, false);

var jgl = undefined;
var MODE = {
    INTRO: 1,
    MAPVIEW: 2,
    LRS: 4,
    END: 64
};

var g = {
    paused: false,
    mode: MODE.MAPVIEW,
    missionTime: 0
};

//g = Object.assign(g, {});

function jglApp() {
    jgl = new Jgl;

    // Init sub-modules
    sector.init();
    map.init();
    srs.init();
    lrs.init();
    shipstatus.init();

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
        sector.draw();
        g.missionTime++;

        // These elements don't need to update at 60fps, so throttle
        if (g.missionTime%5 === 0) {
            srs.draw();
            if (g.mode & MODE.LRS) {
                lrs.draw();
            }
            shipstatus.draw();
        }
    }

    window.requestAnimFrame(gameLoop);
}
