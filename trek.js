window.addEventListener("load", jglApp, false);

var jgl = null;
var g = g || {};
g = Object.assign(g, {
});

function jglApp() {
    jgl = new Jgl;

    // Init sub-modules
    map.init();

    // Kick off the main animation loop
    gameLoop();
}

/*************************************************/
function gameLoop() {
    // Tell the sub-modules to draw if active
    map.draw();

    window.requestAnimFrame(gameLoop);
}
