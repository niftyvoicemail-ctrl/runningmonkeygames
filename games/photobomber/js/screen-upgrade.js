/*
==============================================================================
SCREEN UPGRADE
==============================================================================

PURPOSE
------------------------------------------------------------------------------

Allows the player to spend upgrade points earned through gameplay.

All upgrades are saved to the current save slot.

Changes take effect immediately when entering gameplay.

==============================================================================
SCREEN FLOW
------------------------------------------------------------------------------

screen-manager.js
    |
    +-- Upgrades
            |
            v
    screen-upgrade.js
            |
            +-- Weapon Upgrades
            |
            +-- Ammo Upgrades
            |
            +-- Back
            |
            +-- Return To Main Hub

==============================================================================
WEAPON UPGRADE SYSTEM
------------------------------------------------------------------------------

Each weapon receives:

    Upgrade Path A
    Upgrade Path B

Each path contains:

    Level 0
    Level 1
    Level 2
    Level 3
    Level 4

Level 0 = Default Weapon

Maximum Upgrade Level = 4

==============================================================================
WEAPON 01
Machine Gun
------------------------------------------------------------------------------

Path A
    Barrel Count

        Level 1
        Level 2
        Level 3
        Level 4

Path B
    Magazine Capacity

        Level 1
        Level 2
        Level 3
        Level 4

==============================================================================
WEAPON 02
Howitzer
------------------------------------------------------------------------------

Path A
    Damage Multiplier

        Level 1
        Level 2
        Level 3
        Level 4

Path B
    Magazine Capacity

        Level 1
        Level 2
        Level 3
        Level 4

==============================================================================
WEAPON 03
Gravity Bomb
------------------------------------------------------------------------------

Path A
    Bomb Size Multiplier

        Level 1
        Level 2
        Level 3
        Level 4

Path B
    Bomb Bay Count

        Level 1
        Level 2
        Level 3
        Level 4

==============================================================================
AMMO UPGRADE SYSTEM
------------------------------------------------------------------------------

Ammo upgrades affect all compatible weapons.

Each ammo type receives:

    Damage Path

    Effect Path

Each path contains:

    Level 0
    Level 1
    Level 2
    Level 3
    Level 4

==============================================================================
ARMOR PIERCING AMMO
------------------------------------------------------------------------------

Path A

    Damage Multiplier

Path B

    Special Effect Multiplier

==============================================================================
FRAGMENTATION AMMO
------------------------------------------------------------------------------

Path A

    Damage Multiplier

Path B

    Splash Effect Multiplier

==============================================================================
INCENDIARY AMMO
------------------------------------------------------------------------------

Path A

    Damage Multiplier

Path B

    Fire Effect Multiplier

==============================================================================
SAVE FILE DATA
------------------------------------------------------------------------------

Example

upgrades :
{
    machineGun :
    {
        barrelCount : 0,
        magazineSize : 0
    },

    howitzer :
    {
        damage : 0,
        magazineSize : 0
    },

    gravityBomb :
    {
        bombSize : 0,
        bombBays : 0
    },

    ammo :
    {
        armorPiercing :
        {
            damage : 0,
            effect : 0
        },

        fragmentation :
        {
            damage : 0,
            effect : 0
        },

        incendiary :
        {
            damage : 0,
            effect : 0
        }
    }
}

==============================================================================
SCREEN RESPONSIBILITIES
------------------------------------------------------------------------------

Display Available Upgrades

Display Current Upgrade Levels

Purchase Upgrades

Save Upgrade Data

Return To Main Hub

==============================================================================
DOES NOT HANDLE
------------------------------------------------------------------------------

Gameplay Logic

Weapon Logic

Ammo Logic

Damage Calculations

Upgrade screen only changes saved upgrade values.

Gameplay systems read those values.

==============================================================================
UPGRADE SCREEN CONCEPT
==============================================================================

This screen is designed as a WW1 experimental weapons laboratory.

The Upgrade Screen is NOT intended to feel like a traditional RPG
upgrade tree or spreadsheet.

The player interacts with physical instruments.

==============================================================================
LAYOUT
==============================================================================

Background

    105-menu_upgrade.png

Top Left

    Available Upgrades Counter

        AVAILABLE : 0

        AVAILABLE : 1

        AVAILABLE : INFINITE

Top Center

    UPGRADES

Top Right

    HEADQUARTERS

------------------------------------------------------------------------------

Weapons displayed on left.

Ammo displayed on right.

15 upgrade paths displayed simultaneously.

No submenus.

No scrolling.

No nested upgrade trees.

==============================================================================

WEAPON UPGRADE PATHS
==============================================================================

Machine Gun Barrels

Machine Gun Magazine

Cannon Barrel

Cannon Magazine

Gravity Bomb Size

Gravity Bomb Bays

==============================================================================

AMMO UPGRADE PATHS
==============================================================================

Armor Piercing Bullets

Fragmentation Bullets

Incendiary Bullets

Armor Piercing Shells

Fragmentation Shells

Incendiary Shells

High Explosive Bomb

Thermobaric Bomb

Cluster Bomb

==============================================================================

MERCURY TUBE SYSTEM
==============================================================================

Each upgrade path is represented by a vertical glass tube.

Each tube contains:

    Glass Tube

    Air Bubble

    Mercury Column

    Calibration Marks

    Leather Bladder Pump

Upgrade Levels

    Level 1

        Bladder Level

    Level 2

        Mark 1

    Level 3

        Mark 2

    Level 4

        Mark 3

    Level 5

        Mark 4

Mercury rises as the player upgrades.

Full tube represents maximum upgrade level.

==============================================================================

PLAYER INTERACTION
==============================================================================

Player clicks the bladder pump.

If upgrade available:

    Mercury rises.

    Upgrade level increases.

    Pump sound plays.

If tube is full:

    No action.

    Upgrade level remains unchanged.

==============================================================================

VISUAL DESIGN
==============================================================================

Glass Tube

    White / Silver

Mercury

    Metallic Silver

Calibration Marks

    Brass / Gold

Bladder Pump

    Brown Leather

Labels

    Brass Plaque Style

The screen should resemble laboratory instrumentation rather than
a software menu.

==============================================================================

UPGRADE AVAILABILITY
==============================================================================

Temporary Development Mode

    Infinite Upgrades Available

Allows testing of:

    Mercury Levels

    Tube Layout

    Bladder Interaction

    Upgrade Saving

Future Release Version

    Upgrade availability supplied by:

        screen-badgeRoom.js

==============================================================================

BADGE ROOM INTEGRATION
==============================================================================

The Badge Room determines:

    Rank

    Promotion Requirements

    Upgrade Availability

    Career Progress

When a promotion goal is completed:

    Available Upgrades Increase

Example

    Major

        100,000 Fire Kills

    General

        1,000,000 High Explosive Kills

The Upgrade Screen spends upgrades.

The Badge Room earns upgrades.

==============================================================================

LOADOUT INTEGRATION
==============================================================================

Upgrade tubes directly affect available options within:

    screen-loadout.js

Examples

    Machine Gun Barrels

        Unlock additional barrel loadout rows.

    Gravity Bomb Bays

        Unlock additional bomb bay loadout rows.

    Machine Gun Magazine

        Changes reload performance.

    Cannon Magazine

        Changes reload performance.

==============================================================================

SAVE FILE DATA
==============================================================================

Each tube stores a level.

Example

upgrades :
{
    machineGunBarrels : 3,

    machineGunMagazine : 2,

    cannonBarrel : 4,

    cannonMagazine : 2,

    gravityBombSize : 1,

    gravityBombBays : 3
}

Stored inside current save slot.

==============================================================================

FUTURE FEATURES
==============================================================================

Animated Mercury Movement

Animated Air Bubbles

Pumping Animation

Brass Plate Labels

Upgrade Completion Indicators

Rank Requirement Indicators

==============================================================================
*/


