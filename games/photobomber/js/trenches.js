/*
==============================================================================
FOXHOLE SYSTEM
==============================================================================

Simplified from the original "trench network" concept - individual
dug-in positions rather than connected corridors. Each dig is a
single grid cell, drawn as a small dark circle rather than a
filled square, so it reads as a hole instead of a blocky patch.

DESIGN
------------------------------------------------------------------------------

There is NO digging AI.

Soldiers look for shelter. A foxhole is just one kind of shelter,
and digging a new one is the last thing a soldier tries.

PRIORITY ORDER (see abilities.js)
------------------------------------------------------------------------------

    1. existing foxhole
    2. naturally dark area
    3. other valid shelter
    4. dig a new foxhole      <- rare, last resort

STORAGE
------------------------------------------------------------------------------

Foxholes are stored by BRIGHTNESS GRID coordinate, not screen
coordinate, for two reasons:

    - lookup is O(1) instead of scanning a list. getBrightnessAt
      runs thousands of times per frame (every creep's fog-of-war
      search samples it), so a linear scan there would tank the
      frame rate once a few hundred foxholes exist.

    - grid coords are image space, so foxholes stay put when the
      window is resized. screen coords would drift.

EFFECT
------------------------------------------------------------------------------

    creep map     50% darker  (the real gameplay effect - kept
                               well short of the player base's
                               true 0 brightness, so the base
                               stays the single most attractive
                               dark spot on the map)

    photo         ~7% darker, drawn as a small circle rather
                  than a filled cell (subtle visual mark only)

==============================================================================
*/

// --------------------------------------------------------------------------
// TUNING DIALS
// --------------------------------------------------------------------------

// creep map: brightness is multiplied by this.
// 50% dark - strong enough to read as real shelter,
// but not dark enough to out-compete the player base
// (which sits at true 0 brightness at its core). the
// base needs to stay the single darkest, most
// attractive point on the map - it's the prize.

const TRENCH_CREEP_DARKNESS = 0.5;

// photo: alpha of the black overlay drawn per trench cell.
// keep this low - the note says the gameplay effect should
// live on the creep map, not the photograph

const TRENCH_IMAGE_DARKNESS = 0.07;

// how far a soldier will look for an existing trench

const TRENCH_SEARCH_RADIUS = 140;

// a soldier is "in" a trench within this many pixels

const TRENCH_OCCUPY_RADIUS = 10;

// per-frame chance to dig once every other option has failed.
// this is the main anti-spam dial - lower means rarer trenches

const TRENCH_DIG_CHANCE = 0.004;

// no new foxhole may be dug within this many grid cells
// of an existing one - keeps them as distinct spread-out
// holes instead of a solid dark carpet.
//
// this is measured in CELLS, not pixels, so it has to
// scale with BRIGHTNESS_STEP. old value was 2 cells at
// step 11 (~22px real gap). step is now 2, so this is
// bumped to 11 cells to keep that same ~22px spacing -
// otherwise foxholes would end up almost touching.

const TRENCH_MIN_GRID_SPACING = 11;

// hard ceiling so a very long game can't run away

const TRENCH_MAX_COUNT = 400;

// how often (frames) a soldier re-runs its shelter search.
// staggered per soldier so they don't all search on the same
// frame

const TRENCH_SEARCH_INTERVAL = 20;

// --------------------------------------------------------------------------
// STATE
// --------------------------------------------------------------------------

// key "gx,gy" -> trench object (O(1) lookup)

let trenchMap = {};

// same trenches as a list (for drawing and nearest-search)

let trenchList = [];

//---------------------------------------------------------------------------
// KEY
//---------------------------------------------------------------------------

function trenchKey(gx, gy)
{
    return gx + "," + gy;
}

//---------------------------------------------------------------------------
// RESET
//---------------------------------------------------------------------------
// called when a new photo is loaded and when a run starts

function resetTrenches()
{
    trenchMap = {};
    trenchList = [];

    console.log("trenches reset");
}

//---------------------------------------------------------------------------
// LOOKUP BY GRID
//---------------------------------------------------------------------------
// used by map.js getBrightnessAt - must stay cheap

function getTrenchDarknessAtGrid(gx, gy)
{
    const t =
        trenchMap[
            trenchKey(gx, gy)
        ];

    if (!t)
    {
        return 1;
    }

    return TRENCH_CREEP_DARKNESS;
}

//---------------------------------------------------------------------------
// IS IN TRENCH
//---------------------------------------------------------------------------

