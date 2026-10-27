/*
==============================================================================
SCREEN CREEP EDITOR
==============================================================================

PURPOSE
------------------------------------------------------------------------------

Allows players to create, edit, save, import, export, and share
custom creeps.

Custom creeps become available during gameplay.

All custom creeps are stored inside the current save file.

==============================================================================
SCREEN FLOW
------------------------------------------------------------------------------

screen-manager.js
    |
    +-- Creep Editor
            |
            v
    screen-creepEditor.js
            |
            +-- Creep List
            |
            +-- Creep Editor
            |
            +-- Sprite Editor
            |
            +-- Import Creep
            |
            +-- Export Creep
            |
            +-- Save Creep
            |
            +-- Delete Creep
            |
            +-- Return To Main Hub

==============================================================================
EDITOR SECTIONS
==============================================================================

    Creep Information

    Sprite Editor

    Statistics

    Behavior Rules

    Abilities

==============================================================================
CREEP INFORMATION
==============================================================================

Creep ID

    Randomly Generated

Example

    A7F2K9M8Q4

    T8R3P1X5L9

Purpose

    Prevent duplicate creeps

    Prevent imports overwriting local creeps

    Allow community sharing

    Anonymous by design

No player information is stored.

==============================================================================

Creep Name

    Soldier

    Zombie

    Ghost

    Pumpkin Head

==============================================================================

SPRITE EDITOR
==============================================================================

Player may draw a custom sprite.

Supported Sizes

    8 x 8

    16 x 16

    32 x 32

Tools

    Pencil

    Eraser

    Fill

    Color Picker

Future

    Copy

    Paste

    Mirror

    Rotate

==============================================================================

STATISTICS
==============================================================================

Maximum HP

Maximum Energy

Energy Recovery

Movement Speed

Point Value

Spawn Rate

Maximum Spawn Count

Sprite Width

Sprite Height

==============================================================================

BEHAVIOR RULES
==============================================================================

Rules are evaluated from top to bottom.

If a rule cannot execute,
the next rule is evaluated.

==============================================================================

CR01
Social Behavior

    1 = Seeks Groups

    5 = Neutral

    9 = Avoids Groups

==============================================================================

CR02
Fear Of Light

    1 = Seeks Bright Areas

    5 = Neutral

    9 = Seeks Dark Areas

==============================================================================

CR03
Danger Response

    1 = Approaches Danger

    5 = Neutral

    9 = Flees Danger

==============================================================================

CR04
Navigation Style

    1 = Predictable

    5 = Neutral

    9 = Erratic

==============================================================================

CR05
Energy Expenditure

    1 = Conserves Energy

    5 = Neutral

    9 = Burns Energy

==============================================================================

ABILITIES
==============================================================================

None

Explode On Death

Leave Fire

Leave Gas

Split On Death

Regenerate

Spawn Helpers

Additional abilities may be added later.

==============================================================================

IMPORT / EXPORT
==============================================================================

Custom creeps may be exported as plain text.

Purpose

    Easy Sharing

    Discord

    Twitter / X

    Reddit

    Forums

    Email

    Chat Rooms

==============================================================================

PHOTO BLASTER CREEP FILE FORMAT
==============================================================================

############################################################
PHOTO BLASTER
CUSTOM CREEP FILE
VERSION 1
############################################################

ID=A7F2K9M8Q4

NAME=Zombie Duck

HP=3
ENERGY=2
RECOVERY=1

SPEED=5

POINTS=3

SPAWN_RATE=2
SPAWN_COUNT=10

SOCIAL=8
LIGHT=9
DANGER=2
NAVIGATION=6
ENERGY_USE=7

ABILITY=EXPLODE

SPRITE

00011000
00111100
01111110
11111111
01111110
00111100
00011000

ENDSPRITE

############################################################
END OF PHOTO BLASTER CREEP FILE
############################################################

==============================================================================

IMPORT RULES
==============================================================================

If imported ID already exists:

    Generate New ID

    Import Creep

Never overwrite existing creeps.

==============================================================================

SAVE FILE STRUCTURE
==============================================================================

customCreeps :
[
    {
        id : "A7F2K9M8Q4",

        name : "Zombie Duck",

        sprite : {},

        stats :
        {
            hp : 3,

            energy : 2,

            recovery : 1,

            speed : 5,

            points : 3,

            spawnRate : 2,

            spawnCount : 10,

            width : 2,

            height : 2
        },

        rules :
        {
            social : 8,

            light : 9,

            danger : 2,

            navigation : 6,

            energyUse : 7
        },

        ability : "explode"
    }
]

==============================================================================

SCREEN RESPONSIBILITIES
==============================================================================

Create Creeps

Edit Creeps

Delete Creeps

Draw Sprites

Configure Statistics

Configure Behavior Rules

Configure Abilities

Import Creeps

Export Creeps

Save Creeps

Return To Main Hub

==============================================================================

DOES NOT HANDLE
==============================================================================

Gameplay

Spawning

Combat

Movement

Pathfinding

Damage Logic

The editor only creates creep definitions.

Gameplay systems read those definitions.

==============================================================================
==============================================================================
FUTURE FEATURE
CUSTOM CREEP STORAGE
==============================================================================

Imported creeps should eventually become part of the save file.

Purpose:

    Prevent "creep not found" errors.

    Prevent missing file issues.

    Preserve imported creep collections between sessions.

    Allow players to build personal creep libraries.

------------------------------------------------------------------------------
Recommended Structure

currentSave.customCreeps =
[
    creep01,
    creep02,
    creep03
];

------------------------------------------------------------------------------
Import Process

Import Creep TXT File
        |
        v
Validate ID
        |
        v
Add To currentSave.customCreeps
        |
        v
Save Game

------------------------------------------------------------------------------
Export Process

Player selects creep
        |
        v
Generate TXT file

PHOTO BLASTER
CUSTOM CREEP FILE

------------------------------------------------------------------------------
Design Goals

Imported creeps should be:

    Saved with the save slot.

    Available next session.

    Playable even if the original TXT file
    has been deleted.

------------------------------------------------------------------------------
Important

TXT creep files are for:

    Sharing
    Discord
    Reddit
    Forums
    Social Media

The save file should be considered the
authoritative source during gameplay.

Gameplay should never depend on the
original imported TXT file remaining
on disk.

------------------------------------------------------------------------------
Future Consideration

Allow creep collections to be exported.

Example:

    WW1 Pack
    Zombie Pack
    Vehicle Pack

Enabling players to share groups of
creeps instead of one creep at a time.

==============================================================================
*/


