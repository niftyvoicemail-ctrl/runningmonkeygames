/*
==============================================================================
SAVE MANAGER
==============================================================================

Minimal save system so the menus have something real to
read and write.

    3 slots

    stored in localStorage

    currentSave / currentSlot globals
        (screen-loadout.js already expects these)

SAVE SHAPE
------------------------------------------------------------------------------
matches the example in screen-menu.js

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

const SAVE_KEY_PREFIX =
    "photoBlaster_save_";

let currentSlot = null;
let currentSave = null;

const saveManager =
{
    //----------------------------------------------------------------------
    // load slot
    //----------------------------------------------------------------------
    // returns the save object, or null if the slot is empty

    load(slot)
    {
        try
        {
            const raw =
                localStorage.getItem(
                    SAVE_KEY_PREFIX + slot
                );

            if (!raw)
            {
                return null;
            }

            return JSON.parse(raw);
        }
        catch (err)
        {
            console.error(
                "save load failed",
                slot,
                err
            );

            return null;
        }
    },

    //----------------------------------------------------------------------
    // save slot
    //----------------------------------------------------------------------

    save(slot, data)
    {
        try
        {
            localStorage.setItem(
                SAVE_KEY_PREFIX + slot,
                JSON.stringify(data)
            );
        }
        catch (err)
        {
            console.error(
                "save write failed",
                slot,
                err
            );
        }
    },

    //----------------------------------------------------------------------
    // delete slot
    //----------------------------------------------------------------------

    remove(slot)
    {
        localStorage.removeItem(
            SAVE_KEY_PREFIX + slot
        );
    },

    //----------------------------------------------------------------------
    // create new save
    //----------------------------------------------------------------------

    createNew(playerName)
    {
        const now =
    new Date();

const today =
    now.toISOString()
       .slice(0, 10);

const time =
    String(
        now.getHours()
    ).padStart(2, "0")
    +
    ":"
    +
    String(
        now.getMinutes()
    ).padStart(2, "0");

        return {
            playerName:
                playerName || "Player",

            createdDate: today,

            lastPlayedDate: today,

            settings:
            {
                musicOn: true,
                soundOn: true
            },

            statistics:
            {
                longestRun: 0,

                totalPlayTime: 0,

                totalBodyCount: 0,

                bodyCounts: {}
            },

            upgrades:
{
    machineGunBarrels : 1,
    machineGunMagazine : 1,

    cannonBarrel : 1,
    cannonMagazine : 1,

    gravityBombSize : 1,
    gravityBombBays : 1,

    armorPiercingBullets : 1,
    fragmentationBullets : 1,
    incendiaryBullets : 1,

    armorPiercingShells : 1,
    fragmentationShells : 1,
    incendiaryShells : 1,

    highExplosiveBomb : 1,
    thermobaricBomb : 1,
    clusterBomb : 1
},

badges : {},

customCreeps : [],

career :
{
    currentRank : 0,

    upgradePoints : 0,

    money : 0
},

loadout :
{
    machineGun :
    [
        ["AP","AP","AP","AP"],
        ["AP","AP","AP","AP"],
        ["AP","AP","AP","AP"],
        ["AP","AP","AP","AP"]
    ],

    cannon :
    [
        "AP",
        "AP",
        "AP",
        "AP"
    ],

    gravityBomb :
    [
        ["HE","HE","HE","HE"],
        ["HE","HE","HE","HE"],
        ["HE","HE","HE","HE"],
        ["HE","HE","HE","HE"]
    ]
}

//end

        };
    },

    //----------------------------------------------------------------------
    // activate a slot
    //----------------------------------------------------------------------

    activate(slot, data)
    {
        currentSlot = slot;
        currentSave = data;
	if (!currentSave.career)
{
    currentSave.career =
    {
        currentRank : 0,

        upgradePoints : 0,

        money : 0
    };

    this.save(
        slot,
        currentSave
    );
}
// end	

        // apply saved audio settings

        if (currentSave.settings)
        {
            soundManager.musicOn =
                currentSave.settings.musicOn !== false;

            soundManager.soundOn =
                currentSave.settings.soundOn !== false;
        }
    },

    //----------------------------------------------------------------------
    // persist the active slot
    //----------------------------------------------------------------------

    saveCurrent()
    {
        if (
            currentSlot === null ||
            !currentSave
        )
        {
            return;
        }

        currentSave.lastPlayedDate =
            new Date()
                .toISOString()
                .slice(0, 10);

        if (!currentSave.settings)
        {
            currentSave.settings = {};
        }

        currentSave.settings.musicOn =
            soundManager.musicOn;

        currentSave.settings.soundOn =
            soundManager.soundOn;

        this.save(
            currentSlot,
            currentSave
        );
    }
};
