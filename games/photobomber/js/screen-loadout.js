/*
==============================================================================
SCREEN LOADOUT
==============================================================================

PURPOSE
------------------------------------------------------------------------------

Configure weapon and ammunition loadouts.

Allows the player to assign ammunition types to:

    Machine Gun Barrels

    Howitzer Barrels

    Gravity Bomb Bays

Allows custom firing patterns.

All settings are saved to the current save slot.

==============================================================================
SCREEN FLOW
------------------------------------------------------------------------------

screen-manager.js
    |
    +-- Loadout
            |
            v
    screen-loadout.js
            |
            +-- Machine Gun
            |
            +-- Howitzer
            |
            +-- Gravity Bomb
            |
            +-- Return To Main Hub

==============================================================================
AVAILABLE AMMO TYPES
------------------------------------------------------------------------------

Machine Gun

    Armor Piercing

    Fragmentation

    Incendiary

------------------------------------------------------------------------------
Howitzer

    Armor Piercing Shell

------------------------------------------------------------------------------
Gravity Bomb

    High Explosive

    Thermobaric

==============================================================================
MACHINE GUN LOADOUT
------------------------------------------------------------------------------

Supports:

    1 Barrel

    2 Barrels

    3 Barrels

    4 Barrels

Barrel count is determined by upgrades.

==============================================================================
SINGLE BARREL MODE
------------------------------------------------------------------------------

The player may build a repeating ammunition pattern.

Example

    Round 1
        Armor Piercing

    Round 2
        Fragmentation

    Round 3
        Fragmentation

    Round 4
        Incendiary

Result

    AP
    FRAG
    FRAG
    FIRE

    AP
    FRAG
    FRAG
    FIRE

    AP
    FRAG
    FRAG
    FIRE

Pattern repeats forever.

==============================================================================
MULTI BARREL MODE
------------------------------------------------------------------------------

Each barrel may be configured independently.

Example

    Barrel 1
        Armor Piercing

    Barrel 2
        Fragmentation

    Barrel 3
        Incendiary

    Barrel 4
        Fragmentation

Every volley fires all assigned ammunition types.

==============================================================================
HOWITZER LOADOUT
------------------------------------------------------------------------------

Supports:

    1 Barrel

    2 Barrels

    3 Barrels

    4 Barrels

Barrel count determined by upgrades.

------------------------------------------------------------------------------
Single Barrel

    Repeating ammunition pattern.

------------------------------------------------------------------------------
Multi Barrel

    Individual shells assigned per barrel.

==============================================================================
GRAVITY BOMB LOADOUT
------------------------------------------------------------------------------

Supports:

    1 Bomb Bay

    2 Bomb Bays

    3 Bomb Bays

    4 Bomb Bays

Bomb bay count determined by upgrades.

------------------------------------------------------------------------------
Single Bomb Bay

    Repeating bomb pattern.

Example

        High Explosive
        High Explosive
        Thermobaric

        Repeat

------------------------------------------------------------------------------
Multi Bomb Bay

    Individual bomb assignment.

Example

        Bay 1
            High Explosive

        Bay 2
            Thermobaric

        Bay 3
            High Explosive

        Bay 4
            Thermobaric

==============================================================================
SAVE FILE DATA
------------------------------------------------------------------------------

Example

loadout :
{
    machineGun :
    {
        pattern :
        [
            "armorPiercing",
            "fragmentation",
            "fragmentation",
            "incendiary"
        ]
    },

    howitzer :
    {
        pattern :
        [
            "armorPiercingShell"
        ]
    },

    gravityBomb :
    {
        pattern :
        [
            "highExplosive",
            "thermobaric"
        ]
    }
}

------------------------------------------------------------------------------
Example 4 Barrel Machine Gun

loadout :
{
    machineGun :
    {
        barrel01 : "armorPiercing",
        barrel02 : "fragmentation",
        barrel03 : "incendiary",
        barrel04 : "fragmentation"
    }
}

==============================================================================
FUTURE FEATURES
------------------------------------------------------------------------------

Save Multiple Presets

    Assault

    Firestorm

    Siege

    Custom

------------------------------------------------------------------------------
Randomized Patterns

------------------------------------------------------------------------------
Quick Swap Loadouts

------------------------------------------------------------------------------
Import / Export Loadouts

==============================================================================
SCREEN RESPONSIBILITIES
------------------------------------------------------------------------------

Display Current Weapon Configuration

Display Available Ammunition

Edit Ammunition Patterns

Edit Barrel Assignments

Edit Bomb Bay Assignments

Save Loadout Configuration

Return To Main Hub

==============================================================================
DOES NOT HANDLE
------------------------------------------------------------------------------

Weapon Logic

Ammo Logic

Damage Logic

Upgrade Logic

Gameplay Logic

Only edits loadout data.

==============================================================================
==============================================================================
LOADOUT IDENTIFIERS
------------------------------------------------------------------------------
<br>

Each ammunition slot receives a permanent identifier.

Format:

    WW-B#-A#

Where:

    WW = Weapon

        MG = Machine Gun

        CA = Cannon

        GB = Gravity Bomb

    B# = Barrel / Bay Number

    A# = Ammo Position

Examples

    MG-B1-A1

        Machine Gun
        Barrel 1
        Ammo Position 1

    MG-B2-A4

        Machine Gun
        Barrel 2
        Ammo Position 4

    CA-B1-A3

        Cannon
        Barrel 1
        Ammo Position 3

    GB-B4-A2

        Gravity Bomb
        Bay 4
        Ammo Position 2

Identifiers never change.

Ammo assigned to the slot may change.

Identifier remains constant.

==============================================================================
LOADOUT SAVE DATA
------------------------------------------------------------------------------
<br>

Loadouts are stored inside the save slot.

Example

loadout :
{
    machineGun :
    [
        {
            id : "MG-B1-A1",
            ammo : "AP"
        },

        {
            id : "MG-B1-A2",
            ammo : "FRAG"
        },

        {
            id : "MG-B1-A3",
            ammo : "FIRE"
        },

        {
            id : "MG-B1-A4",
            ammo : "AP"
        }
    ],

    cannon :
    [
        {
            id : "CA-B1-A1",
            ammo : "AP"
        },

        {
            id : "CA-B1-A2",
            ammo : "FRAG"
        },

        {
            id : "CA-B1-A3",
            ammo : "FIRE"
        },

        {
            id : "CA-B1-A4",
            ammo : "AP"
        }
    ],

    gravityBomb :
    [
        {
            id : "GB-B1-A1",
            ammo : "HE"
        },

        {
            id : "GB-B1-A2",
            ammo : "CLUSTER"
        },

        {
            id : "GB-B1-A3",
            ammo : "THERMO"
        },

        {
            id : "GB-B1-A4",
            ammo : "HE"
        }
    ]
}

==============================================================================
GAMEPLAY USE
------------------------------------------------------------------------------
<br>

Gameplay does not search by identifier.

Gameplay reads ammunition arrays directly.

Identifiers exist for:

    Save Files

    Loadout Editing

    Debugging

    Future Import / Export Features

Example

    MG-B1-A3

may contain:

    AP

or

    FRAG

or

    FIRE

Gameplay reads:

    ammo

Save systems read:

    id

This keeps gameplay fast while maintaining a stable save format.

==============================================================================
LOADOUT SCREEN RESPONSIBILITY
------------------------------------------------------------------------------
<br>

Loadout Screen may:

    Change ammunition type

    Save ammunition type

    Display ammunition type

Loadout Screen does not:

    Spawn projectiles

    Select projectile behavior

    Apply damage

Gameplay systems read saved loadout data.

==============================================================================
*/

