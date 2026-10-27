// =====================================================
// EFFECT FILE LOADER
// =====================================================

const EFFECT_FILE_PATH =
    "500-effects_file.txt";

let dustClouds = [];
let fires = [];
let flashes = [];

let effectTypes = {};
let effectTypesReady = false;

// =====================================================
// LOAD FILE
// =====================================================

fetch(EFFECT_FILE_PATH)
    .then(
        res => res.text()
    )
    .then(text =>
    {
        effectTypes =
            parseEffectFile(text);

        effectTypesReady = true;

        console.log(
            "loaded effects:",
            effectTypes
        );

        initWindSystem();
    })
    .catch(err =>
    {
        console.error(
            "failed to load " +
            EFFECT_FILE_PATH,
            err
        );
    });

// =====================================================
// DUST
// =====================================================
// color is the actual photo color sampled at the hit
// point (map.js's getColorAt) - drawEffects blends it
// with grey rather than drawing flat grey puffs.
//
// lifeFrames is per-ammo now (dust time in
// 400-ammo_file.txt), not a fixed duration - a bullet's
// dust clears in a few seconds, a bomb's can linger
// almost two minutes. defaults to 5 seconds if a caller
// doesn't pass one.

function createDust(
    x,
    y,
    radius,
    color,
    lifeFrames
)
{
    const life =
        lifeFrames || 300;

    dustClouds.push(
    {
        x: x,
        y: y,
        radius: radius,
        life: life,
        maxLife: life,
        color:
            color || {
                r: 180,
                g: 180,
                b: 180
            }
    });
}
// end

// =====================================================
// FLASH
// =====================================================
// a brief bright instant at the impact point - NOT the
// same thing as fire below. every ammo with
// "flash damage: true" gets one of these; only some
// ammo (incendiary types) also has a chance to leave an
// actual lingering fire behind.

function createFlash(
    x,
    y,
    size,
    timeSeconds
)
{
    const life =
        Math.max(
            2,
            Math.round(
                (timeSeconds || 0.1) * 60
            )
        );

    flashes.push(
    {
        x: x,
        y: y,
        radius: size || 8,
        life: life,
        maxLife: life
    });
}
// end

// =====================================================
// FIRE
// =====================================================
// burnFactor (0-1) comes from map.js's getBurnFactor -
// it decides how long this particular fire lasts and how
// big it gets. water gives 0 (never actually gets here
// since ammoEffects.js checks before calling this), metal
// gives a short weak flare, generic material scales with
// how dark that spot of the photo is.

function createFire(
    x,
    y,
    burnFactor
)
{
    const life =
        60 +
        burnFactor * 300;

    fires.push(
    {
        x: x,
        y: y,
        life: life,
        maxLife: life,
        radius:
            5 +
            burnFactor * 7
    });
}
// end

// =====================================================
// UTILITY
// =====================================================

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

// =====================================================
// PARSE EFFECT FILE
// =====================================================

function parseEffectFile(text)
{
    const lines =
        text.split(/\r?\n/);

    const effects = {};

    let currentId = null;
    let currentData = {};

    for(
        const rawLine of lines
    )
    {
        const line =
            rawLine.trim();

        if(
            line === "" ||
            /^=+$/.test(line)
        )
        {
            continue;
        }

        const header =
            line.match(
                /^effect(\d+)\s*:\s*(.+)$/i
            );

        if(header)
        {
            if(currentId)
            {
                effects[currentId] =
                    currentData;
            }

            currentId =
                "effect" + header[1];

            currentData =
            {
                id: currentId,
                name:
                    header[2].trim().toLowerCase()
            };

            continue;
        }

        const kv =
            line.match(
                /^([A-Za-z0-9 _-]+?)\s*:\s*(.+)$/
            );

        if(kv && currentId)
        {
            const key =
                kv[1].trim().toLowerCase();

            const value =
                kv[2].trim();

            currentData[key] = value;
        }
    }

    if(currentId)
    {
        effects[currentId] = currentData;
    }

    for(const id in effects)
    {
        const effect = effects[id];

        if(effect.name === "wind")
        {
            effect.maxSpeed = 5;
            effect.changeRateMin = 0;
            effect.changeRateMax = 20;
        }

        if(effect.name === "smoke")
        {
            effect.fadeTime =
                firstNumber(
                    effect["smoke_fades"],
                    10
                );
        }
    }

    return effects;
}

// =====================================================
// WIND SYSTEM
// =====================================================

let windDirection = 0;
let windSpeed = 0;

let nextWindChange =
    performance.now();

function initWindSystem()
{
    randomizeWind();
}

function randomizeWind()
{
    windDirection =
        Math.random() * 360;

    windSpeed =
        Math.random() * 5;

    nextWindChange =
        performance.now() +
        Math.random() * 20000;
}

function updateWind()
{
    if(performance.now() > nextWindChange)
    {
        randomizeWind();
    }
}

// =====================================================
// EFFECT UPDATE
// =====================================================

function updateEffects()
{
    updateWind();

    for(
        let i = dustClouds.length - 1;
        i >= 0;
        i--
    )
    {
        const dust = dustClouds[i];

        dust.life--;

        dust.x +=
            Math.cos(windDirection * Math.PI / 180) *
            windSpeed * 0.1;

        dust.y +=
            Math.sin(windDirection * Math.PI / 180) *
            windSpeed * 0.1;

        if(dust.life <= 0)
        {
            dustClouds.splice(i, 1);
        }
    }

    for(
        let i = flashes.length - 1;
        i >= 0;
        i--
    )
    {
        flashes[i].life--;

        if(flashes[i].life <= 0)
        {
            flashes.splice(i, 1);
        }
    }

    for(
        let i = fires.length - 1;
        i >= 0;
        i--
    )
    {
        const fire = fires[i];

        fire.life--;

        if(fire.life <= 0)
        {
            fires.splice(i, 1);
        }
    }
}
// end

// =====================================================
// EFFECT DRAW
// =====================================================

function drawEffects()
{
    for(const dust of dustClouds)
    {
        const alpha =
            dust.life / dust.maxLife;

        const r =
            Math.round(
                (180 * 0.25) +
                (dust.color.r * 0.75)
            );

        const g =
            Math.round(
                (180 * 0.25) +
                (dust.color.g * 0.75)
            );

        const b =
            Math.round(
                (180 * 0.25) +
                (dust.color.b * 0.75)
            );

        ctx.fillStyle =
            "rgba(" + r + "," + g + "," + b + "," +
            (alpha * 0.4) + ")";

        ctx.beginPath();

        ctx.arc(
            dust.x,
            dust.y,
            dust.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    for(const flash of flashes)
    {
        const alpha =
            flash.life / flash.maxLife;

        const grownRadius =
            flash.radius *
            (1 + (1 - alpha) * 0.6);

        ctx.fillStyle =
            "rgba(255,255,220," + alpha + ")";

        ctx.beginPath();

        ctx.arc(
            flash.x,
            flash.y,
            grownRadius,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    for(const fire of fires)
    {
        const alpha =
            fire.life / fire.maxLife;

        const flicker =
            0.85 + Math.random() * 0.3;

        ctx.fillStyle =
            "rgba(255," +
            Math.floor(120 * alpha) +
            ",0," + (alpha * 0.8) + ")";

        ctx.beginPath();

        ctx.arc(
            fire.x,
            fire.y,
            fire.radius * flicker,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}
// end

// =====================================================
// OPTIONAL HUD HELPERS
// =====================================================

function getWindDirection()
{
    return windDirection;
}

function getWindSpeed()
{
    return windSpeed;
}