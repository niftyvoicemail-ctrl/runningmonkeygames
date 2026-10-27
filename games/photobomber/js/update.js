// =====================================================
// UPDATE
// =====================================================

function update()
{
	
	if(
    typeof updateAmmoEffects ===
    "function"
)
{
    updateAmmoEffects();
}
// end
	
	if(
    typeof updateWeaponFire ===
    "function"
)
{
    updateWeaponFire();
}
    // --------------------------------
    // PENDING CLICK HIT (consumed once)
    // --------------------------------

    if(pendingHitX !== null)
{
    for(const c of creeps)
    {
        const dist =
            Math.hypot(
                c.x - pendingHitX,
                c.y - pendingHitY
            );

   if(dist <= pendingHitRadius)
{
    const ammo =
        getCurrentAmmo();

    if(
        typeof addDelayedDamage ===
        "function"
    )
    {
        addDelayedDamage(
            c,
            ammo
        );
    }
}     
    }

    pendingHitX = null;
    pendingHitY = null;
}

        

    // --------------------------------
    // SPAWNING
    // --------------------------------

    if(creepTypesReady)
    {
        for(const type of creepTypes)
        {
            if(!type[ACTIVE_GAME_MODE])
            {
                continue;
            }

            type.spawnCounter++;

            const spawnFrames =
                type.spawnRateSeconds * 60;

            // only treat spawnLocations as "done" once
            // it actually has entries - an empty array
            // is still truthy, so without the length
            // check a type that tried before the map/
            // dark-spot scan finished would lock in []
            // forever and never spawn again.

            if(
                !type.spawnLocations ||
                type.spawnLocations.length === 0
            )
            {
                if(type.spawnWithId)
                {
                    const sharedWith =
                        creepTypes.find(
                            t =>
                            t.rawId ===
                            type.spawnWithId
                        );

                    if(
                        sharedWith &&
                        sharedWith.spawnLocations &&
                        sharedWith.spawnLocations.length > 0
                    )
                    {
                        type.spawnLocations =
                            sharedWith.spawnLocations;
                    }
                    else
                    {
                        createSpawnLocations(
                            type
                        );
                    }
                }
                else
                {
                    createSpawnLocations(
                        type
                    );
                }
            }

            if(
                type.spawnCounter >=
                spawnFrames
            )
            {
                type.spawnCounter = 0;

                spawnCreep(type);
            }
        }
    }

    // --------------------------------
    // DANGER TIMER
    // --------------------------------

    if(dangerTimer > 0)
    {
        dangerTimer--;
    }

    // --------------------------------
    // CREEP UPDATE
    // --------------------------------

    for(const c of creeps)
    {
        // ----------------------------
        // DAMAGE
        // ----------------------------
        // handled once, at click time, in weapons.js.
        // nothing per-frame here anymore.

       if(c.hp <= 0)
{
    score += c.points;

    // ----------------------------
    // GM03 AIR DROPS
    // ----------------------------

    const paratrooperType =
        creepTypes.find(
            t =>
            t.rawId ===
            "creep07"
        );

    if(paratrooperType)
    {
        let dropCount = 0;

        if(c.rawId === "creep08")
        {
            dropCount = 2;
        }
        else if(c.rawId === "creep09")
        {
            dropCount = 2;
        }
        else if(c.rawId === "creep10")
        {
            dropCount = 10;
        }

        for(
            let i = 0;
            i < dropCount;
            i++
        )
        {
            spawnCreepAt(
                paratrooperType,

                c.x +
                (Math.random() - 0.5) *
                20,

                c.y +
                (Math.random() - 0.5) *
                20
            );
        }
    }

    // ----------------------------
    // EXISTING SPAWN ON DEATH
    // ----------------------------

    if(c.spawnOnDeath > 0)
    {
        const soldierType =
            creepTypes.find(
                t =>
                t.rawId ===
                "creep01"
            );

        if(soldierType)
        {
            for(
                let i = 0;
                i < c.spawnOnDeath;
                i++
            )
            {
                spawnCreepAt(
                    soldierType,

                    c.x +
                    (Math.random() - 0.5) *
                    6,

                    c.y +
                    (Math.random() - 0.5) *
                    6
                );
            }
        }
    }

    c.dead = true;

    continue;
}

// end 
		
		// ----------------------------
// BASE CONTACT
// ----------------------------

if(playerBase)
{
    const dist =
        Math.hypot(
            c.x - playerBase.x,
            c.y - playerBase.y
        );

    const BASE_RADIUS =
        25;

    if(dist < BASE_RADIUS)
    {
        antiScore +=
            c.points * 100;

        c.dead = true;

        console.log(
            c.name,
            "reached base",
            antiScore
        );

        continue;
    }
}

// end

        // ----------------------------
        // ABILITIES
        // ----------------------------

        applyCreepAbilities(c);

        // ----------------------------
        // ENERGY FACTOR
        // ----------------------------
        // creeps with no energy field in the data file
        // (energyMax === Infinity) have no stamina system
        // at all - always at max speed, no drain, no
        // recovery crawl.

        const energyPercent =
            c.energyMax ===
            Infinity
                ? 1
                : c.energyCurrent /
                  c.energyMax;

        const allowedSpeed =
            Math.max(
                0.2,
                c.maxSpeed *
                energyPercent
            );
// ----------------------------
// CR1 SOCIAL BEHAVIOR
// ----------------------------

for(const other of creeps)
{
    if(other === c)
    {
        continue;
    }

    if(other.dead)
    {
        continue;
    }

    const dx =
        c.x - other.x;

    const dy =
        c.y - other.y;

    const dist =
        Math.hypot(
            dx,
            dy
        );

    if(
        dist <= 0 ||
        dist > c.FOW
    )
    {
        continue;
    }

    const social =
        (c.CR1 - 5) / 4;

    const minDistance = 4;

    const comfortZone = 8;

    if(dist < minDistance)
    {
        const push =
            (minDistance - dist) /
            minDistance;

        c.dx +=
            (dx / dist) *
            push *
            0.20;

        c.dy +=
            (dy / dist) *
            push *
            0.20;
    }
    else if(
        dist > comfortZone
    )
    {
        c.dx +=
            (dx / dist) *
            social *
            0.03;

        c.dy +=
            (dy / dist) *
            social *
            0.03;
    }
}

// end

// ----------------------------
// CR2 FEAR OF LIGHT
// ----------------------------

const currentBrightness =
    getBrightnessAt(
        c.x,
        c.y
    );

let bestBrightness =
    currentBrightness;

let bestX =
    c.x;

let bestY =
    c.y;

// search visible area

const searchStep = 20;

for(
    let dy = -c.FOW;
    dy <= c.FOW;
    dy += searchStep
)
{
    for(
        let dx = -c.FOW;
        dx <= c.FOW;
        dx += searchStep
    )
    {
        const sampleX =
            c.x + dx;

        const sampleY =
            c.y + dy;
	const borderMargin =
    c.FOW * 0.50;

if(
    sampleX < borderMargin ||
    sampleX > canvas.width - borderMargin ||
    sampleY < borderMargin ||
    sampleY > canvas.height - borderMargin
)
{
    continue;
}

// end		

        const dist =
            Math.hypot(
                dx,
                dy
            );

        if(dist > c.FOW)
        {
            continue;
        }

        const brightness =
            getBrightnessAt(
                sampleX,
                sampleY
            );

        if(brightness < bestBrightness)
        {
            bestBrightness =
                brightness;

            bestX =
                sampleX;

            bestY =
                sampleY;
        }
    }
}

// ----------------------------
// SATISFACTION CHECK
// ----------------------------

const brightnessImprovement =
    currentBrightness -
    bestBrightness;

// CR5 controls willingness
// to leave a good hiding spot

const improvementNeeded =
    55 -
    (c.CR5 * 5);

if(
    brightnessImprovement >
    improvementNeeded
)
{
    const dx =
        bestX - c.x;

    const dy =
        bestY - c.y;

    const dist =
        Math.hypot(
            dx,
            dy
        );

    if(dist > 0)
    {
        const lightFear =
            (c.CR2 - 5) / 4;

        c.dx +=
            (dx / dist) *
            lightFear *
            0.08;

        c.dy +=
            (dy / dist) *
            lightFear *
            0.08;
    }
}

// end

// ----------------------------
// BASE ATTRACTION (baseline)
// ----------------------------
// not tied to CR2 or FOW at all - every creep gets this,
// regardless of personality or how far away the base is.
// CR2's local darkness search only "sees" a small radius
// around the creep, so anything further from the base
// than its own FOW + the base's dark-hole radius has no
// way to ever sense the base exists. this is the fix:
// a constant, always-on pull toward the actual objective,
// same size for everyone. CR1/CR2/CR3/CR4 still perturb
// the path on top of this once a creep gets close enough
// to react locally - this just makes sure nobody is stuck
// with zero signal telling them which way to go.

if(playerBase)
{
    const dx =
        playerBase.x - c.x;

    const dy =
        playerBase.y - c.y;

    const dist =
        Math.hypot(
            dx,
            dy
        );

    if(dist > 0)
    {
        const baseAttraction = 0.04;

        c.dx +=
            (dx / dist) *
            baseAttraction;

        c.dy +=
            (dy / dist) *
            baseAttraction;
    }
}

// end

// ----------------------------
// CR3 DANGER RESPONSE
// ----------------------------

if(dangerTimer > 0)
{
    const dx =
        c.x - dangerX;

    const dy =
        c.y - dangerY;

    const dist =
        Math.hypot(
            dx,
            dy
        );

    if(
        dist < c.FOW &&
        dist > 0
    )
    {
        const response =
            (c.CR3 - 5) / 4;

        c.dx +=
            (dx / dist) *
            response *
            0.20;

        c.dy +=
            (dy / dist) *
            response *
            0.20;
    }
}

// end

        // ----------------------------
        // CR4 WANDERING
        // ----------------------------

        const wander =
            (c.CR4 - 1) / 8;

        c.dx +=
            (Math.random() - 0.5) *
            wander *
            0.08;

        c.dy +=
            (Math.random() - 0.5) *
            wander *
            0.08;

        // ----------------------------
        // WIND DRIFT (GM3 airborne creeps)
        // ----------------------------
        // applied as a straight position drift in the
        // MOVE step below, NOT added into dx/dy. dx/dy
        // persist from frame to frame, so a wind push
        // added there would accumulate until every
        // airborne creep was pinned at max speed heading
        // downwind and ignoring its own steering. as a
        // drift, the creep still moves by its own
        // velocity and wind just carries it along.
        //
        // windSpeed is in pixels/second (see
        // 500-effects_file.txt), so /60 for per-frame.

        let windX = 0;
        let windY = 0;

        if(
            c.windAffected &&
            typeof windSpeed !== "undefined"
        )
        {
            const windRad =
                windDirection *
                Math.PI / 180;

            windX =
                Math.cos(windRad) *
                windSpeed / 60;

            windY =
                Math.sin(windRad) *
                windSpeed / 60;
        }

        // ----------------------------
        // CR5 ENERGY DRIVE
        // ----------------------------

        const energyDrive =
            (c.CR5 - 5) / 4;

        const movementMultiplier =
            1 +
            (energyDrive * 0.15);

        c.dx *=
            movementMultiplier;

        c.dy *=
            movementMultiplier;

        // ----------------------------
        // SPEED LIMIT
        // ----------------------------

        const speed =
            Math.hypot(
                c.dx,
                c.dy
            );

        if(speed > allowedSpeed)
        {
            c.dx =
                (c.dx / speed) *
                allowedSpeed;

            c.dy =
                (c.dy / speed) *
                allowedSpeed;
        }

        // ----------------------------
        // ENERGY USE
        // ----------------------------

        const actualSpeed =
            Math.hypot(
                c.dx,
                c.dy
            );

        if(
            c.energyMax !==
            Infinity
        )
        {
            c.energyCurrent -=
                (
                    actualSpeed /
                    c.maxSpeed
                ) / 60;

            if(actualSpeed < 0.25)
            {
                c.energyCurrent +=
                    c.recovery / 60;
            }

            c.energyCurrent =
                Math.max(
                    0,
                    Math.min(
                        c.energyMax,
                        c.energyCurrent
                    )
                );
        }

        // ----------------------------
        // ROTATION
        // ----------------------------

        // heading follows where the creep is actually
        // going - own velocity plus wind drift - so a
        // paratrooper in a crosswind visibly angles into it

        const headingX = c.dx + windX;
        const headingY = c.dy + windY;

        if(Math.hypot(headingX, headingY) > 0.05)
        {
            c.angle =
                Math.atan2(
                    headingY,
                    headingX
                );
        }

        // ----------------------------
        // EDGE AVOIDANCE (hard safety net)
        // ----------------------------
        // unconditional - doesn't care what CR1/CR2 or
        // crowding pressure are doing. this used to exist
        // and got dropped somewhere along the way, which
        // is why creeps could get shoved onto the boundary
        // by social pressure and just sit there.

        const edgeBuffer = 30;

        if(c.x < edgeBuffer)
        {
            c.dx +=
                (edgeBuffer - c.x) *
                0.02;
        }

        if(
            c.x >
            canvas.width -
            edgeBuffer
        )
        {
            c.dx -=
                (
                    c.x -
                    (
                        canvas.width -
                        edgeBuffer
                    )
                ) * 0.02;
        }

        if(c.y < edgeBuffer)
        {
            c.dy +=
                (edgeBuffer - c.y) *
                0.02;
        }

        if(
            c.y >
            canvas.height -
            edgeBuffer
        )
        {
            c.dy -=
                (
                    c.y -
                    (
                        canvas.height -
                        edgeBuffer
                    )
                ) * 0.02;
        }

        
        // ----------------------------
        // MOVE
        // ----------------------------

        c.x += c.dx + windX;
        c.y += c.dy + windY;

        c.x =
            Math.max(
                0,
                Math.min(
                    canvas.width,
                    c.x
                )
            );

        c.y =
            Math.max(
                0,
                Math.min(
                    canvas.height,
                    c.y
                )
            );
    }

    // --------------------------------
    // REMOVE DEAD CREEPS
    // --------------------------------

    for(
        let i =
            creeps.length - 1;
        i >= 0;
        i--
    )
    {
        if(creeps[i].dead)
        {
            creeps.splice(i, 1);
        }
    }
}