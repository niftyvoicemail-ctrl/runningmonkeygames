// =====================================================
// CREEP DRAWING
// =====================================================

// --------------------------------
// CREEP01 SOLDIER
// --------------------------------

const SHOW_CREEP_MAP = false;

// end

function drawCreep01(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle +
        Math.PI / 2
    );

    ctx.fillStyle = "lime";

    ctx.fillRect(
        -0.5,
        -1,
        1,
        1
    );

    ctx.fillStyle = "red";

    ctx.fillRect(
        -0.5,
        0,
        1,
        1
    );

    ctx.restore();
}

// --------------------------------
// CREEP02 COMMANDER
// --------------------------------

function drawCreep02(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle +
        Math.PI / 2
    );

    ctx.fillStyle = "cyan";

    ctx.fillRect(
        -0.5,
        -1,
        1,
        1
    );

    ctx.fillStyle = "blue";

    ctx.fillRect(
        -0.5,
        0,
        1,
        1
    );

    ctx.restore();
}

// --------------------------------
// CREEP03 ATV
// --------------------------------

function drawCreep03(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle +
        Math.PI / 2
    );

    ctx.fillStyle = "orange";

    ctx.fillRect(-1,-1,1,1);
    ctx.fillRect( 0,-1,1,1);

    ctx.fillStyle = "saddlebrown";

    ctx.fillRect(-1,0,1,1);
    ctx.fillRect( 0,0,1,1);

    ctx.restore();
}

// --------------------------------
// CREEP04 JEEP
// --------------------------------

function drawCreep04(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle +
        Math.PI / 2
    );

    ctx.fillStyle = "yellow";

    ctx.fillRect(-1,-2,1,1);
    ctx.fillRect( 0,-2,1,1);

    ctx.fillStyle = "gold";

    ctx.fillRect(-1,-1,1,1);
    ctx.fillRect( 0,-1,1,1);

    ctx.fillStyle = "saddlebrown";

    ctx.fillRect(-1,0,1,1);
    ctx.fillRect( 0,0,1,1);

    ctx.restore();
}

// --------------------------------
// CREEP05 TRUCK
// --------------------------------

function drawCreep05(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle +
        Math.PI / 2
    );

    ctx.fillStyle = "yellow";

    ctx.fillRect(-1,-3,1,1);
    ctx.fillRect( 0,-3,1,1);

    ctx.fillStyle = "gold";

    ctx.fillRect(-1,-2,1,1);
    ctx.fillRect( 0,-2,1,1);

    ctx.fillStyle = "peru";

    ctx.fillRect(-1,-1,1,1);
    ctx.fillRect( 0,-1,1,1);

    ctx.fillStyle = "saddlebrown";

    ctx.fillRect(-1,0,1,1);
    ctx.fillRect( 0,0,1,1);

    ctx.restore();
}

// --------------------------------
// CREEP06 TANK
// --------------------------------

function drawCreep06(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle +
        Math.PI / 2
    );

    ctx.fillStyle = "yellow";

    for(let x=-2;x<=1;x++)
    {
        ctx.fillRect(x,-5,1,1);
        ctx.fillRect(x,-4,1,1);
    }

    ctx.fillStyle = "orange";

    for(let x=-2;x<=1;x++)
    {
        ctx.fillRect(x,-3,1,1);
        ctx.fillRect(x,-2,1,1);
    }

    ctx.fillStyle = "saddlebrown";

    for(let x=-2;x<=1;x++)
    {
        ctx.fillRect(x,-1,1,1);
        ctx.fillRect(x, 0,1,1);
    }

    ctx.restore();
}

// --------------------------------
// CREEP07 PARATROOPER
// --------------------------------

function drawCreep07(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle
    );

    // canopy

    ctx.strokeStyle =
        "white";

    ctx.strokeRect(
        -5,
        -5,
        10,
        10
    );

    // suspension lines

    ctx.beginPath();

    ctx.moveTo(-5,-5);
    ctx.lineTo(0,0);

    ctx.moveTo( 5,-5);
    ctx.lineTo(0,0);

    ctx.moveTo(-5, 5);
    ctx.lineTo(0,0);

    ctx.moveTo( 5, 5);
    ctx.lineTo(0,0);

    ctx.stroke();

    // trooper

    ctx.fillStyle =
        "yellow";

    ctx.fillRect(
        -2,
        -2,
        4,
        4
    );

    ctx.restore();
}

// end



// --------------------------------
// CREEP08 BIPLANE
// --------------------------------

