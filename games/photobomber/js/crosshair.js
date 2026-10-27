// =====================================================
// CROSSHAIR SYSTEM
// =====================================================

// --------------------------------
// MOUSE TRACKING
// --------------------------------

let mouseX = 0;
let mouseY = 0;

// --------------------------------
// IMAGE STORAGE
// --------------------------------

const crosshairImages = {};

// --------------------------------
// HIDE DEFAULT CURSOR
// --------------------------------

canvas.style.cursor = "none";

// --------------------------------
// TRACK MOUSE
// --------------------------------

canvas.addEventListener(
    "mousemove",
    e =>
    {
        const rect =
            canvas.getBoundingClientRect();

        mouseX =
            e.clientX -
            rect.left;

        mouseY =
            e.clientY -
            rect.top;
    }
);

// =====================================================
// LOAD CROSSHAIRS
// =====================================================

function loadCrosshairs()
{
    if(
        !weaponTypesReady
    )
    {
        return;
    }

    for(
        const weapon of weaponTypes
    )
    {
        if(
            !weapon.crosshair
        )
        {
            continue;
        }

        if(
            crosshairImages[
                weapon.id
            ]
        )
        {
            continue;
        }

        const img =
            new Image();

        img.src =
            "assets/" +
            weapon.crosshair;

        img.onerror =
            () =>
            {
                console.warn(
                    "crosshair not found:",
                    weapon.crosshair
                );
            };

        crosshairImages[
            weapon.id
        ] = img;
    }
}

// =====================================================
// GET CURRENT CROSSHAIR
// =====================================================

function getCurrentCrosshair()
{
    const weapon =
        getCurrentWeapon();

    if(!weapon)
    {
        return null;
    }

    return crosshairImages[
        weapon.id
    ];
}

// =====================================================
// DRAW CROSSHAIR
// =====================================================

function drawCrosshair()
{
    const img =
        getCurrentCrosshair();

    if(
        img &&
        img.complete &&
        img.naturalWidth > 0
    )
    {
        const size = 48;

        ctx.drawImage(
            img,
            mouseX - size / 2,
            mouseY - size / 2,
            size,
            size
        );

        return;
    }

    // --------------------------------
    // FALLBACK CROSSHAIR
    // --------------------------------

    ctx.strokeStyle =
        "lime";

    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.moveTo(
        mouseX - 10,
        mouseY
    );

    ctx.lineTo(
        mouseX + 10,
        mouseY
    );

    ctx.moveTo(
        mouseX,
        mouseY - 10
    );

    ctx.lineTo(
        mouseX,
        mouseY + 10
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
        mouseX,
        mouseY,
        8,
        0,
        Math.PI * 2
    );

    ctx.stroke();
}

// =====================================================
// WAIT FOR WEAPONS
// =====================================================

const crosshairLoader =
setInterval(
    () =>
    {
        if(
            weaponTypesReady
        )
        {
            loadCrosshairs();

            clearInterval(
                crosshairLoader
            );
        }
    },
    250
);