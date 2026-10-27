// =====================================================
// CREEP FILE LOADER
// =====================================================

const CREEP_FILE_PATH =
    "200-creep_file.txt";

let creepTypes = [];
let creepTypesReady = false;

// --------------------------------
// GAME MODES
// --------------------------------
// GM2 retired - bomber (GM1) and
// anti-aircraft (GM3) only, so
// gravity always lines up with the
// viewing direction.

const GAME_MODES =
[
    "gm01",
    "gm03"
];

let gameModeIndex = 0;

let ACTIVE_GAME_MODE =
    GAME_MODES[0];

// --------------------------------
// MODE BUTTON
// --------------------------------

const gameModeBtn =
    document.getElementById(
        "gameModeBtn"
    );

gameModeBtn.addEventListener(
    "click",
    () =>
    {
        gameModeIndex =
            (gameModeIndex + 1) %
            GAME_MODES.length;

        ACTIVE_GAME_MODE =
            GAME_MODES[gameModeIndex];

        if(
            typeof refreshWeaponsForMode ===
            "function"
        )
        {
            refreshWeaponsForMode();
        }

        gameModeBtn.textContent =
            "Mode: " +
            ACTIVE_GAME_MODE.toUpperCase();

        creeps.length = 0;

        if(creepTypesReady)
        {
            for(const type of creepTypes)
            {
                type.spawnCounter = 0;
            }
        }
    }
);

// --------------------------------
// LOAD FILE
// --------------------------------

// ======================= REPLACE FROM HERE =======================
let defaultSprites = {};

fetch("201-custom_creep_file.txt")
    .then(res => res.text())
    .then(text => {
        let currentCreep = null;
        let matrix = [];
        const lines = text.split(/\r?\n/);

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("creep") && line.includes(": sprite")) {
                currentCreep = parseInt(line.replace("creep", "").replace(": sprite", "")) - 1;
                matrix = [];
            } else if (currentCreep !== null && line !== "") {
                if (line.includes("=") || line.includes("abilities")) {
                    if (matrix.length > 0) defaultSprites[currentCreep] = matrix;
                    currentCreep = null;
                } else {
                    matrix.push(line.split(";").map(Number));
                }
            }
        }
        if (currentCreep !== null && matrix.length > 0) {
            defaultSprites[currentCreep] = matrix;
        }
        
        // Now that sprites are loaded, load the main creep file
        return fetch(CREEP_FILE_PATH);
    })
    .then(res => res.text())
    .then(text => {
        creepTypes = parseCreepFile(text);
        creepTypesReady = true;
        console.log("loaded creep types & matrices:", creepTypes.length);
    })
    .catch(err => console.error("failed to load creep files", err));
// ======================= REPLACE TO HERE =======================

// --------------------------------
// FIRST NUMBER
// --------------------------------

function firstNumber(
    str,
    fallback
)
{
    if(!str)
    {
        return fallback;
    }

    const match =
        str.match(
            /-?\d+(\.\d+)?/
        );

    return match
        ? parseFloat(match[0])
        : fallback;
}

// --------------------------------
// SIZE PARSER
// --------------------------------

function parseSize(
    str,
    fallbackW,
    fallbackH
)
{
    if(!str)
    {
        return {
            w: fallbackW,
            h: fallbackH
        };
    }

    const match =
        str.match(
            /(\d+(\.\d+)?)\s*x\s*(\d+(\.\d+)?)/i
        );

    if(!match)
    {
        return {
            w: fallbackW,
            h: fallbackH
        };
    }

    return {
        w: parseFloat(match[1]),
        h: parseFloat(match[3])
    };
}

// --------------------------------
// ABILITY PARSER
// --------------------------------

function parseSpawnOnDeath(str)
{
    if(!str)
    {
        return 0;
    }

    const match =
        str.match(
            /spawn\s+(\d+)\s+solder/i
        );

    return match
        ? parseInt(match[1], 10)
        : 0;
}

// --------------------------------
// SHARED SPAWN POINTS PARSER
// --------------------------------

function parseSpawnWith(str)
{
    if(!str)
    {
        return null;
    }

    const match =
        str.match(
            /spawns?\s+(?:with|same\s+as)\s+(creep\d+)/i
        );

    return match
        ? match[1].toLowerCase()
        : null;
}

// --------------------------------
// COLORS
// --------------------------------

const COLOR_PALETTE =
[
    "red",
    "cyan",
    "lime",
    "yellow",
    "magenta",
    "orange",
    "dodgerblue",
    "white",
    "hotpink",
    "lightgreen"
];

// --------------------------------
// CREEP FILE PARSER
// --------------------------------

