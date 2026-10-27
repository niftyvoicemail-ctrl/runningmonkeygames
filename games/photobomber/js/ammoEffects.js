// =====================================================
// AMMO EFFECTS
// =====================================================

// =====================================================
// AMMO IMPACT EVENTS
// =====================================================

const impactEvents = [];
// end

function scheduleAmmoImpact(
    ammo,
    x,
    y
)
{
    if(!ammo)
    {
        return;
    }

    impactEvents.push(
    {
        ammo: ammo,

        x: x,

        y: y,

        timer:
            ammo.damageDelay * 60
    });
}
// end

// =====================================================
// UPDATE AMMO EFFECTS
// =====================================================

function updateAmmoEffects()
{
    for(
        let i = impactEvents.length - 1;
        i >= 0;
        i--
    )
    {
        const impact = impactEvents[i];

        impact.timer--;

        if(impact.timer <= 0)
        {
            console.log(
                "IMPACT",
                impact.x,
                impact.y
            );

            dangerX = impact.x;
            dangerY = impact.y;

            dangerTimer =
                DANGER_MARKER_FRAMES;

            // --------------------
            // DUST
            // --------------------
            // per-ammo size and lifetime, straight off
            // the ammo entry - no more sniffing a
            // "damage type" string for the word "dust"

            if(
                impact.ammo.dustDamage &&
                typeof createDust === "function"
            )
            {
                const hitColor =
                    typeof getColorAt === "function"
                        ? getColorAt(impact.x, impact.y)
                        : null;

                createDust(
                    impact.x,
                    impact.y,
                    impact.ammo.dustSize,
                    hitColor,
                    impact.ammo.dustTime * 60
                );
            }

            // --------------------
            // FLASH
            // --------------------
            // brief bright instant - independent of
            // whether this ammo can start a fire

            if(
                impact.ammo.flashDamage &&
                typeof createFlash === "function"
            )
            {
                createFlash(
                    impact.x,
                    impact.y,
                    impact.ammo.flashSize,
                    impact.ammo.flashTime
                );
            }

            // --------------------
            // FIRE (material-aware)
            // --------------------
            // generalized off ammo.fireStartChance
            // (parsed from the ability text) rather than
            // hardcoded to one ammo id - any ammo with a
            // "chance to start fire" line gets the same
            // treatment. actual ignition rolls that base
            // chance against the material's own burn
            // factor, so the round still won't reliably
            // torch a puddle.

            if(impact.ammo.fireStartChance > 0)
            {
                const burnFactor =
                    typeof getBurnFactor === "function"
                        ? getBurnFactor(impact.x, impact.y)
                        : 0.3;

                const igniteChance =
                    impact.ammo.fireStartChance *
                    burnFactor;

                if(Math.random() < igniteChance)
                {
                    if(typeof createFire === "function")
                    {
                        createFire(
                            impact.x,
                            impact.y,
                            burnFactor
                        );
                    }
                }
            }

            // --------------------
            // DAMAGE AT IMPACT
            // --------------------

            for(const c of creeps)
            {
                const dist =
                    Math.hypot(
                        c.x - impact.x,
                        c.y - impact.y
                    );

                if(
                    dist >
                    Math.max(3, impact.ammo.damageSize)
                )
                {
                    continue;
                }

                // ----------------------------
                // FOXHOLE PROTECTION
                // ----------------------------
                // a sheltered soldier survives most
                // explosions outright. thermobaric
                // (shelterBypassChance > 0) is the
                // deliberate counter - it still has a
                // real chance to reach them anyway.
                // everything else that reaches this
                // point missed entirely.

                if(
                    c.rawId === "creep01" &&
                    typeof isInTrench === "function" &&
                    isInTrench(c.x, c.y)
                )
                {
                    const bypassed =
                        impact.ammo.shelterBypassChance > 0 &&
                        Math.random() <
                        impact.ammo.shelterBypassChance;

                    if(!bypassed)
                    {
                        console.log(
                            c.name,
                            "sheltered - survived"
                        );

                        continue;
                    }

                    console.log(
                        c.name,
                        "shelter bypassed"
                    );
                }

                c.hp -= impact.ammo.damageHit;

                console.log("DAMAGE", c.name);

                // ----------------------------
                // GUARANTEED CREW KILL
                // ----------------------------
                // bullet01 / shell01 - each hit removes
                // a fixed number of crew regardless of
                // chance

                if(
                    impact.ammo.crewKillCount > 0 &&
                    c.spawnOnDeath > 0
                )
                {
                    c.spawnOnDeath =
                        Math.max(
                            0,
                            c.spawnOnDeath -
                            impact.ammo.crewKillCount
                        );

                    console.log(
                        c.name,
                        "crew left:",
                        c.spawnOnDeath
                    );

                    if(c.spawnOnDeath <= 0)
                    {
                        c.maxSpeed = 0;

                        console.log(c.name, "DISABLED");
                    }
                }

                // ----------------------------
                // PROBABILISTIC CREW WIPE
                // ----------------------------
                // BOMB01 - a chance to take out the
                // whole crew in one hit, rather than a
                // fixed count per hit

                if(
                    impact.ammo.crewKillChance > 0 &&
                    c.spawnOnDeath > 0 &&
                    Math.random() <
                    impact.ammo.crewKillChance
                )
                {
                    c.spawnOnDeath = 0;

                    c.maxSpeed = 0;

                    console.log(
                        c.name,
                        "crew wiped - DISABLED"
                    );
                }
            }

            impactEvents.splice(i, 1);
        }
    }
}
// end