function drawCreep08(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle -
        Math.PI / 2
    );

    // fuselage

    ctx.fillStyle =
        "lightblue";

    ctx.fillRect(
        -1,
        -6,
         2,
        12
    );

    // upper wing

    ctx.fillRect(
        -7,
        -3,
        14,
         2
    );

    // lower wing

    ctx.fillRect(
        -7,
         1,
        14,
         2
    );

    // tail fin

    ctx.fillRect(
        -1,
        -8,
         2,
         2
    );

    // nose marker

    ctx.fillStyle =
        "red";

    ctx.fillRect(
        -1,
         6,
         2,
         2
    );

    ctx.restore();
}

// end

// --------------------------------
// CREEP09 MINI BLIMP
// --------------------------------

function drawCreep09(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle -
        Math.PI / 2
    );

    ctx.fillStyle =
        "silver";

    // main envelope

    ctx.fillRect(
        -2,
        -8,
         4,
        16
    );

    ctx.fillRect(
        -4,
        -5,
         8,
        10
    );

    // rear stabilizers

    ctx.fillStyle =
        "lightgray";

    ctx.fillRect(
        -4,
        -10,
         2,
         3
    );

    ctx.fillRect(
         2,
        -10,
         2,
         3
    );

    ctx.restore();
}

// end

// --------------------------------
// CREEP10 AIRSHIP
// --------------------------------

function drawCreep10(c)
{
    ctx.save();

    ctx.translate(
        c.x,
        c.y
    );

    ctx.rotate(
        c.angle -
        Math.PI / 2
    );

    ctx.fillStyle =
        "silver";

    // main envelope

    ctx.fillRect(
        -4,
        -14,
         8,
        28
    );

    ctx.fillRect(
        -7,
        -10,
        14,
        20
    );

    // stabilizers

    ctx.fillStyle =
        "lightgray";

    ctx.fillRect(
        -6,
        -17,
         3,
         4
    );

    ctx.fillRect(
         3,
        -17,
         3,
         4
    );

    // gondola

    ctx.fillStyle =
        "gray";

    ctx.fillRect(
        -1,
         8,
         2,
         4
    );

    ctx.restore();
}

// end


// =====================================================
// DRAW DISPATCHER
// =====================================================

function drawCreep(c)
{
    switch(c.rawId)
    {
        case "creep01":
            drawCreep01(c);
            break;

        case "creep02":
            drawCreep02(c);
            break;

        case "creep03":
            drawCreep03(c);
            break;

        case "creep04":
            drawCreep04(c);
            break;

        case "creep05":
            drawCreep05(c);
            break;

        case "creep06":
            drawCreep06(c);
            break;

        case "creep07":
            drawCreep07(c);
            break;

        case "creep08":
            drawCreep08(c);
            break;

        case "creep09":
            drawCreep09(c);
            break;

        case "creep10":
            drawCreep10(c);
            break;
    }
}

// end

// =====================================================
// MAIN DRAW
// =====================================================

