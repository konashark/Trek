window.addEventListener("load", jglApp, false);

var jgl = null;
var MODE = {
    INTRO: 1,
    MAPVIEW: 2,
    END: 4
};

var g = {
    mode: MODE.MAPVIEW
};

//g = Object.assign(g, {});

function jglApp() {
    jgl = new Jgl;

    // Init sub-modules
    sector.init();
    sector.init();

    // Kick off the main animation loop
    setTimeout(function() {
        gameLoop();
    }, 500);
}

/*************************************************/
function gameLoop() {
    // Tell the sub-modules to draw if active
    if (g.mode & MODE.MAPVIEW) {
        sector.draw();
    }

    window.requestAnimFrame(gameLoop);
}
