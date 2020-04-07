var gShipstatus = {
    canvas: undefined,
    context: undefined,
    ENERGY: 0,
    SHIELDS: 1,
    PHASERS: 2,
    TORPEDOES: 3,
    WARPDRIVE: 4,
    COMPUTER: 5,
    LIFESUPPORT: 6,

    systems: [
        {
            name: "ENERGY",
            max: 1000000,
            level: 1000000
        },
        {
            name: "SHIELD",
            max: 100,
            level: 100
        },
        {
            name: "PHASER",
            max: 64,
            level: 64
        },
        {
            name: "TORPS",
            max: 64,
            level: 64
        },
        {
            name: "WARPDR",
            max: 100,
            level: 100
        },
        {
            name: "COMPUTR",
            max: 100,
            level: 100
        },
        {
            name: "LIFESUP",
            max: 100,
            level: 100
        },
    ],
    alertLevel: 0,
    ALERT_LEVELS: [
        {
            name: "GREEN",
            color: "#080",
            text: "#090"
        },
        {
            name: "YELLOW",
            color: "#B90",
            text: "#FFF"
        },
        {
            name: "RED",
            color: "#900",
            text: "#FFF"
        },
    ],
    numJumps: 0
};

/*************************************************/
gShipstatus.init = function() {
    gShipstatus.canvas = $("#statuscanvas")[0];
    gShipstatus.context = gShipstatus.canvas.getContext("2d");
};

/*************************************************/
gShipstatus.draw = function() {
    var ctx = gShipstatus.context;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,260,260);

    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(0,0,260,260);

    ctx.font = "15px sans-serif";
    ctx.fillStyle = "#FC0";
    ctx.fillText("STATUS", 16, 22);

    ctx.fillStyle = "white";
    ctx.fillText("MTIME: " + (g.missionTime/60).toFixed(0)+":" + (g.missionTime % 60), 112, 22);

    var y = 56, tab = 22;

    var gradient = ctx.createLinearGradient(112, 0, 232, 0);
    gradient.addColorStop(0, "#800");
    gradient.addColorStop(.4, "#CA0");
    gradient.addColorStop(1, "#0C0");


    gShipstatus.systems.forEach(function(system, index) {
        ctx.fillStyle = "#48F";
        ctx.fillText(system.name, 16, y);

        ctx.fillStyle = "#333";
        ctx.fillRect(112, y - 10, 120, 9);

        ctx.fillStyle = gradient;
        ctx.fillRect(112, y - 10, (system.level / system.max) * 120, 9);

        y+=tab;
    });

    ctx.font = "30px sans-serif";
    ctx.fillStyle = gShipstatus.ALERT_LEVELS[gShipstatus.alertLevel].color;
    ctx.fillRect(40, 208, 180, 40);
    ctx.strokeStyle = "#CCC";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 208, 180, 40);
    ctx.fillStyle = gShipstatus.ALERT_LEVELS[gShipstatus.alertLevel].text;
    ctx.fillText("ALERT", 82, 238);

};

