// =====================================================
// SPAWNING SYSTEM
// =====================================================

// --------------------------------
// RANDOM DARK SPAWN
// --------------------------------

function randomDarkSpawn()
{
    if(darkSpots.length === 0)
    {
        // this particular photo has no pixels dark
        // enough to count as a "dark spot" at all (a
        // bright, well-lit scene can legitimately score
        // zero). without a fallback, any creep type that
        // relies on darkSpots would be permanently unable
        // to spawn no matter how many times it retries.
        // fall back to a uniformly random point across
        // the actual photo instead - still needs the map
        // to have actually loaded first.

        if(
            !mapImage.naturalWidth ||
            !mapImage.naturalHeight
        )
        {
            return null;
        }

        return {
            x:
                Math.random() *
                mapImage.naturalWidth,

            y:
                Math.random() *
                mapImage.naturalHeight
        };
    }

    return darkSpots[
        Math.floor(
            Math.random() *
            darkSpots.length
        )
    ];
}

// --------------------------------
// CREATE SPAWN LOCATIONS
// --------------------------------

function createSpawnLocations(type)
{
    type.spawnLocations = [];

    for(
        let i = 0;
        i < type.spawnPoints;
        i++
    )
    {
        const spot =
            randomDarkSpawn();

        if(spot)
        {
            type.spawnLocations.push(spot);
        }
    }

    console.log(
        type.name,
        "spawn locations:",
        type.spawnLocations.length
    );
}

// --------------------------------
// BUILD CREEP
// --------------------------------

function buildCreep(type, x, y)
{
    return {

        // ------------------------
        // IDENTITY
        // ------------------------

        typeKey: type.key,

        rawId: type.rawId,

        name: type.name,

        color: type.color,

        // ------------------------
        // HEALTH
        // ------------------------

        hp: type.hp,

        maxHp: type.hp,

        // ------------------------
        // ABILITY
        // ------------------------
        // spawnOnDeath does double duty: it's both the
        // "how many soldiers escape if this thing dies"
        // count AND the "how many crew are still alive
        // inside" count (ammoEffects.js's crew-kill
        // logic decrements it directly). maxSpawnOnDeath
        // is the original starting value, kept around
        // just so draw.js can show a real N/M readout.

        spawnOnDeath:
            type.spawnOnDeath || 0,

        maxSpawnOnDeath:
            type.spawnOnDeath || 0,

        // ------------------------
        // WIND
        // ------------------------
        // true for GM3-exclusive (airborne) types -
        // see creepLoader.js. used in update.js to push
        // the creep along with the current wind.

        windAffected:
            type.windAffected || false,

        // ------------------------
        // SCORING
        // ------------------------

        points: type.points,

        // ------------------------
        // POSITION
        // ------------------------

        x: x,

        y: y,

        dx: 0,
        dy: 0,

        angle: 0,

        // ------------------------
        // SIZE
        // ------------------------

        sizeW: type.sizeW,

        sizeH: type.sizeH,

        // ------------------------
        // MOVEMENT
        // ------------------------

        maxSpeed: type.maxSpeed,

        // ------------------------
        // FOG OF WAR
        // ------------------------

        FOW: type.FOW,

        // ------------------------
        // ENERGY
        // ------------------------

        energyMax: type.energyMax,

        energyCurrent: type.energyMax,

        recovery: type.recovery,

        // ------------------------
        // BASE CR VALUES
        // ------------------------

        baseCR1: type.CR1,
        baseCR2: type.CR2,
        baseCR3: type.CR3,
        baseCR4: type.CR4,
        baseCR5: type.CR5,

        // ------------------------
        // ACTIVE CR VALUES
        // ------------------------

        CR1: type.CR1,
        CR2: type.CR2,
        CR3: type.CR3,
        CR4: type.CR4,
        CR5: type.CR5,

        // ------------------------
        // STATUS
        // ------------------------

        dead: false
    };
}

// --------------------------------
// SPAWN CREEP
// --------------------------------

function spawnCreep(type)
{
    if(
        !type.spawnLocations ||
        type.spawnLocations.length === 0
    )
    {
        return;
    }

    const spot =
        type.spawnLocations[
            Math.floor(
                Math.random() *
                type.spawnLocations.length
            )
        ];

    if(!spot)
    {
        return;
    }

    if(type.rawId === "creep01")
    {
        console.log("Soldier HP:", type.hp);
    }

    creeps.push(
        buildCreep(
            type,
            spot.x *
                canvas.width /
                mapImage.width,
            spot.y *
                canvas.height /
                mapImage.height
        )
    );
}

// --------------------------------
// SPAWN CREEP AT (explicit position)
// --------------------------------

function spawnCreepAt(type, x, y)
{
    creeps.push(
        buildCreep(type, x, y)
    );
}