class ScreenLoadout
{
    constructor()
    {
        this.background =
            new Image();

        this.background.src =
            "assets/106-menu_loadout.png";

    this.background.onload = () =>
    {
        console.log(
            "LOADOUT BACKGROUND LOADED"
        );
    };

    this.background.onerror = () =>
    {
        console.log(
            "LOADOUT BACKGROUND FAILED"
        );
    };

    this.ammoButtons = [];

    this.machineGunAmmo =
[
    ["AP","AP","AP","AP"],

    ["AP","AP","AP","AP"],

    ["AP","AP","AP","AP"],

    ["AP","AP","AP","AP"]
];
// end

    this.cannonAmmo =
[
    "AP",
    "AP",
    "AP",
    "AP"
];
// end

   this.bombAmmo =
[
    ["HE","HE","HE","HE"],

    ["HE","HE","HE","HE"],

    ["HE","HE","HE","HE"],

    ["HE","HE","HE","HE"]
];
// end

//--------------------------------------------------
// selected ammo description
//--------------------------------------------------

        this.selectedAmmo =
            "HE";
			
			this.ammoColors =
[
    "AP",
    "FRAG",
    "FIRE"
];

this.bombColors =
[
    "HE",
    "CLUSTER",
    "THERMO"
];
// end

}
// end

//------------------------------------------------------------------
// ammo color
//------------------------------------------------------------------

getAmmoColor(ammo)
{
    switch(ammo)
    {
        case "AP":
        case "HE":
            return "#d8b46a";

        case "FRAG":
        case "CLUSTER":
            return "#5078d8";

        case "FIRE":
        case "THERMO":
            return "#d85050";
    }

    return "#888888";
}
// end 

//------------------------------------------------------------------
// ammo description
//------------------------------------------------------------------

getAmmoDescription(ammo)
{
    switch(ammo)
    {
        case "AP":
            return "ARMOR PIERCING - penetrates targets and vehicle crews.";

        case "FRAG":
            return "FRAGMENTATION - area effect ammunition for grouped targets.";

        case "FIRE":
            return "INCENDIARY - effective for starting fires.";

        case "HE":
            return "HIGH EXPLOSIVE BOMB - general purpose ordnance.";

        case "THERMO":
            return "THERMOBARIC BOMB - effective against sheltered targets.";

        case "CLUSTER":
            return "CLUSTER BOMB - disperses multiple sub-munitions.";

        default:
            return "";
    }
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

    //--------------------------------------------------
    // headquarters
    //--------------------------------------------------

    const hqX =
        canvas.width - 260;

    const hqY =
        20;

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
      if (currentSave)
{
    currentSave.loadout =
    {
        machineGun :
            this.machineGunAmmo,

        cannon :
            this.cannonAmmo,

        gravityBomb :
            this.bombAmmo
    };

    saveManager.saveCurrent();
}

screenManager.changeScreenByName(
    "hub"
);
// end  

        return;
    }