function isInTrench(screenX, screenY)
{
    if (trenchList.length === 0)
    {
        return false;
    }

    const grid =
        screenToGrid(
            screenX,
            screenY
        );

    return !!trenchMap[
        trenchKey(
            grid.gridX,
            grid.gridY
        )
    ];
}

//---------------------------------------------------------------------------
// FIND NEAREST TRENCH
//---------------------------------------------------------------------------
// returns {x, y} in SCREEN space, or null

function findNearestTrench(
    screenX,
    screenY,
    radius
)
{
    if (trenchList.length === 0)
    {
        return null;
    }

    let best = null;

    let bestDist = radius;

    for (const t of trenchList)
    {
        const pos =
            gridToScreen(
                t.gx,
                t.gy
            );

        const dist =
            Math.hypot(
                pos.x - screenX,
                pos.y - screenY
            );

        if (dist < bestDist)
        {
            bestDist = dist;

            best = pos;
        }
    }

    return best;
}

//---------------------------------------------------------------------------
// SPACING CHECK
//---------------------------------------------------------------------------
// true if a new trench here would be too close to an existing one

function trenchTooClose(gx, gy)
{
    for (
        let dy = -TRENCH_MIN_GRID_SPACING;
        dy <= TRENCH_MIN_GRID_SPACING;
        dy++
    )
    {
        for (
            let dx = -TRENCH_MIN_GRID_SPACING;
            dx <= TRENCH_MIN_GRID_SPACING;
            dx++
        )
        {
            if (
                trenchMap[
                    trenchKey(
                        gx + dx,
                        gy + dy
                    )
                ]
            )
            {
                return true;
            }
        }
    }

    return false;
}

//---------------------------------------------------------------------------
// DIG TRENCH
//---------------------------------------------------------------------------
// returns true if a trench was actually created

function digTrench(screenX, screenY)
{
    if (
        trenchList.length >=
        TRENCH_MAX_COUNT
    )
    {
        return false;
    }

    const grid =
        screenToGrid(
            screenX,
            screenY
        );

    // off the map

    if (
        !brightnessMap ||
        grid.gridY < 0 ||
        grid.gridY >= brightnessMap.length
    )
    {
        return false;
    }

    if (
        grid.gridX < 0 ||
        grid.gridX >= brightnessMap[grid.gridY].length
    )
    {
        return false;
    }

    // already a trench here

    if (
        trenchMap[
            trenchKey(
                grid.gridX,
                grid.gridY
            )
        ]
    )
    {
        return false;
    }

    // too close to an existing trench - this is
    // what keeps networks spread out instead of
    // becoming a solid dark blob

    if (
        trenchTooClose(
            grid.gridX,
            grid.gridY
        )
    )
    {
        return false;
    }

    const trench =
    {
        gx: grid.gridX,
        gy: grid.gridY,

        // how many times a soldier has sheltered
        // here - not used for gameplay yet, but
        // it's the hook for "extend a busy trench"
        // later

        uses: 0,

        createdAt:
            performance.now()
    };

    trenchMap[
        trenchKey(
            grid.gridX,
            grid.gridY
        )
    ] = trench;

    trenchList.push(trench);

    return true;
}

//---------------------------------------------------------------------------
// MARK USE
//---------------------------------------------------------------------------

function markTrenchUse(screenX, screenY)
{
    const grid =
        screenToGrid(
            screenX,
            screenY
        );

    const t =
        trenchMap[
            trenchKey(
                grid.gridX,
                grid.gridY
            )
        ];

    if (t)
    {
        t.uses++;
    }
}

//---------------------------------------------------------------------------
// DRAW
//---------------------------------------------------------------------------
// subtle darkening on the photo only. the real shelter value
// is applied in map.js getBrightnessAt, which is what the
// creeps actually react to.

function drawTrenches()
{
    if (trenchList.length === 0)
    {
        return;
    }

    if (
        !mapImage.complete ||
        mapImage.naturalWidth <= 0
    )
    {
        return;
    }

    const cover =
        getCoverMapping();

    const cellSize =
        Math.ceil(
            BRIGHTNESS_STEP *
            cover.scale
        ) + 1;

    // a circle sitting inside the cell, not a filled
    // square - this is what actually reads as a "hole"
    // rather than a blocky dark patch

    const radius =
        cellSize * 0.5;

    ctx.fillStyle =
        "rgba(0,0,0," +
        TRENCH_IMAGE_DARKNESS +
        ")";

    for (const t of trenchList)
    {
        const pos =
            gridToScreen(
                t.gx,
                t.gy
            );

        ctx.beginPath();

        ctx.arc(
            pos.x,
            pos.y,
            radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}