function parseCreepFile(text)
{
    const lines =
        text.split(/\r?\n/);

    const types = [];

    let current = null;

    let inCreepSection = false;

    for(const rawLine of lines)
    {
        const line = rawLine.trim();

        if(line === "")
        {
            continue;
        }

        if(/^=+$/.test(line))
        {
            continue;
        }

        if(/^CREEP_TYPES/i.test(line))
        {
            inCreepSection = true;
            continue;
        }

        if(/^GAME MODES/i.test(line))
        {
            inCreepSection = false;
            continue;
        }

        if(!inCreepSection)
        {
            continue;
        }

        const header =
            line.match(
                /^creep(\d+)\s*:\s*(.+)$/i
            );

        if(header)
        {
            if(current)
            {
                types.push(current);
            }

            current =
            {
                index: types.length,

                rawId:
                    "creep" + header[1],

                name:
                    header[2].trim(),

                fields: {}
            };

            continue;
        }

        if(current)
        {
            const kv =
                line.match(
                    /^([A-Za-z0-9 ]+?)\s*:\s*(.+)$/
                );

            if(kv)
            {
                const key =
                    kv[1].trim().toLowerCase();

                const value =
                    kv[2].trim();

                current.fields[key] = value;
            }
        }
    }

    if(current)
    {
        types.push(current);
    }

    return types.map(
        (t, i) =>
        {
            const f = t.fields;

            const size =
                parseSize(f["size"], 2, 1);

            const maxSpeed =
                firstNumber(f["max speed"], 3);

            const energyMax =
                f["energy"] !== undefined
                    ? firstNumber(f["energy"], 8)
                    : Infinity;

            const gm01Flag =
                /^yes/i.test(f["gm01"] || "");

            const gm03Flag =
                /^yes/i.test(f["gm03"] || "");

			// ======================= REPLACE FROM HERE =======================
            return {
                key: "t" + i,

                rawId: t.rawId,

                name: t.name,

                // Attach the default matrix if it exists
                spriteMatrix: defaultSprites[i] || null,
// ======================= REPLACE TO HERE =======================

                hp:
                    firstNumber(f["hp"], 1),

                points:
                    firstNumber(f["points"], 1),

                maxSpeed:
                    maxSpeed / 60,

                FOW:
                    firstNumber(
                        f["fog of war"],
                        150
                    ),

                energyMax: energyMax,

                recovery:
                    firstNumber(f["recovery"], 1),

                spawnRateSeconds:
                    firstNumber(f["spawn rate"], 5),

                spawnPoints:
                    firstNumber(f["spawn points"], 1),

                sizeW: size.w,

                sizeH: size.h,

                CR1:
                    firstNumber(f["cr1"], 2),

                CR2:
                    firstNumber(f["cr2"], 2),

                CR3:
                    firstNumber(f["cr3"], 2),

                CR4:
                    firstNumber(f["cr4"], 2),

                CR5:
                    firstNumber(f["cr5"], 2),

                gm01: gm01Flag,

                gm03: gm03Flag,

                // --------------------
                // WIND
                // --------------------
                // GM3-exclusive creeps are airborne
                // (paratroopers, planes, blimps) - they
                // get pushed by wind. GM1 ground units
                // (soldiers, vehicles) don't, even if a
                // creep type happens to be flagged for
                // both modes, since that's a ground-first
                // design and wind only makes sense once
                // something's actually in the air.

                windAffected:
                    gm03Flag && !gm01Flag,

                spawnOnDeath:
                    parseSpawnOnDeath(f["ability"]),

                spawnWithId:
                    parseSpawnWith(f["ability"]),

                color:
                    COLOR_PALETTE[i % COLOR_PALETTE.length],

                spawnCounter: 0
            };
        }
    );
}
/*

==============================================================================
FUTURE FEATURE - MATRIX SPRITE RENDERING
==============================================================================

Paste these variables and function into draw.js when the new UI is ready.

const GAME_COLOR_PALETTE = [
    "#00000000", // 0: Transparent
    "#00ff00",   // 1: Lime
    "#ff0000",   // 2: Red
    "#00ffff",   // 3: Cyan
    "#0000ff",   // 4: Blue
    "#ffa500",   // 5: Orange
    "#8b4513",   // 6: SaddleBrown
    "#ffff00",   // 7: Yellow
    "#ffd700",   // 8: Gold
    "#cd853f",   // 9: Peru
    "#add8e6",   // 10: LightBlue
    "#c0c0c0",   // 11: Silver
    "#808080",   // 12: Gray
    "#ffffff",   // 13: White
    "#000000"    // 14: Black
];

function drawCreepMatrix(c)
{
    if (!c.spriteMatrix || c.spriteMatrix.length === 0) {
        ctx.fillStyle = "magenta"; // Error color
        ctx.fillRect(c.x - 2, c.y - 2, 4, 4);
        return;
    }

    ctx.save();
    ctx.translate(c.x, c.y);
    
    const cols = c.spriteMatrix[0].length;
    const rows = c.spriteMatrix.length;
    
    ctx.rotate(c.angle + Math.PI / 2);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const colorId = c.spriteMatrix[y][x];
            if (colorId > 0) {
                ctx.fillStyle = GAME_COLOR_PALETTE[colorId];
                ctx.fillRect(
                    x - (cols / 2), 
                    y - (rows / 2), 
                    1, 
                    1
                );
            }
        }
    }

    ctx.restore();
}

==============================================================================
*/