    //--------------------------------------------------
    // ammo icons
    //--------------------------------------------------

    for (
        let i = 0;
        i < this.ammoButtons.length;
        i++
    )
    {
        const b =
            this.ammoButtons[i];

        if (
    click.x >= b.x &&
    click.x <= b.x + b.w &&
    click.y >= b.y &&
    click.y <= b.y + b.h
)
{
    console.log(
        "CLICKED",
        b
    );

    switch (b.ammo)
{
    case "AP":
        b.ammo = "FRAG";
        break;

    case "FRAG":
        b.ammo = "FIRE";
        break;

    case "FIRE":
        b.ammo = "AP";
        break;

    case "HE":
        b.ammo = "CLUSTER";
        break;

    case "CLUSTER":
        b.ammo = "THERMO";
        break;

    case "THERMO":
        b.ammo = "HE";
        break;
}

//--------------------------------------------------
// save change back into source array
//--------------------------------------------------

if (b.weapon === "MG")
{
    this.machineGunAmmo
    [
        b.barrel
    ]
    [
        b.index
    ] =
        b.ammo;
}

if (b.weapon === "CA")
{
    this.cannonAmmo[b.index] =
        b.ammo;
}

if (b.weapon === "GB")
{
    this.bombAmmo
    [
        b.barrel
    ]
    [
        b.index
    ] =
        b.ammo;
}


//--------------------------------------------------
// update description
//--------------------------------------------------

this.selectedAmmo =
    b.ammo;

return;
// end

            this.selectedAmmo =
                b.ammo;

            return;
        }
    }
}
// end
 
    //--------------------------------------------------
    // draw
    //--------------------------------------------------

    draw(ctx)
    {
        //--------------------------------------------------
        // background
        //--------------------------------------------------

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
//end
        }

        ctx.fillStyle =
            "rgba(0,0,0,0.75)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        //--------------------------------------------------
        // title
        //--------------------------------------------------

        ctx.fillStyle =
            "#d8b46a";

        ctx.font =
            "64px Georgia";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "LOADOUT",
            canvas.width / 2,
            90
        );

        //--------------------------------------------------
        // headquarters button
        //--------------------------------------------------

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

        ctx.fillText(
            "HEADQUARTERS",
            hqX + hqW / 2,
            hqY + 33
        );

        //--------------------------------------------------
        // clear old hit boxes
        //--------------------------------------------------

        this.ammoButtons = [];

        //--------------------------------------------------
        // three columns
        //--------------------------------------------------

        const machineGunX = 320;
        const cannonX     = 840;
        const bombX       = 1360;

        const topY        = 180;

       //--------------------------------------------------
        // MACHINE GUN PLAQUE
        //--------------------------------------------------

        const plaqueW = 450;
        const plaqueH = 60;

        ctx.fillStyle =
            "#2a1d10";

        ctx.fillRect(
            machineGunX - 130,
            topY - 30,
            plaqueW,
            plaqueH
        );

        ctx.strokeStyle =
            "#d8b46a";

        ctx.lineWidth = 2;

        ctx.strokeRect(
            machineGunX - 130,
            topY - 30,
450,
600
);

        ctx.fillStyle =
            "#d8c090";

        ctx.font =
            "30px Georgia";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "MACHINE GUN",
            machineGunX,
            topY + 12
        );
		

        //--------------------------------------------------
        // CANNON PLAQUE
        //--------------------------------------------------

        ctx.fillStyle =
            "#2a1d10";

        ctx.fillRect(
            cannonX - 130,
            topY - 30,
            plaqueW,
            plaqueH
        );

        ctx.strokeStyle =
            "#d8b46a";

        ctx.strokeRect(
            cannonX - 130,
            topY - 30,
450,
300
);

        ctx.fillStyle =
            "#d8c090";

        ctx.fillText(
            "CANNON",
            cannonX,
            topY + 12
        );

        //--------------------------------------------------
        // BOMB PLAQUE
        //--------------------------------------------------

        ctx.fillStyle =
            "#2a1d10";

        ctx.fillRect(
            bombX - 130,
            topY - 30,
            plaqueW,
            plaqueH
        );

        ctx.strokeStyle =
            "#d8b46a";

        ctx.strokeRect(
            bombX - 130,
            topY - 30,
450,
600
);

        ctx.fillStyle =
            "#d8c090";

        ctx.fillText(
            "GRAVITY BOMB",
            bombX,
            topY + 12
        );
