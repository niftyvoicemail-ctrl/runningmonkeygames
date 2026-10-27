// =====================================================
// CREEP ABILITIES
// =====================================================

// ====================================
// SHELTER / TRENCH BEHAVIOR
// ====================================
// see trenches.js for the storage and tuning dials.
//
// priority order, straight from the design note:
//
//     1. existing trench
//     2. naturally dark area
//     3. other valid shelter
//     4. dig a new trench     <- rare, last resort
//
// there is deliberately no trench-building AI. a soldier
// only ever asks "where is shelter?" - networks appear
// because soldiers keep finding and reusing what earlier
// soldiers dug.

// ------------------------------------
// does this soldier want shelter?
// ------------------------------------

function wantsShelter(c)
{
    // danger nearby

    if (dangerTimer > 0)
    {
        const dist =
            Math.hypot(
                c.x - dangerX,
                c.y - dangerY
            );

        if (dist < c.FOW)
        {
            return true;
        }
    }

    // low energy

    if (
        c.energyMax !== Infinity &&
        c.energyCurrent / c.energyMax < 0.35
    )
    {
        return true;
    }

    // standing somewhere bright - CR2 decides
    // how much a given soldier cares

    const lightFear =
        (c.CR2 - 5) / 4;

    if (lightFear > 0)
    {
        const brightness =
            getBrightnessAt(
                c.x,
                c.y
            );

        if (brightness > 140)
        {
            return true;
        }
    }

    return false;
}

// ------------------------------------
// main shelter routine
// ------------------------------------

function applyShelterBehavior(c)
{
    if (
        typeof findNearestTrench !==
        "function"
    )
    {
        return;
    }

    // stagger the search so every soldier
    // isn't scanning on the same frame

    if (c.shelterTimer === undefined)
    {
        c.shelterTimer =
            Math.floor(
                Math.random() *
                TRENCH_SEARCH_INTERVAL
            );
    }

    c.shelterTimer--;

    // ----------------------------
    // ALREADY SHELTERED
    // ----------------------------
    // if the soldier is standing in a trench and
    // still wants shelter, it stays put. this is
    // what makes trenches get REUSED rather than
    // passed over.

    if (
        isInTrench(c.x, c.y) &&
        wantsShelter(c)
    )
    {
        c.dx *= 0.25;
        c.dy *= 0.25;

        if (c.shelterTimer <= 0)
        {
            markTrenchUse(c.x, c.y);

            c.shelterTimer =
                TRENCH_SEARCH_INTERVAL;
        }

        return;
    }

    if (c.shelterTimer > 0)
    {
        return;
    }

    c.shelterTimer =
        TRENCH_SEARCH_INTERVAL;

    if (!wantsShelter(c))
    {
        return;
    }

    // ----------------------------
    // 1. EXISTING TRENCH
    // ----------------------------

    const trench =
        findNearestTrench(
            c.x,
            c.y,
            TRENCH_SEARCH_RADIUS
        );

    if (trench)
    {
        const dx =
            trench.x - c.x;

        const dy =
            trench.y - c.y;

        const dist =
            Math.hypot(dx, dy);

        if (dist > 0)
        {
            c.dx +=
                (dx / dist) * 0.12;

            c.dy +=
                (dy / dist) * 0.12;
        }

        return;
    }

    // ----------------------------
    // 2. NATURALLY DARK AREA
    // ----------------------------
    // already somewhere dark enough - no need to
    // dig. CR2's own search in update.js handles
    // moving toward darkness, so this just stops
    // the soldier digging when darkness is an
    // option.

    const here =
        getBrightnessAt(
            c.x,
            c.y
        );

    if (here < 80)
    {
        return;
    }

    // ----------------------------
    // 3. OTHER VALID SHELTER
    // ----------------------------
    // reserved - smoke, craters, wreckage all fit
    // here later. for now anything dark counts,
    // handled above.

    // ----------------------------
    // 4. DIG - LAST RESORT
    // ----------------------------
    // only reached when: the soldier wants shelter,
    // no trench is within search range, and where it
    // stands isn't dark. the low chance is the main
    // anti-spam control.

    const moving =
        Math.hypot(c.dx, c.dy);

    // has to have basically stopped to dig

    if (moving > 0.35)
    {
        return;
    }

    if (
        Math.random() <
        TRENCH_DIG_CHANCE
    )
    {
        if (
            digTrench(c.x, c.y)
        )
        {
            console.log(
                "trench dug -",
                trenchList.length,
                "total"
            );
        }
    }
}