function draw()
{
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

// --------------------------------
// MAP
// --------------------------------

if(
    mapImage.complete &&
    mapImage.naturalWidth > 0
)
{
    if(!SHOW_CREEP_MAP)
    {
        // scale to fill the canvas and crop the
        // overflow, instead of stretching the photo
        // to exactly canvas.width x canvas.height
        // (which distorted its aspect ratio). same
        // mapping getBrightnessAt uses, so what's
        // drawn here and what creeps react to agree.

        const cover =
            getCoverMapping();

        ctx.drawImage(
            mapImage,
            cover.srcX,
            cover.srcY,
            cover.srcW,
            cover.srcH,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    else
    {
        const rows =
            brightnessMap.length;

        const cols =
            brightnessMap[0].length;

        const cellWidth =
            canvas.width / cols;

        const cellHeight =
            canvas.height / rows;

        for(
            let gy = 0;
            gy < rows;
            gy++
        )
        {
            for(
                let gx = 0;
                gx < cols;
                gx++
            )
            {
                const screenX =
    gx * cellWidth;

const screenY =
    gy * cellHeight;

const brightness =
    Math.min(
        255,
        getBrightnessAt(
            screenX,
            screenY
        )
    );

                ctx.fillStyle =
                    "rgb(" +
                    brightness + "," +
                    brightness + "," +
                    brightness + ")";

                ctx.fillRect(
                    gx * cellWidth,
                    gy * cellHeight,
                    cellWidth + 1,
                    cellHeight + 1
                );
            }
        }
    }
}

// end

// --------------------------------
// PLAYER BASE
// --------------------------------

if(playerBase)
{
    const size = 12;

    ctx.fillStyle =
        "gold";

    ctx.fillRect(
        playerBase.x - size / 2,
        playerBase.y - size / 2,
        size,
        size
    );

    ctx.fillStyle =
        "yellow";

    ctx.fillRect(
        playerBase.x - 4,
        playerBase.y - 5,
        3,
        3
    );

    ctx.fillRect(
        playerBase.x + 1,
        playerBase.y - 3,
        3,
        3
    );

    ctx.fillRect(
        playerBase.x - 2,
        playerBase.y + 1,
        3,
        3
    );

    ctx.strokeStyle =
        "black";

    ctx.strokeRect(
        playerBase.x - size / 2,
        playerBase.y - size / 2,
        size,
        size
    );
}

// end

// end

    // --------------------------------
// DANGER MARKER
// --------------------------------

// visual marker removed

// end


    // --------------------------------
    // DRAW CREEPS
    // --------------------------------

    const counts = {};

    for(const c of creeps)
    {
        counts[c.name] =
            (counts[c.name] || 0) + 1;

        drawCreep(c);

        // ----------------------------
        // HP READOUT (debug)
        // ----------------------------
        // only for things that take more than
        // one hit - 1hp units die instantly so
        // there's nothing to track.

        if(c.maxHp > 1)
        {
            ctx.fillStyle = "white";

            ctx.font = "10px Arial";

            ctx.fillText(
                c.hp +
                "/" +
                c.maxHp,
                c.x + 6,
                c.y - 6
            );
        }

        // ----------------------------
        // CREW READOUT
        // ----------------------------
        // vehicles with an "ability: can spawn N
        // solders when damaged" line carry a crew
        // count (spawnOnDeath) that AP rounds
        // (bullet01) chip away at directly - see
        // ammoEffects.js's AP CREW KILL block. this
        // just makes that visible instead of only
        // showing up in console logs.

        if(c.maxSpawnOnDeath > 0)
        {
            ctx.fillStyle =
                c.spawnOnDeath > 0
                    ? "orange"
                    : "red";

            ctx.font = "10px Arial";

            const crewLabel =
                c.spawnOnDeath > 0
                    ? "Crew: " +
                      c.spawnOnDeath +
                      "/" +
                      c.maxSpawnOnDeath
                    : "DISABLED";

            ctx.fillText(
                crewLabel,
                c.x + 6,
                c.y + 14
            );
        }
    }
	
	if(waitingForBasePlacement)
{
    ctx.fillStyle =
        "white";

    ctx.font =
        "24px Arial";

    ctx.fillText(
        "Click to place your base",
        canvas.width / 2 - 120,
        40
    );
}

// end

    // --------------------------------
    // HUD
    // --------------------------------

    ctx.fillStyle = "lime";

    ctx.font =
        "16px Arial";

    if(!creepTypesReady)
    {
        ctx.fillText(
            "loading...",
            10,
            20
        );

        return;
    }

    let lineY = 20;

 ctx.fillText(
    "Score: " +
    score,
    10,
    lineY
);

lineY += 20;

ctx.fillText(
    "Anti Score: " +
    antiScore,
    10,
    lineY
);

lineY += 20;

// end   

    for(
        const name of
        Object.keys(counts)
    )
    {
        ctx.fillText(
            name +
            ": " +
            counts[name],
            10,
            lineY
        );

        lineY += 20;
    }
	// --------------------------------
// WEAPON HUD
// --------------------------------

if(
    typeof getCurrentWeapon ===
    "function"
)
{
    const weapon =
        getCurrentWeapon();

    if(weapon)
    {
        ctx.fillStyle =
            "yellow";

        ctx.fillText(
            "Weapon: " +
            weapon.name,
            10,
            lineY
        );

        lineY += 20;
    }
}

if(
    typeof getAmmoType ===
    "function" &&
    currentAmmoId
)
{
    const ammo =
        getAmmoType(
            currentAmmoId
        );

    if(ammo)
    {
        ctx.fillStyle =
            "orange";

        ctx.fillText(
            "Ammo: " +
            ammo.name,
            10,
            lineY
        );

        lineY += 20;

        ctx.fillText(
            "Damage: " +
            ammo.damageHit,
            10,
            lineY
        );

        lineY += 20;

        ctx.fillText(
            "Radius: " +
            ammo.splashRadius,
            10,
            lineY
        );
		

        lineY += 20;
    }
}	
	
// --------------------------------
// WIND HUD
// --------------------------------

if(
    typeof windSpeed !==
    "undefined"
)
{
    ctx.fillStyle =
        "cyan";

    ctx.fillText(
        "Wind Speed: " +
        windSpeed.toFixed(1),
        10,
        lineY
    );

    lineY += 20;
}

if(
    typeof windDirection !==
    "undefined"
)
{
    ctx.fillStyle =
        "cyan";

    ctx.fillText(
        "Wind Direction: " +
        Math.round(
            windDirection
        ) +
        "°",
        10,
        lineY
    );

    lineY += 20;
}
// --------------------------------
// CROSSHAIR
// --------------------------------

if(
    typeof drawCrosshair ===
    "function"
)
{
    drawCrosshair();
}
}