// end 

const rowY =
    topY + 60;

const rowWidth = 200;
const rowHeight = 50;

//--------------------------------------------------
// machine gun rows
//--------------------------------------------------

        const unlockedBarrels =
    currentSave?.upgrades
        ?.machineGunBarrels || 1;
// end
		
		for (
            let row = 0;
            row < 4;
            row++
        )
        {
            const y =
                rowY +
                row * 130;

            const barrelAmmo =
    this.machineGunAmmo[row];
// end
				
					
           ctx.strokeStyle =
    "#d8b46a";


ctx.fillStyle =
    "#d8c090";

ctx.font =
    "22px Georgia";

console.log(
    "BARRELS",
    unlockedBarrels
);
// end

const unlocked =
    row < unlockedBarrels;

ctx.fillText(
    unlocked
        ? "BARREL 0" + (row + 1)
        : "BARREL 0" + (row + 1) + " LOCKED",
    machineGunX,
    y + 20
);
// end

//--------------------------------------
// ammo sequence icons
//--------------------------------------

const ammoY = y + 45;

const ammoSpacing = 110;

if (unlocked)
{
for (
let shot = 0;
shot < 4;
shot++
)
{
    const ammoX =
        machineGunX - 80 +
        (shot * ammoSpacing);
		
this.ammoButtons.push(
{
    weapon : "MG",

    barrel : row,

    index : shot,

    ammo :
        this.machineGunAmmo[row][shot],

    x :
        ammoX - 15,

    y :
        ammoY - 20,

    w :
        30,

    h :
        50
});
// end

    ctx.fillStyle =
 this.getAmmoColor(
    this.machineGunAmmo[row][shot]
);
// end   

    
    // bullet body

ctx.fillRect(
    ammoX - 8,
    ammoY + 6,
    16,
    24
);

// bullet tip

ctx.beginPath();

ctx.moveTo(
    ammoX - 8,
    ammoY + 6
);

ctx.lineTo(
    ammoX,
    ammoY - 14
);

ctx.lineTo(
    ammoX + 8,
    ammoY + 6
);

ctx.closePath();

ctx.fill();
}
}

// end 
			
        }

        //--------------------------------------------------
        // cannon rows
        //--------------------------------------------------

        {
         
ctx.fillStyle =
    "#111111";

ctx.font =
    "22px Georgia";

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "22px Georgia";

ctx.fillText(
    "BARREL 01",
    cannonX,
    rowY + 20
);

const ammoY =
    rowY + 45;

const ammoSpacing =
    110;

for (
    let shot = 0;
    shot < 4;
    shot++
)
{
    const ammoX =
        cannonX - 80 +
        (shot * ammoSpacing);
		
		this.ammoButtons.push(
{
    weapon : "CA",

    index : shot,

    ammo :
        this.cannonAmmo[shot],

    x :
        ammoX - 15,

    y :
        ammoY - 20,

    w :
        30,

    h :
        50
});
// end

    ctx.fillStyle =
    this.getAmmoColor(
        this.cannonAmmo[shot]
    );
// end

    // shell body

    ctx.fillRect(
        ammoX - 8,
        ammoY,
        16,
        30
    );

ctx.fillRect(
    ammoX - 10,
    ammoY + 16,
    20,
    4
);

ctx.fillRect(
    ammoX - 10,
    ammoY + 24,
    20,
    4
);

    // shell nose

    ctx.beginPath();

    ctx.moveTo(
        ammoX - 7,
        ammoY
    );

    ctx.lineTo(
        ammoX,
        ammoY - 8
    );

    ctx.lineTo(
        ammoX + 7,
        ammoY
    );

    ctx.closePath();

    ctx.fill();
}

// end
		 
        }

  //--------------------------------------------------
        // gravity bomb rows