class ScreenUpgrade extends MenuScreen
{
    constructor()
    {
        super("UPGRADES");

        this.background =
            new Image();

        this.background.src =
            "assets/105-menu_upgrade.png";

        this.background.onload = () =>
        {
            console.log(
                "UPGRADE BACKGROUND LOADED"
            );
        };

        this.background.onerror = () =>
        {
            console.log(
                "UPGRADE BACKGROUND FAILED"
            );
        };

        this.tubes =
        [
            // Weapons

            "MACHINE GUN BARRELS",
            "MACHINE GUN MAGAZINE",

            "CANNON BARREL",
            "CANNON MAGAZINE",

            "GRAVITY BOMB SIZE",
            "GRAVITY BOMB BAYS",

            // Ammo

            "ARMOR PIERCING BULLETS",
            "FRAGMENTATION BULLETS",
            "INCENDIARY BULLETS",

            "ARMOR PIERCING SHELLS",
            "FRAGMENTATION SHELLS",
            "INCENDIARY SHELLS",

            "HIGH EXPLOSIVE BOMB",
            "THERMOBARIC BOMB",
            "CLUSTER BOMB"
        ];

        this.levels =
    new Array(15).fill(1);

// bladder hit locations

this.bladders = [];

this.background.onerror = () =>
{
    console.log(
        "UPGRADE BACKGROUND FAILED"
    );
};
}
// end

//------------------------------------------------------------------
// update
//------------------------------------------------------------------

update(delta)
{
    const click =
        input.takeClick();

    if (!click)
    {
        return;
    }
	
	const hqX =
    canvas.width - 260;

const hqY =
    40;

const hqW =
    220;

const hqH =
    50;

if (
    click.x >= hqX &&
    click.x <= hqX + hqW &&
    click.y >= hqY &&
    click.y <= hqY + hqH
)
{
    
	currentSave.upgrades.machineGunBarrels =
    this.levels[0];

currentSave.upgrades.machineGunMagazine =
    this.levels[1];

currentSave.upgrades.cannonBarrel =
    this.levels[2];

currentSave.upgrades.cannonMagazine =
    this.levels[3];

currentSave.upgrades.gravityBombSize =
    this.levels[4];

currentSave.upgrades.gravityBombBays =
    this.levels[5];

currentSave.upgrades.armorPiercingBullets =
    this.levels[6];

currentSave.upgrades.fragmentationBullets =
    this.levels[7];

currentSave.upgrades.incendiaryBullets =
    this.levels[8];

currentSave.upgrades.armorPiercingShells =
    this.levels[9];

currentSave.upgrades.fragmentationShells =
    this.levels[10];

currentSave.upgrades.incendiaryShells =
    this.levels[11];

currentSave.upgrades.highExplosiveBomb =
    this.levels[12];

currentSave.upgrades.thermobaricBomb =
    this.levels[13];

currentSave.upgrades.clusterBomb =
    this.levels[14];
// end
	
	saveManager.saveCurrent();

screenManager.changeScreenByName(
    "hub"
);
// end

    return;
}

    for (
        let i = 0;
        i < this.bladders.length;
        i++
    )
    {
        const b =
            this.bladders[i];

        const dist =
            Math.hypot(
                click.x - b.x,
                click.y - b.y
            );

        if (
            dist < b.radius &&
            this.levels[i] < 5
        )
        {
            this.levels[i]++;

            soundManager.playSound(
                "105-bladder-pump.wav",
                1.0
            );

            console.log(
                this.tubes[i],
                this.levels[i]
            );
        }
    }
}
// end