// ====================================
// CREEP01 SOLDIER
// ====================================

function applySoldierAbility(c)
{
    c.CR1 = c.baseCR1;
    c.CR2 = c.baseCR2;
    c.CR3 = c.baseCR3;
    c.CR4 = c.baseCR4;
    c.CR5 = c.baseCR5;

    const commandSight = 200;

    for(const other of creeps)
    {
        if(other.rawId !== "creep02")
        {
            continue;
        }

        const dist =
            Math.hypot(
                c.x - other.x,
                c.y - other.y
            );

        if(dist <= commandSight)
        {
            c.CR1 = other.CR1;
            c.CR2 = other.CR2;
            c.CR3 = other.CR3;
            c.CR4 = other.CR4;
            c.CR5 = other.CR5;

            break;
        }
    }

    // ------------------------------
    // TRENCHING / SHELTER
    // ------------------------------

    applyShelterBehavior(c);
}

// ====================================
// CREEP02 COMMANDER
// ====================================

function applyCommanderAbility(c)
{
    c.CR1 = c.baseCR1;
    c.CR2 = c.baseCR2;
    c.CR3 = c.baseCR3;
    c.CR4 = c.baseCR4;
    c.CR5 = c.baseCR5;

    const commandSight =
        c.FOW;

    let centerX = 0;
    let centerY = 0;
    let soldierCount = 0;

    for(const other of creeps)
    {
        if(other.rawId !== "creep01")
        {
            continue;
        }

        if(other.dead)
        {
            continue;
        }

        const dist =
            Math.hypot(
                c.x - other.x,
                c.y - other.y
            );

        if(dist > commandSight)
        {
            continue;
        }

        centerX += other.x;
        centerY += other.y;

        soldierCount++;
    }

    if(soldierCount >= 5)
    {
        centerX /= soldierCount;
        centerY /= soldierCount;

        const dx =
            centerX - c.x;

        const dy =
            centerY - c.y;

        const dist =
            Math.hypot(
                dx,
                dy
            );

        if(dist > 20)
        {
            c.dx +=
                (dx / dist) *
                0.10;

            c.dy +=
                (dy / dist) *
                0.10;
        }
    }
}

// ====================================
// CREEP03 ATV
// ====================================

function applyATVAbility(c)
{
    c.CR1 = c.baseCR1;
    c.CR2 = c.baseCR2;
    c.CR3 = c.baseCR3;
    c.CR4 = c.baseCR4;
    c.CR5 = c.baseCR5;
}

// ====================================
// CREEP04 JEEP
// ====================================

function applyJeepAbility(c)
{
    c.CR1 = c.baseCR1;
    c.CR2 = c.baseCR2;
    c.CR3 = c.baseCR3;
    c.CR4 = c.baseCR4;
    c.CR5 = c.baseCR5;
}

// ====================================
// CREEP05 TRUCK
// ====================================

function applyTruckAbility(c)
{
    c.CR1 = c.baseCR1;
    c.CR2 = c.baseCR2;
    c.CR3 = c.baseCR3;
    c.CR4 = c.baseCR4;
    c.CR5 = c.baseCR5;
}

// ====================================
// CREEP06 TANK
// ====================================

function applyTankAbility(c)
{
    c.CR1 = c.baseCR1;
    c.CR2 = c.baseCR2;
    c.CR3 = c.baseCR3;
    c.CR4 = c.baseCR4;
    c.CR5 = c.baseCR5;
}

// ====================================
// DISPATCHER
// ====================================

function applyCreepAbilities(c)
{
    switch(c.rawId)
    {
        case "creep01":
            applySoldierAbility(c);
            break;

        case "creep02":
            applyCommanderAbility(c);
            break;

        case "creep03":
            applyATVAbility(c);
            break;

        case "creep04":
            applyJeepAbility(c);
            break;

        case "creep05":
            applyTruckAbility(c);
            break;

        case "creep06":
            applyTankAbility(c);
            break;
    }
}