//--------------------------------------------------

        const unlockedBays =
    currentSave?.upgrades
        ?.gravityBombBays || 1;
// end
		for (
            let row = 0;
            row < 4;
            row++
        )
        {
            const y =
                rowY +
                row * 130;

            ctx.fillStyle =
    "#d8c090";

ctx.font =
    "22px Georgia";

const unlocked =
    row < unlockedBays;

ctx.fillText(
    unlocked
        ? "BAY 0" + (row + 1)
        : "BAY 0" + (row + 1) + " LOCKED",
    bombX,
    y + 20
);
// end

if (unlocked)
{
    const ammoY =
        y + 55;

    const ammoSpacing =
        110;

    for (
        let shot = 0;
        shot < 4;
        shot++
    )
    {
        const ammoX =
            bombX - 80 +
            (shot * ammoSpacing);

 this.ammoButtons.push(
{
    weapon : "GB",

    barrel : row,

    index : shot,

    ammo :
        this.bombAmmo[row][shot],

    x :
        ammoX - 20,

    y :
        ammoY - 20,

    w :
        40,

    h :
        60
});
// end       

        ctx.fillStyle =
    this.getAmmoColor(
        this.bombAmmo[row][shot]
    );
// end


        //--------------------------------------------------
        // bomb body
        //--------------------------------------------------

        ctx.beginPath();

        ctx.ellipse(
            ammoX,
            ammoY + 14,
            12,
            18,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        //--------------------------------------------------
        // fins
        //--------------------------------------------------

        ctx.beginPath();

        ctx.moveTo(
            ammoX - 16,
            ammoY - 8
        );

        ctx.lineTo(
            ammoX,
            ammoY
        );

        ctx.lineTo(
            ammoX + 16,
            ammoY - 8
        );

        ctx.closePath();

        ctx.fill();

        //--------------------------------------------------
        // tail
        //--------------------------------------------------

        ctx.fillRect(
            ammoX - 1,
            ammoY - 9,
            2,
            10
        );
    }
}
// end gravity bomb row loop

}

// end

//--------------------------------------------------
// selected ammo description
//--------------------------------------------------

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "20px Georgia";

ctx.textAlign =
    "center";

ctx.fillText(
    this.getAmmoDescription(
        this.selectedAmmo
    ),
    canvas.width / 2,
    canvas.height - 90
);

//--------------------------------------------------
// permanent instructions
//--------------------------------------------------

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "18px Georgia";

ctx.fillText(
    "SELECT AMMUNITION RELOAD SEQUENCES  |  Ammunition fires in order (1) -> (2) -> (3) -> (4) and reloads in the same order. Click ammunition to change type.",
    canvas.width / 2,
    canvas.height - 45
);

    } // end draw

} // end ScreenLoadout

const screenLoadout =
    new ScreenLoadout();