/*
==============================================================================
SCREEN CREEP EDITOR
==============================================================================
*/

/*
==============================================================================
SCREEN CREEP EDITOR
==============================================================================
*/

class ScreenCreepEditor
{
    constructor()
    {
        //--------------------------------------------------
        // background
        //--------------------------------------------------

        this.background = new Image();

        // filename preserved exactly (typo and all) so the
        // asset link doesn't break.

        this.background.src =
            "assets/108-menu_creepEditer.png";

        //--------------------------------------------------
        // identity
        //--------------------------------------------------

        this.creepId = this.generateId();

        //--------------------------------------------------
        // layout constants
        //--------------------------------------------------

        this.gridMaxSize = 20;

        this.spriteEditorX = 470;
        this.spriteEditorY = 220;
        this.spriteEditorSize = 320;

        //--------------------------------------------------
        // sprite data (color matrix system)
        //--------------------------------------------------

        this.sprite = [];

        this.spriteWidth = 2;
        this.spriteHeight = 1;

        this.spriteTool = "PENCIL"; 
        
        // 0 is transparent. 1-14 are colors.

        this.spriteColor = 1; 

        this.colorPalette =
        [
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

        this.isReadOnly = false;
        this.showDefaultDropdown = false;

        //--------------------------------------------------
        // text cursor blink
        //--------------------------------------------------

        this.cursorTimer = 0;
        this.cursorVisible = true;

        //--------------------------------------------------
        // active field
        //--------------------------------------------------

        this.activeField = null;

        //--------------------------------------------------
        // stat fields
        //--------------------------------------------------

        this.fields =
        [
            {
                name      : "NAME",
                value     : "NEW CREEP",
                x         : 200,
                y         : 230,
                w         : 200,
                h         : 30,
                numeric   : false,
                maxLength : 24,
                editing   : false,
                isName    : true
            },
            {
                name      : "SIZE_W",
                value     : "2",
                x         : 260,
                y         : 350,
                w         : 45,
                h         : 30,
                numeric   : true,
                maxLength : 2,
                editing   : false,
                isSizeW   : true
            },
            {
                name      : "SIZE_H",
                value     : "1",
                x         : 315,
                y         : 350,
                w         : 45,
                h         : 30,
                numeric   : true,
                maxLength : 2,
                editing   : false,
                isSizeH   : true
            },
            {
                name      : "HP",
                value     : "1",
                x         : 260,
                y         : 450,
                w         : 100,
                h         : 30,
                numeric   : true,
                maxLength : 2,
                editing   : false
            },
            {
                name      : "MAX_SPEED",
                value     : "3",
                x         : 260,
                y         : 500,
                w         : 100,
                h         : 30,
                numeric   : true,
                maxLength : 2,
                editing   : false
            },
            {
                name      : "FOG",
                value     : "150",
                x         : 260,
                y         : 550,
                w         : 100,
                h         : 30,
                numeric   : true,
                maxLength : 3,
                editing   : false
            },
            {
                name      : "POINTS",
                value     : "1",
                x         : 260,
                y         : 600,
                w         : 100,
                h         : 30,
                numeric   : true,
                maxLength : 2,
                editing   : false
            },
            {
                name      : "SPAWN_RATE",
                value     : "5",
                x         : 260,
                y         : 650,
                w         : 100,
                h         : 30,
                numeric   : true,
                maxLength : 2,
                editing   : false
            },
            {
                name      : "ENERGY",
                value     : "4",
                x         : 260,
                y         : 700,
                w         : 100,
                h         : 30,
                numeric   : true,
                maxLength : 2,
                editing   : false,
                troopOnly : true
            },
            {
                name      : "RECOVERY",
                value     : "1",
                x         : 260,
                y         : 750,
                w         : 100,
                h         : 30,
                numeric   : true,
                maxLength : 2,
                editing   : false,
                troopOnly : true
            },
            {
                name      : "SPAWN_POINTS",
                value     : "4",
                x         : 260,
                y         : 800,
                w         : 100,
                h         : 30,
                numeric   : true,
                maxLength : 1,
                editing   : false
            },
            {
                name      : "CREW",
                value     : "0",
                x         : 1080,
                y         : 740,
                w         : 100,
                h         : 30,
                numeric   : true,
                maxLength : 2,
                editing   : false,
                isCrew    : true
            }
        ];

        //--------------------------------------------------
        // dropdowns
        //--------------------------------------------------

        this.creepTypeOptions =
        [
            "TROOP",
            "VEHICLE"
        ];

        this.creepTypeIndex = 0;

        //--------------------------------------------------
        // game modes
        //--------------------------------------------------

        this.gameModeOptions =
        [
            "AIR ASSAULT",
            "AIR DEFENSE",
            "BOTH"
        ];

        this.gameModeIndex = 0;

        //--------------------------------------------------
        // abilities
        //--------------------------------------------------

        this.abilityOptions =
        [
            { name : "TECHNICIAN", desc : "Can repair vehicles and take over driving if the crew is dead." },
            { name : "STIMULATOR", desc : "Boosts the speed and recovery of nearby troops." },
            { name : "FIRE FIGHTER", desc : "Puts out fires near the creep." },
            { name : "SPOTTER", desc : "Extends the fog of war for nearby troops." },
            { name : "FOGGER", desc : "Drops smoke canisters that obscure an area." },
            { name : "ENGINEER", desc : "Builds shelters that protect against thermobaric bombs." },
            { name : "LINEMAN", desc : "Shares a combined fog of war map with nearby troops." },
            { name : "RANGER", desc : "Can move unseen and hide from enemies." },
            { name : "SMUGGLER", desc : "Can spawn a random creep every 20 seconds." },
            { name : "CHAFF", desc : "Makes proximity-fuse rounds detonate early." },
            { name : "DIGGER (DEF)", desc : "Dig holes for shelter." },
            { name : "INSPIRATION (DEF)", desc : "Can give their stats to nearby soldiers." },
            { name : "CREW INSIDE (DEF)", desc : "Can spawn soldier/paratrooper when destroyed." },
            { name : "SOFT-TARGET (DEF)", desc : "Only proximity fuse can damage." }
        ];
        
        this.abilityIndex = 0;

        //--------------------------------------------------
        // behavior rules
        //--------------------------------------------------

        this.rules =
        [
            {
                key   : "CR1",
                label : "SOCIAL BEHAVIOR",
                low   : "1 = seeks groups",
                high  : "9 = avoids groups",
                value : 5
            },
            {
                key   : "CR2",
                label : "FEAR OF LIGHT",
                low   : "1 = seeks bright areas",
                high  : "9 = seeks dark areas",
                value : 5
            },
            {
                key   : "CR3",
                label : "DANGER RESPONSE",
                low   : "1 = approaches danger",
                high  : "9 = flees danger",
                value : 5
            },
            {
                key   : "CR4",
                label : "NAVIGATION STYLE",
                low   : "1 = predictable",
                high  : "9 = erratic",
                value : 5
            },
            {
                key   : "CR5",
                label : "ENERGY EXPENDITURE",
                low   : "1 = conserves energy",
                high  : "9 = burns energy",
                value : 5
            }
        ];

        //--------------------------------------------------
        // keyboard
        //--------------------------------------------------

        window.addEventListener(
            "keydown",
            (event) =>
            {
                if (this.activeField === null || this.isReadOnly)
                {
                    return;
                }
                
                this.handleKeyDown(event);
            }
        );

        // Handle click-and-drag painting for the sprite grid
        
        this.isPainting = false;

        canvas.addEventListener("mousedown", (e) => {
            if (screenManager.currentScreen !== this) return;

            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            const cellSize = Math.floor(this.spriteEditorSize / Math.max(this.spriteWidth, this.spriteHeight));
            const gridW = this.spriteWidth * cellSize;
            const gridH = this.spriteHeight * cellSize;
            
            const gridX = 470 + Math.floor((420 - gridW) / 2);
            const gridY = this.spriteEditorY + Math.floor((this.spriteEditorSize - gridH) / 2);

            if (mx >= gridX && mx <= gridX + gridW && my >= gridY && my <= gridY + gridH) {
                this.isPainting = true;
                this.paintCell(mx, my);
            }
        });

        canvas.addEventListener("mousemove", (e) => {
            if (!this.isPainting) return;
            const rect = canvas.getBoundingClientRect();
            this.paintCell(e.clientX - rect.left, e.clientY - rect.top);
        });

        canvas.addEventListener("mouseup", () => {
            this.isPainting = false;
        });
        
        canvas.addEventListener("mouseleave", () => {
            this.isPainting = false;
        });

        //--------------------------------------------------
        // initial sprite allocation
        //--------------------------------------------------

        this.resizeSprite(
            this.spriteWidth,
            this.spriteHeight
        );
    }

    //==================================================================
    // ID GENERATION
    //==================================================================

    generateId()
    {
        const chars =
            "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";

        let id = "";

        for (
            let i = 0;
            i < 10;
            i++
        )
        {
            id += chars[
                Math.floor(
                    Math.random() *
                    chars.length
                )
            ];
        }

        return id;
    }

    //==================================================================
    // LOAD DEFAULT / NEW CREEP
    //==================================================================

    loadDefaultCreep(index)
    {
        if (typeof creepTypes === "undefined" || !creepTypes[index]) {
            console.log("Creep data not loaded yet!");
            return;
        }

        const type = creepTypes[index];
        this.isReadOnly = true;
        this.creepId = type.rawId.toUpperCase();
        
        // Fill Stats
        this.fields[0].value = type.name.toUpperCase();
        this.fields[1].value = String(type.sizeW);
        this.fields[2].value = String(type.sizeH);
        this.fields[3].value = String(type.hp);
        this.fields[4].value = String(Math.round(type.maxSpeed * 60));
        this.fields[5].value = String(type.FOW);
        this.fields[6].value = String(type.points);
        this.fields[7].value = String(type.spawnRateSeconds);
        this.fields[8].value = type.energyMax === Infinity ? "0" : String(type.energyMax);
        this.fields[9].value = String(type.recovery);
        this.fields[10].value = String(type.spawnPoints);

        // Fill Rules
        this.rules[0].value = type.CR1;
        this.rules[1].value = type.CR2;
        this.rules[2].value = type.CR3;
        this.rules[3].value = type.CR4;
        this.rules[4].value = type.CR5;

        // Game Mode
        if (type.gm01 && type.gm03) this.gameModeIndex = 2;
        else if (type.gm01) this.gameModeIndex = 0;
        else this.gameModeIndex = 1;

        // Ability
        const abilityStr = (type.fields["ability"] || "").toLowerCase();
        this.abilityIndex = 0;
        for (let i = 0; i < this.abilityOptions.length; i++) {
            if (abilityStr.includes(this.abilityOptions[i].name.toLowerCase().replace(" (def)", ""))) {
                this.abilityIndex = i;
                break;
            }
        }

        // Crew
        const crewField = this.fields.find(f => f.isCrew);
        if (crewField) {
            crewField.value = String(type.spawnOnDeath || 0);
        }

        // Sprite
        this.spriteWidth = type.sizeW;
        this.spriteHeight = type.sizeH;
        if (type.spriteMatrix) {
            this.sprite = JSON.parse(JSON.stringify(type.spriteMatrix));
        } else {
            this.resizeSprite(this.spriteWidth, this.spriteHeight); 
        }

        this.activeField = null;
    }

    newCreep()
    {
        this.isReadOnly = false;
        this.creepId = this.generateId();
        
        const defaults = ["NEW CREEP","2","1","1","3","150","1","5","4","1","4","0"];
        for(let i=0; i<this.fields.length; i++) this.fields[i].value = defaults[i];
        for(let i=0; i<this.rules.length; i++) this.rules[i].value = 5.0;
        
        this.gameModeIndex = 0;
        this.abilityIndex = 0;
        this.resizeSprite(2, 1);
        this.activeField = null;
    }

    //==================================================================
    // SPRITE RESIZE
    //==================================================================

    resizeSprite(newW, newH)
    {
        if (newW < 1) { newW = 1; }
        if (newH < 1) { newH = 1; }

        if (newW > this.gridMaxSize) { newW = this.gridMaxSize; }
        if (newH > this.gridMaxSize) { newH = this.gridMaxSize; }

        const oldSprite = this.sprite;
        const oldW = this.spriteWidth;
        const oldH = this.spriteHeight;

        const next = [];

        for (let y = 0; y < newH; y++)
        {
            const row = [];

            for (let x = 0; x < newW; x++)
            {
                let colorId = 0; // 0 = transparent

                if (
                    oldSprite &&
                    y < oldH &&
                    x < oldW &&
                    oldSprite[y] &&
                    oldSprite[y][x] !== undefined
                )
                {
                    colorId = oldSprite[y][x];
                }

                row.push(colorId);
            }

            next.push(row);
        }

        this.sprite = next;
        this.spriteWidth = newW;
        this.spriteHeight = newH;
    }

    //==================================================================
    // KEY HANDLING
    //==================================================================

    handleKeyDown(event)
    {
        if (this.activeField === null) return;
        const field = this.activeField;

        if (field.troopOnly && this.creepTypeOptions[this.creepTypeIndex] === "VEHICLE") return;

        if (event.key === "Enter" || event.key === "Tab" || event.key === "Escape")
        {
            field.editing = false;
            this.activeField = null;
            return;
        }

        if (event.key === "Backspace")
        {
            if (!field.editing)
            {
                field.value = "";
                field.editing = true;
                return;
            }

            field.value = field.value.slice(0, -1);
            return;
        }

        if (event.key.length !== 1) return;

        if (field.numeric && !/[0-9]/.test(event.key)) return;

        if (!field.editing)
        {
            field.value = "";
            field.editing = true;
        }

        if (field.value.length >= field.maxLength) return;

        field.value += event.key;

        if (field.isSizeW || field.isSizeH)
        {
            this.applySizeChange();
        }
    }

    //==================================================================
    // APPLY SIZE CHANGE
    //==================================================================

    applySizeChange()
    {
        const sizeW = this.fields[1];
        const sizeH = this.fields[2];

        let w = parseInt(sizeW.value, 10);
        let h = parseInt(sizeH.value, 10);

        if (isNaN(w) || w < 1) { w = 1; }
        if (isNaN(h) || h < 1) { h = 1; }

        if (w > this.gridMaxSize)
        {
            w = this.gridMaxSize;
            sizeW.value = String(w);
        }

        if (h > this.gridMaxSize)
        {
            h = this.gridMaxSize;
            sizeH.value = String(h);
        }

        this.resizeSprite(w, h);
    }

    //==================================================================
    // BUILD EXPORT TEXT
    //==================================================================

    buildExportText()
    {
        const lines = [];
        
        lines.push("  custom-creep: " + this.fields[0].value);
        lines.push("    creep-type: " + this.creepTypeOptions[this.creepTypeIndex].toLowerCase());
        lines.push("            hp: " + this.fields[3].value);
        lines.push("     max speed: " + this.fields[4].value + " pixel/s");
        lines.push("      recovery: " + this.fields[9].value + " energy/second");
        lines.push("    fog of war: " + this.fields[5].value + " pixles");
        lines.push("        points: " + this.fields[6].value);
        lines.push("    spawn rate: " + this.fields[7].value + " seconds");
        lines.push("  spawn points: " + this.fields[10].value);
        lines.push("          size: " + this.fields[1].value + " x " + this.fields[2].value + " pixles");
        
        for (const rule of this.rules) {
            lines.push("           " + rule.key + ": " + rule.value.toFixed(1));
        }
        
        lines.push("          GM01: " + (this.gameModeIndex === 0 || this.gameModeIndex === 2 ? "yes" : "no"));
        lines.push("          GM03: " + (this.gameModeIndex === 1 || this.gameModeIndex === 2 ? "yes" : "no"));
        
        const crewField = this.fields.find(f => f.isCrew);
        if (crewField) {
            lines.push("       vehicle: " + crewField.value + " crew");
        }
        
        lines.push("         troop: ability-" + String(this.abilityIndex + 1).padStart(2, "0"));

        // Add Sprite Matrix
        lines.push("");
        lines.push("sprite");
        for (let y = 0; y < this.spriteHeight; y++) {
            lines.push(this.sprite[y].join(";"));
        }
        lines.push("endsprite");

        return lines.join("\n");
    }

    //==================================================================
    // OPEN
    //==================================================================

    open()
    {
        console.log("CREEP EDITOR OPEN");
    }

    //==================================================================
    // UPDATE
    //==================================================================

    update(delta)
    {
        this.cursorTimer += delta;

        if (this.cursorTimer > 0.5)
        {
            this.cursorTimer = 0;
            this.cursorVisible = !this.cursorVisible;
        }

        const click = input.takeClick();

        if (!click) return;

        this.handleClick(click);
    }

    //==================================================================
    // HIT TEST
    //==================================================================

    hitTest(click, x, y, w, h)
    {
        return (
            click.x >= x &&
            click.x <= x + w &&
            click.y >= y &&
            click.y <= y + h
        );
    }

    //==================================================================
    // PAINT CELL (DRAG)
    //==================================================================

    paintCell(mx, my)
    {
        const cellSize = Math.floor(this.spriteEditorSize / Math.max(this.spriteWidth, this.spriteHeight));
        const gridW = this.spriteWidth * cellSize;
        const gridH = this.spriteHeight * cellSize;
        
        const gridX = 470 + Math.floor((420 - gridW) / 2);
        const gridY = this.spriteEditorY + Math.floor((this.spriteEditorSize - gridH) / 2);

        if (mx >= gridX && mx <= gridX + gridW && my >= gridY && my <= gridY + gridH) {
            const cx = Math.floor((mx - gridX) / cellSize);
            const cy = Math.floor((my - gridY) / cellSize);

            if (cy >= 0 && cy < this.spriteHeight && cx >= 0 && cx < this.spriteWidth) {
                if (this.spriteTool === "ERASER") {
                    this.sprite[cy][cx] = 0;
                } else {
                    this.sprite[cy][cx] = this.spriteColor;
                }
            }
        }
    }

    //==================================================================
    // HANDLE CLICK
    //==================================================================

    handleClick(click)
    {
        //--------------------------------------------------
        // 1. HEADQUARTERS
        //--------------------------------------------------

        const hqX = canvas.width - 260;
        const hqY = 20;
        const hqW = 220;
        const hqH = 50;

        if (this.hitTest(click, hqX, hqY, hqW, hqH))
        {
            if (typeof saveManager !== "undefined" && saveManager && typeof saveManager.saveCurrent === "function") {
                saveManager.saveCurrent();
            }

            screenManager.changeScreenByName("hub");
            return;
        }

        //--------------------------------------------------
        // 2. LOAD DEFAULT DROPDOWN
        //--------------------------------------------------
        
        const ddX = 1480;
        const ddY = 380;
        const ddW = 380;
        const ddH = 40;

        // Toggle the dropdown open/closed
        if (this.hitTest(click, ddX, ddY, ddW, ddH)) {
            this.showDefaultDropdown = !this.showDefaultDropdown;
            return;
        }

        // Check clicks on the dropdown list items
        if (this.showDefaultDropdown && typeof creepTypes !== "undefined") {
            for (let i = 0; i < creepTypes.length; i++) {
                const itemY = ddY + ddH + (i * 30);
                
                if (this.hitTest(click, ddX, itemY, ddW, 30)) {
                    this.loadDefaultCreep(i);
                    this.showDefaultDropdown = false;
                    return;
                }
            }
            
            // If clicking anywhere else while open, close it
            this.showDefaultDropdown = false;
            return;
        }

        //--------------------------------------------------
        // 3. READ-ONLY GUARD
        //--------------------------------------------------
        if (this.isReadOnly) {
            return;
        }

        //--------------------------------------------------
        // 4. TYPE DROPDOWN
        //--------------------------------------------------

        if (this.hitTest(click, 260, 290, 140, 30))
        {
            this.creepTypeIndex++;

            if (this.creepTypeIndex >= this.creepTypeOptions.length) {
                this.creepTypeIndex = 0;
            }

            return;
        }

        //--------------------------------------------------
        // 5. GAME MODE DROPDOWN
        //--------------------------------------------------

        if (this.hitTest(click, 260, 395, 140, 30))
        {
            this.gameModeIndex++;

            if (this.gameModeIndex >= this.gameModeOptions.length) {
                this.gameModeIndex = 0;
            }

            return;
        }

        //--------------------------------------------------
        // 6. ABILITY DROPDOWN
        //--------------------------------------------------

        if (this.hitTest(click, 920, 560, 380, 40))
        {
            this.abilityIndex++;

            if (this.abilityIndex >= this.abilityOptions.length) {
                this.abilityIndex = 0;
            }

            return;
        }

        //--------------------------------------------------
        // 7. CR SLIDERS & ARROWS
        //--------------------------------------------------

        const crTrackX = 1010;
        const crTrackW = 320;
        const crRowStartY = 190;
        const crRowH = 80; 

        for (let i = 0; i < this.rules.length; i++)
        {
            const rowY = crRowStartY + i * crRowH;

            // SLIDER HITBOX
            if (this.hitTest(click, crTrackX - 10, rowY - 15, crTrackW + 20, 30))
            {
                const t = (click.x - crTrackX) / crTrackW;
                let v = 1.0 + t * 8.0;
                v = Math.round(v * 10) / 10;

                if (v < 1.0) { v = 1.0; }
                if (v > 9.0) { v = 9.0; }

                this.rules[i].value = v;
                return;
            }

            // UP ARROW
            if (this.hitTest(click, 940, rowY - 15, 40, 24))
            {
                if (i > 0)
                {
                    const tmp = this.rules[i - 1];
                    this.rules[i - 1] = this.rules[i];
                    this.rules[i] = tmp;
                }
                return;
            }

            // DOWN ARROW
            if (this.hitTest(click, 940, rowY + 10, 40, 24))
            {
                if (i < this.rules.length - 1)
                {
                    const tmp = this.rules[i + 1];
                    this.rules[i + 1] = this.rules[i];
                    this.rules[i] = tmp;
                }
                return;
            }
        }

        //--------------------------------------------------
        // 8. SPRITE GRID
        //--------------------------------------------------

        const cellSize = Math.floor(this.spriteEditorSize / Math.max(this.spriteWidth, this.spriteHeight));
        const gridW = this.spriteWidth * cellSize;
        const gridH = this.spriteHeight * cellSize;
        const gridX = 470 + Math.floor((420 - gridW) / 2);
        const gridY = this.spriteEditorY + Math.floor((this.spriteEditorSize - gridH) / 2);

        if (click.x >= gridX && click.x <= gridX + gridW && click.y >= gridY && click.y <= gridY + gridH)
        {
            const cx = Math.floor((click.x - gridX) / cellSize);
            const cy = Math.floor((click.y - gridY) / cellSize);

            if (cy >= 0 && cy < this.spriteHeight && cx >= 0 && cx < this.spriteWidth)
            {
                if (this.spriteTool === "ERASER") {
                    this.sprite[cy][cx] = 0;
                } else {
                    this.sprite[cy][cx] = this.spriteColor;
                }
            }

            return;
        }

        //--------------------------------------------------
        // 9. COLOR PALETTE & TOOLS
        //--------------------------------------------------
        
        const palStartX = 510;
        const palStartY = 700;
        const swatchSize = 35;
        const spacing = 15;

        for (let i = 0; i < 14; i++)
        {
            const row = Math.floor(i / 7);
            const col = i % 7;

            const sx = palStartX + (col * (swatchSize + spacing));
            const sy = palStartY + (row * (swatchSize + spacing));

            if (this.hitTest(click, sx, sy, swatchSize, swatchSize))
            {
                this.spriteColor = i + 1;
                this.spriteTool = "PENCIL";
                return;
            }
        }

        // Eraser
        if (this.hitTest(click, 510, 790, 100, 40))
        {
            this.spriteTool = "ERASER";
            return;
        }

        // Reset
        if (this.hitTest(click, 630, 790, 100, 40))
        {
            for (let y = 0; y < this.spriteHeight; y++) {
                for (let x = 0; x < this.spriteWidth; x++) {
                    this.sprite[y][x] = 0;
                }
            }
            return;
        }

        //--------------------------------------------------
        // 10. TEXT FIELDS
        //--------------------------------------------------

        if (this.activeField !== null && this.activeField.editing) {
            this.activeField.editing = false;
        }

        this.activeField = null;

        for (const field of this.fields)
        {
            if (this.hitTest(click, field.x, field.y, field.w, field.h))
            {
                const type = this.creepTypeOptions[this.creepTypeIndex];

                if (field.troopOnly && type === "VEHICLE") return;
                if (field.isCrew && type === "TROOP") return;

                this.activeField = field;
                return;
            }
        }
    }

    //==================================================================
    // DRAW PANEL
    //==================================================================

    drawPanel(ctx, x, y, w, h, title)
    {
        ctx.strokeStyle = "#d8b46a";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = "#d8c090";
        ctx.font = "20px Georgia";
        ctx.textAlign = "center";
        ctx.fillText(title, x + w / 2, y + 25);
    }

    //==================================================================
    // WRAP TEXT
    //==================================================================

    wrapText(ctx, text, x, y, maxWidth, lineHeight)
    {
        const words = text.split(" ");
        let line = "";
        let drawY = y;

        for (let n = 0; n < words.length; n++)
        {
            const testLine = line + words[n] + " ";
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0)
            {
                ctx.fillText(line, x, drawY);
                line = words[n] + " ";
                drawY += lineHeight;
            }
            else
            {
                line = testLine;
            }
        }

        ctx.fillText(line, x, drawY);
    }