    //------------------------------------------------------------------
    // draw
    //------------------------------------------------------------------

draw(ctx)
{

	
    if (
        this.background &&
        this.background.complete
    )
    {
        ctx.drawImage(
            this.background,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    else
    {
        ctx.fillStyle =
            "#111111";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    ctx.fillStyle =
        "rgba(0,0,0,0.75)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
	ctx.fillStyle =
    "#d8b46a";

ctx.font =
    "28px Georgia";

ctx.textAlign =
    "left";

ctx.fillText(
    "AVAILABLE : INFINITE",
    40,
    60
);

   
//--------------------------------------
// HEADQUARTERS BUTTON
//--------------------------------------

const hqX =
    canvas.width - 260;

const hqY =
    20;

const hqW =
    220;

const hqH =
    50;

ctx.fillStyle =
    "#2a1d10";

ctx.fillRect(
    hqX,
    hqY,
    hqW,
    hqH
);

ctx.strokeStyle =
    "#d8b46a";

ctx.lineWidth = 2;

ctx.strokeRect(
    hqX,
    hqY,
    hqW,
    hqH
);

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "22px Georgia";

ctx.textAlign =
    "center";

ctx.fillText(
    "HEADQUARTERS",
    hqX + hqW / 2,
    hqY + 33
);
//end

//--------------------------------------------------
// ALL TUBES
//--------------------------------------------------

const y = 140;

const startX = 120;

const tubeSpacing = 115;

for (
    let i = 0;
    i < this.tubes.length;
    i++
)
{
    const x =
        startX +
        (
            i *
            tubeSpacing
        );
		
let level =
    this.levels[i];	

const tubeWidth = 24;
const tubeHeight = 750;

//--------------------------------------
// air bubble
//--------------------------------------

ctx.strokeStyle =
    "#d0d0d0";

ctx.lineWidth = 3;

ctx.beginPath();

ctx.arc(
    x + tubeWidth / 2,
    y - 20,
    24,
    0,
    Math.PI * 2
);

ctx.stroke();

//--------------------------------------
// glass tube
//--------------------------------------

ctx.strokeRect(
    x,
    y,
    tubeWidth,
    tubeHeight
);

//--------------------------------------
// level marks
//--------------------------------------

for(
    let mark = 1;
    mark <= 4;
    mark++
)
{
    const markY =
        y +
        tubeHeight -
        (
            mark *
            (tubeHeight / 4)
        );

    ctx.strokeStyle =
        "#b89040";

    ctx.beginPath();

    ctx.moveTo(
        x - 12,
        markY
    );

    ctx.lineTo(
        x + tubeWidth + 12,
        markY
    );

    ctx.stroke();
}

//--------------------------------------
// mercury
//--------------------------------------


const levelHeights =
[
    242,
    430,
    620,
    805
];


const mercuryHeight =
    levelHeights[
        Math.max(
            0,
            level - 1
        )
    ];

// fill from bottom of screen upward

ctx.fillStyle =
    "#9da3a8";

ctx.fillRect(
    x + 3,
    canvas.height,
    tubeWidth - 6,
    -mercuryHeight
);

// mercury highlight

ctx.fillStyle =
    "rgba(255,255,255,0.35)";

ctx.fillRect(
    x + 5,
    canvas.height,
    4,
    -mercuryHeight
);

//--------------------------------------
// bladder pump
//--------------------------------------

const bladderX =
    x + tubeWidth / 2;

const bladderY =
    canvas.height - 60;
	this.bladders[i] =
{
    x: bladderX,
    y: bladderY,
    radius: 32
};
// end

const hover =
    Math.hypot(
        input.mouseX - bladderX,
        input.mouseY - bladderY
    ) < 32;


// leather body

ctx.fillStyle =
    hover
        ? "#d0a36d"
        : "#b58a5a";

ctx.beginPath();

ctx.arc(
    bladderX,
    bladderY,
    28,
    0,
    Math.PI * 2
);

ctx.fill();

// outer ring

ctx.strokeStyle =
    "#8a633d";

ctx.lineWidth = 2;

ctx.beginPath();

ctx.arc(
    bladderX,
    bladderY,
    18,
    0,
    Math.PI * 2
);

ctx.stroke();

// inner ring

ctx.beginPath();

ctx.arc(
    bladderX,
    bladderY,
    10,
    0,
    Math.PI * 2
);

ctx.stroke();

// center cap

ctx.beginPath();

ctx.arc(
    bladderX,
    bladderY,
    4,
    0,
    Math.PI * 2
);

ctx.fillStyle =
    "#8a633d";

ctx.fill();

//--------------------------------------
// label
//--------------------------------------



//--------------------------------------
// vertical label
//--------------------------------------

ctx.save();

ctx.translate(
    x - 20,
    canvas.height - 120
);

ctx.rotate(
    -Math.PI / 2
);


ctx.font =
    "18px Georgia";

ctx.textAlign =
    "left";

ctx.fillText(
    this.tubes[i],
    0,
    0
);

ctx.restore();

} // end tube loop

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "18px Georgia";


super.draw(ctx);
}
//end

//------------------------------------------------------------------
// open
//------------------------------------------------------------------

    open()
    {
		if (
    currentSave &&
    currentSave.upgrades
)
{
    this.levels =
    [
        currentSave.upgrades.machineGunBarrels,
        currentSave.upgrades.machineGunMagazine,

        currentSave.upgrades.cannonBarrel,
        currentSave.upgrades.cannonMagazine,

        currentSave.upgrades.gravityBombSize,
        currentSave.upgrades.gravityBombBays,

        currentSave.upgrades.armorPiercingBullets,
        currentSave.upgrades.fragmentationBullets,
        currentSave.upgrades.incendiaryBullets,

        currentSave.upgrades.armorPiercingShells,
        currentSave.upgrades.fragmentationShells,
        currentSave.upgrades.incendiaryShells,

        currentSave.upgrades.highExplosiveBomb,
        currentSave.upgrades.thermobaricBomb,
        currentSave.upgrades.clusterBomb
    ];
}
// end
        console.log(
            "UPGRADE OPEN"
        );

        this.setLines([]);

        this.setButtons([]);
    }
} 

const screenUpgrade = new ScreenUpgrade();