    //==================================================================
    // DRAW TEXT FIELD
    //==================================================================

    drawField(ctx, field)
    {
        let disabled = false;
        const type = this.creepTypeOptions[this.creepTypeIndex];

        if (field.troopOnly && type === "VEHICLE") disabled = true;
        if (field.isCrew && type === "TROOP") disabled = true;

        if (this.activeField === field && !disabled)
        {
            ctx.fillStyle = "rgba(216,180,106,0.18)";
            ctx.fillRect(field.x, field.y, field.w, field.h);
        }

        let borderColor = "#d8b46a";
        if (disabled) borderColor = "#555555";
        else if (this.activeField === field) borderColor = "#f4d18a";

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = (this.activeField === field && !disabled) ? 2 : 1;
        ctx.strokeRect(field.x, field.y, field.w, field.h);

        let text = field.value;
        if (this.activeField === field && this.cursorVisible && !disabled) {
            text += "|";
        }

        ctx.fillStyle = disabled ? "#666666" : "#d8c090";
        ctx.font = "18px Georgia";
        ctx.textAlign = "left";
        ctx.fillText(text, field.x + 8, field.y + 21);
    }

    //==================================================================
    // DRAW
    //==================================================================

    draw(ctx)
    {
        if (this.background && this.background.complete) {
            ctx.drawImage(this.background, 0, 0, canvas.width, canvas.height);
        }

        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //--------------------------------------------------
        // title
        //--------------------------------------------------

        ctx.fillStyle = "#d8b46a";
        ctx.font = "64px Georgia";
        ctx.textAlign = "center";
        ctx.fillText("CREEP EDITOR", canvas.width / 2, 90);

        //--------------------------------------------------
        // headquarters button
        //--------------------------------------------------

        const hqX = canvas.width - 260;
        const hqY = 20;
        const hqW = 220;
        const hqH = 50;

        ctx.fillStyle = "#2a1d10";
        ctx.fillRect(hqX, hqY, hqW, hqH);
        ctx.strokeStyle = "#d8b46a";
        ctx.lineWidth = 2;
        ctx.strokeRect(hqX, hqY, hqW, hqH);

        ctx.fillStyle = "#d8c090";
        ctx.font = "22px Georgia";
        ctx.fillText("HEADQUARTERS", hqX + hqW / 2, hqY + 33);

        //--------------------------------------------------
        // creep data panel (Left)
        //--------------------------------------------------

        this.drawPanel(ctx, 40, 130, 400, 750, "CREEP DATA");

        ctx.fillStyle = "#d8c090";
        ctx.font = "18px Georgia";
        ctx.textAlign = "left";

        ctx.fillText("ID : " + this.creepId, 60, 190);
        ctx.fillText("NAME", 60, 240);
        
        ctx.fillText("TYPE", 60, 310);
        ctx.strokeRect(260, 290, 140, 30);
        ctx.fillText(this.creepTypeOptions[this.creepTypeIndex] + " \u25BC", 270, 312);

        ctx.fillText("SIZE  W / H", 60, 360);

        ctx.fillText("GAME MODE", 60, 415);
        ctx.strokeRect(260, 395, 140, 30); 
        ctx.fillText(this.gameModeOptions[this.gameModeIndex] + " \u25BC", 270, 417);

        //--------------------------------------------------
        // stat labels
        //--------------------------------------------------

        ctx.fillStyle = "#d8c090";
        ctx.font = "18px Georgia";

        ctx.fillText("HIT POINTS", 60, 460);
        
        ctx.fillText("MAX SPEED", 60, 510);
        ctx.font = "14px Georgia";
        ctx.fillStyle = "#a08850";
        ctx.fillText("pixel/s", 370, 510);
        
        ctx.font = "18px Georgia";
        ctx.fillStyle = "#d8c090";
        ctx.fillText("FOG OF WAR", 60, 560);
        ctx.font = "14px Georgia";
        ctx.fillStyle = "#a08850";
        ctx.fillText("pixels", 370, 560);
        
        ctx.font = "18px Georgia";
        ctx.fillStyle = "#d8c090";
        ctx.fillText("POINTS", 60, 610);
        
        ctx.fillText("SPAWN RATE", 60, 660);
        ctx.font = "14px Georgia";
        ctx.fillStyle = "#a08850";
        ctx.fillText("seconds", 370, 660);
        
        ctx.font = "18px Georgia";
        ctx.fillStyle = "#d8c090";
        ctx.fillText("ENERGY", 60, 710);
        ctx.font = "14px Georgia";
        ctx.fillStyle = "#a08850";
        ctx.fillText("seconds", 370, 710);
        
        ctx.font = "18px Georgia";
        ctx.fillStyle = "#d8c090";
        ctx.fillText("RECOVERY", 60, 760);
        ctx.font = "14px Georgia";
        ctx.fillStyle = "#a08850";
        ctx.fillText("energy/s", 370, 760);
        
        ctx.font = "18px Georgia";
        ctx.fillStyle = "#d8c090";
        ctx.fillText("SPAWN POINTS", 60, 810);

        for (let i = 0; i < this.fields.length; i++) {
            this.drawField(ctx, this.fields[i]);
        }

        //--------------------------------------------------
        // sprite editor panel (Center)
        //--------------------------------------------------

        this.drawPanel(ctx, 470, 130, 420, 750, "SPRITE EDITOR");

        const cellSize = Math.floor(this.spriteEditorSize / Math.max(this.spriteWidth, this.spriteHeight));
        const gridW = this.spriteWidth * cellSize;
        const gridH = this.spriteHeight * cellSize;
        const gridX = 470 + Math.floor((420 - gridW) / 2);
        const gridY = this.spriteEditorY + Math.floor((this.spriteEditorSize - gridH) / 2);

        ctx.fillStyle = "#d8c090";
        ctx.font = "18px Georgia";
        ctx.textAlign = "center";

        ctx.fillText(this.spriteWidth + " x " + this.spriteHeight + " PIXELS", gridX + gridW / 2, 200);

        for (let y = 0; y < this.spriteHeight; y++) {
            for (let x = 0; x < this.spriteWidth; x++) {
                const px = gridX + x * cellSize;
                const py = gridY + y * cellSize;
                const colorId = this.sprite[y][x];

                ctx.fillStyle = "rgba(216,192,144,0.08)";
                ctx.fillRect(px, py, cellSize, cellSize);

                if (colorId > 0) {
                    ctx.fillStyle = this.colorPalette[colorId];
                    ctx.fillRect(px, py, cellSize, cellSize);
                }

                ctx.strokeStyle = "#777777";
                ctx.lineWidth = 1;
                ctx.strokeRect(px, py, cellSize, cellSize);
            }
        }

        // movement arrow
        ctx.strokeStyle = "#d8c090";
        ctx.lineWidth = 3;
        const moveX = gridX;
        const moveY = gridY + gridH + 40;

        ctx.beginPath();
        ctx.moveTo(moveX, moveY);
        ctx.lineTo(moveX + 120, moveY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(moveX + 120, moveY);
        ctx.lineTo(moveX + 105, moveY - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(moveX + 120, moveY);
        ctx.lineTo(moveX + 105, moveY + 10);
        ctx.stroke();

        ctx.fillStyle = "#d8c090";
        ctx.font = "18px Georgia";
        ctx.fillText("MOVEMENT", moveX + 60, moveY + 30);

        //--------------------------------------------------
        // color palette
        //--------------------------------------------------
        
        const palStartX = 510;
        const palStartY = 700;
        const swatchSize = 35;
        const spacing = 15;

        for (let i = 0; i < 14; i++) {
            const row = Math.floor(i / 7);
            const col = i % 7;
            const sx = palStartX + (col * (swatchSize + spacing));
            const sy = palStartY + (row * (swatchSize + spacing));

            ctx.fillStyle = this.colorPalette[i + 1];
            ctx.fillRect(sx, sy, swatchSize, swatchSize);

            ctx.strokeStyle = (this.spriteColor === i + 1 && this.spriteTool === "PENCIL") ? "#ffffff" : "#555555";
            ctx.lineWidth = (this.spriteColor === i + 1 && this.spriteTool === "PENCIL") ? 3 : 1;
            ctx.strokeRect(sx, sy, swatchSize, swatchSize);
        }

        const eraserActive = this.spriteTool === "ERASER";
        ctx.strokeStyle = "#d8b46a";
        
        ctx.lineWidth = eraserActive ? 3 : 1;
        ctx.strokeRect(510, 790, 100, 40);
        ctx.lineWidth = 1;
        ctx.strokeRect(630, 790, 100, 40);

        ctx.fillStyle = "#d8c090";
        ctx.font = "18px Georgia";
        ctx.fillText("ERASER", 560, 817);
        ctx.fillText("RESET", 680, 817);

        //--------------------------------------------------
        // behavior rules panel (Right)
        //--------------------------------------------------

        this.drawPanel(ctx, 930, 130, 520, 750, "BEHAVIOR RULES");

        const crTrackX = 1060;
        const crTrackW = 320;
        const crRowStartY = 190;
        const crRowH = 80; 

        ctx.textAlign = "left";

        for (let i = 0; i < this.rules.length; i++) {
            const rule = this.rules[i];
            const rowY = crRowStartY + i * crRowH;

            ctx.strokeStyle = "rgba(216,180,106,0.3)";
            ctx.lineWidth = 1;
            ctx.strokeRect(940, rowY - 20, 40, 48);

            ctx.fillStyle = "#d8b46a";
            ctx.font = "16px Georgia";
            ctx.textAlign = "center";
            ctx.fillText("\u25B2", 960, rowY - 2);
            ctx.fillText("\u25BC", 960, rowY + 22);

            ctx.fillStyle = "#d8c090";
            ctx.font = "16px Georgia";
            ctx.textAlign = "left";
            ctx.fillText(rule.label, crTrackX, rowY - 18);

            ctx.textAlign = "right";
            ctx.fillText(rule.value.toFixed(1), crTrackX + crTrackW, rowY - 18);

            ctx.strokeStyle = "#d8b46a";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(crTrackX, rowY);
            ctx.lineTo(crTrackX + crTrackW, rowY);
            ctx.stroke();

            for (let t = 0; t <= 8; t++) {
                const tx = crTrackX + (t / 8) * crTrackW;
                ctx.beginPath();
                ctx.moveTo(tx, rowY - 5);
                ctx.lineTo(tx, rowY + 5);
                ctx.stroke();
            }

            const markerX = crTrackX + ((rule.value - 1) / 8) * crTrackW;
            ctx.fillStyle = "#3a7cff";
            ctx.fillRect(markerX - 3, rowY - 14, 6, 28);

            const lowWord = rule.low.replace(/^[0-9]\s*=\s*/, "");
            const highWord = rule.high.replace(/^[0-9]\s*=\s*/, "");

            ctx.fillStyle = "#a08850";
            ctx.font = "12px Georgia";
            ctx.textAlign = "left";
            ctx.fillText(lowWord, crTrackX, rowY + 20);
            ctx.textAlign = "right";
            ctx.fillText(highWord, crTrackX + crTrackW, rowY + 20);
        }

        ctx.fillStyle = "#d8c090";
        ctx.font = "18px Georgia";
        ctx.textAlign = "left";

        ctx.fillText("ABILITY", 950, 560);
        ctx.strokeRect(970, 580, 380, 40);
        ctx.fillText(this.abilityOptions[this.abilityIndex].name + " \u25BC", 990, 607);

        ctx.strokeStyle = "#d8b46a";
        ctx.lineWidth = 1;
        ctx.strokeRect(970, 640, 440, 90);

        ctx.fillStyle = "#a08850";
        ctx.font = "14px Georgia";
        ctx.fillText("DESCRIPTION", 980, 662);

        ctx.fillStyle = "#d8c090";
        ctx.font = "15px Georgia";
        this.wrapText(ctx, this.abilityOptions[this.abilityIndex].desc, 980, 688, 420, 20);

        //--------------------------------------------------
        // CREW FIELD (Under Ability)
        //--------------------------------------------------
        
        const crewField = this.fields.find(f => f.isCrew);
        if (crewField) {
            ctx.fillStyle = "#d8c090";
            ctx.font = "18px Georgia";
            ctx.textAlign = "left";
            ctx.fillText("CREW #", 970, 760);
            this.drawField(ctx, crewField);
        }

        //--------------------------------------------------
        // RIGHT SIDE PANELS (Dropdown, Preview, Export)
        //--------------------------------------------------

        const bottomY = 880;
        const ddX = 1480;
        const ddY = 380;
        const ddW = 380;
        const ddH = 40;

        // 1. LOAD DEFAULT DROPDOWN
        ctx.fillStyle = "#2a1d10";
        ctx.fillRect(ddX, ddY, ddW, ddH);
        ctx.strokeStyle = "#d8b46a";
        ctx.lineWidth = 2;
        ctx.strokeRect(ddX, ddY, ddW, ddH);

        ctx.fillStyle = "#d8c090";
        ctx.font = "18px Georgia";
        ctx.textAlign = "center";
        
        let ddLabel = "LOAD DEFAULT CREEP \u25BC";
        if (this.isReadOnly && this.creepId.startsWith("CREEP")) {
            const idx = parseInt(this.creepId.replace("CREEP", "")) - 1;
            if (typeof creepTypes !== "undefined" && creepTypes[idx]) {
                ddLabel = creepTypes[idx].name.toUpperCase() + " \u25BC";
            }
        }
        ctx.fillText(ddLabel, ddX + ddW / 2, ddY + 26);

        // Draw the dropdown list if open
        if (this.showDefaultDropdown && typeof creepTypes !== "undefined") {
            for (let i = 0; i < creepTypes.length; i++) {
                const itemY = ddY + ddH + (i * 30);
                const itemH = 30;

                const hovered = (
                    input.mouseX >= ddX && input.mouseX <= ddX + ddW &&
                    input.mouseY >= itemY && input.mouseY <= itemY + itemH
                );
                
                ctx.fillStyle = hovered ? "#5a4020" : "#1a1108";
                ctx.fillRect(ddX, itemY, ddW, itemH);
                
                ctx.strokeStyle = "#555";
                ctx.lineWidth = 1;
                ctx.strokeRect(ddX, itemY, ddW, itemH);

                ctx.fillStyle = "#d8c090";
                ctx.textAlign = "left";
                ctx.fillText(creepTypes[i].name.toUpperCase(), ddX + 10, itemY + 20);
            }
        }

        // 2. PREVIEW BOX (Top Right)
        const previewH = 220;
        this.drawPanel(ctx, 1480, ddY - 10 - previewH, 380, previewH, "PREVIEW");
        ctx.fillStyle = "#a08850";
        ctx.font = "14px Georgia";
        ctx.textAlign = "center";
        ctx.fillText("(Preview coming soon)", 1670, ddY - 10 - previewH + 110);

        // 3. EXPORT/IMPORT TEXT BOX (Bottom Right)
        const fixedExportY = 450;
        
        this.drawPanel(ctx, 1480, fixedExportY, 380, 430, "EXPORT / IMPORT TEXT");
        
        const fileText = this.buildExportText();
        const lines = fileText.split("\n");
        
        ctx.fillStyle = "#88ff88";
        ctx.font = "12px monospace";
        ctx.textAlign = "left";
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(1490, fixedExportY + 30, 360, 390);
        ctx.clip();
        
        for (let i = 0; i < Math.min(lines.length, 25); i++) {
            ctx.fillText(lines[i], 1490, fixedExportY + 50 + (i * 15));
        }
        ctx.restore();
    }
}

const screenCreepEditor =
    new ScreenCreepEditor();