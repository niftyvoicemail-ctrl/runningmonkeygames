// =====================================================
// MAP SYSTEM
// =====================================================

console.log("map.js loaded");

// -----------------------------------------------------
// NEW TERRAIN DATA
// -----------------------------------------------------

let brightnessMap = [];

let materialMap = [];

let colorMap = [];

// grid resolution, in original-photo pixels per cell.
// this needs to match creep scale, not just be "fine
// enough to look nice" - getBrightnessAt can only ever
// resolve down to one whole cell, so a foxhole can never
// be smaller than this value. a soldier sprite is 2px
// tall (~6' equivalent), so the grid is set to match:
// one foxhole = one cell = roughly one soldier's footprint.
//
// heads up: this is a big jump in resolution (11 -> 2 is
// ~30x more cells across a typical photo), so the one-time
// scan when a new photo loads will take noticeably longer
// than before. worth watching if that becomes annoying.

const BRIGHTNESS_STEP = 2;

// -----------------------------------------------------
// MAP LOADED
// -----------------------------------------------------

mapImage.onload = () =>
{
    console.log(
        "MAP LOADED",
        mapImage.naturalWidth,
        mapImage.naturalHeight
    );

    findDarkSpots();
};

// -----------------------------------------------------
// MAP FAILED
// -----------------------------------------------------

mapImage.onerror = () =>
{
    console.error(
        "MAP FAILED:",
        mapImage.src
    );
};

// -----------------------------------------------------
// MAP SOURCE
// -----------------------------------------------------
// no more default sample JPG - mapImage.src now gets set
// either by camera.js (doSnap, on a successful capture)
// or by picking a file below. mapImage.onload above
// handles both the same way.

// -----------------------------------------------------
// MAP PICKER
// -----------------------------------------------------

const mapPickerBtn =
    document.getElementById(
        "mapPickerBtn"
    );

const mapPickerInput =
    document.getElementById(
        "mapPickerInput"
    );

mapPickerBtn.addEventListener(
    "click",
    () =>
    {
        mapPickerInput.click();
    }
);

mapPickerInput.addEventListener(
    "change",
    (e) =>
    {
        const file =
            e.target.files[0];

        if(!file)
        {
            return;
        }

        console.log(
            "custom map:",
            file.name
        );

        const objectUrl =
            URL.createObjectURL(
                file
            );

        mapImage.src =
            objectUrl;
    }
);

// -----------------------------------------------------
// BUILD BRIGHTNESS MAP
// -----------------------------------------------------

function findDarkSpots()
{
    if(
        mapImage.naturalWidth <= 0 ||
        mapImage.naturalHeight <= 0
    )
    {
        console.log(
            "dark spot scan skipped"
        );

        return;
    }

    const tempCanvas =
        document.createElement(
            "canvas"
        );

    const tempCtx =
        tempCanvas.getContext(
            "2d"
        );

    tempCanvas.width =
        mapImage.naturalWidth;

    tempCanvas.height =
        mapImage.naturalHeight;

    tempCtx.drawImage(
        mapImage,
        0,
        0
    );

    const pixels =
        tempCtx.getImageData(
            0,
            0,
            tempCanvas.width,
            tempCanvas.height
        ).data;

    darkSpots = [];

    brightnessMap = [];

    materialMap = [];

    colorMap = [];

    // a new photo means a new battlefield -
    // old trench positions no longer mean
    // anything on this image

    if (
        typeof resetTrenches ===
        "function"
    )
    {
        resetTrenches();
    }

    for(
        let y = 0;
        y < tempCanvas.height;
        y += BRIGHTNESS_STEP
    )
    {
        brightnessMap.push([]);

        materialMap.push([]);

        colorMap.push([]);

        for(
            let x = 0;
            x < tempCanvas.width;
            x += BRIGHTNESS_STEP
        )
        {
            const i =
                (
                    y *
                    tempCanvas.width +
                    x
                ) * 4;

 let brightness =
    (
        pixels[i] +
        pixels[i + 1] +
        pixels[i + 2]
    ) / 3;

// --------------------------------
// MATERIAL CLASSIFICATION
// --------------------------------
// uses the RAW pixel color (before
// the edge halo / bottom-white
// overrides below touch brightness)
// since those are gameplay-only
// tweaks, not the actual photo.

const material =
    classifyMaterial(
        pixels[i],
        pixels[i + 1],
        pixels[i + 2]
    );

materialMap[
    materialMap.length - 1
].push(material);

// --------------------------------
// RAW COLOR (for effects like dust
// that want to tint toward what was
// actually hit, not just gameplay
// brightness)
// --------------------------------

colorMap[
    colorMap.length - 1
].push(
{
    r: pixels[i],
    g: pixels[i + 1],
    b: pixels[i + 2]
});

// --------------------------------
// EDGE HALO
// --------------------------------

const edgeDistance =
    Math.min(
        x,
        y,
        tempCanvas.width - 1 - x,
        tempCanvas.height - 1 - y
    );

const imageSize =
    Math.min(
        tempCanvas.width,
        tempCanvas.height
    );

// 5% solid wall

const wallSize =
    imageSize * 0.05;

// 10% fade

const fadeSize =
    imageSize * 0.10;

if(edgeDistance < wallSize)
{
    brightness = 255;
}
else if(
    edgeDistance <
    wallSize + fadeSize
)
{
    const t =
        (
            edgeDistance -
            wallSize
        ) /
        fadeSize;

    brightness =
        255 +
        (
            brightness -
            255
        ) * t;
}

// --------------------------------
// DEBUG TEST
// FORCE BOTTOM WHITE
// --------------------------------

if(
    y >
    tempCanvas.height - 50
)
{
    brightness = 255;
}

brightness =
    Math.max(
        0,
        Math.min(
            255,
            brightness
        )
    );

// end

            brightnessMap[
                brightnessMap.length - 1
            ].push(
                brightness
            );

            // KEEP OLD SYSTEM ALIVE

            if(brightness < 80)
            {
                darkSpots.push({
                    x: x,
                    y: y
                });
            }
        }
    }

    console.log(
        "dark spots:",
        darkSpots.length
    );

    console.log(
        "brightness cells:",
        brightnessMap.length
    );
}

// -----------------------------------------------------
// COVER MAPPING (scale to fill, crop overflow)
// -----------------------------------------------------
// used by both the visible photo draw (draw.js) and
// getBrightnessAt below, so what's on screen and what
// creeps "see" always agree on where things are. without
// this, the photo was being stretched to exactly
// canvas.width x canvas.height regardless of its actual
// aspect ratio - same distortion you'd get force-fitting
// a photo into the wrong-shaped frame.

function getCoverMapping()
{
    const canvasRatio =
        canvas.width /
        canvas.height;

    const imgRatio =
        mapImage.naturalWidth /
        mapImage.naturalHeight;

    let srcX;
    let srcY;
    let srcW;
    let srcH;

    if(imgRatio > canvasRatio)
    {
        // image is proportionally wider than the
        // canvas - use full height, crop left/right

        srcH =
            mapImage.naturalHeight;

        srcW =
            srcH * canvasRatio;

        srcX =
            (
                mapImage.naturalWidth -
                srcW
            ) / 2;

        srcY = 0;
    }
    else
    {
        // image is proportionally taller than the
        // canvas - use full width, crop top/bottom

        srcW =
            mapImage.naturalWidth;

        srcH =
            srcW / canvasRatio;

        srcX = 0;

        srcY =
            (
                mapImage.naturalHeight -
                srcH
            ) / 2;
    }

    return {
        srcX: srcX,
        srcY: srcY,
        srcW: srcW,
        srcH: srcH,
        scale:
            canvas.width /
            srcW
    };
}

// -----------------------------------------------------
// SCREEN TO GRID (shared by material/color/brightness
// lookups so they all agree on the same cell for the
// same screen position)
// -----------------------------------------------------

function screenToGrid(
    screenX,
    screenY
)
{
    const cover =
        getCoverMapping();

    const imageX =
        Math.floor(
            screenX /
            cover.scale +
            cover.srcX
        );

    const imageY =
        Math.floor(
            screenY /
            cover.scale +
            cover.srcY
        );

    return {
        gridX:
            Math.floor(
                imageX /
                BRIGHTNESS_STEP
            ),

        gridY:
            Math.floor(
                imageY /
                BRIGHTNESS_STEP
            )
    };
}

// -----------------------------------------------------
// GRID TO SCREEN
// -----------------------------------------------------
// inverse of screenToGrid - gives the screen position of
// a grid cell's centre. used by the trench system, which
// stores positions in grid (image) space so they survive
// a window resize.

function gridToScreen(
    gridX,
    gridY
)
{
    const cover =
        getCoverMapping();

    const imageX =
        (gridX + 0.5) *
        BRIGHTNESS_STEP;

    const imageY =
        (gridY + 0.5) *
        BRIGHTNESS_STEP;

    return {
        x:
            (imageX - cover.srcX) *
            cover.scale,

        y:
            (imageY - cover.srcY) *
            cover.scale
    };
}

// -----------------------------------------------------
// MATERIAL CLASSIFICATION
// -----------------------------------------------------
// simple color-rule classifier - no ML, just the same
// kind of RGB heuristics as a skin-tone check, tuned for
// what matters for burning: water doesn't burn, metal/
// reflective surfaces resist, foliage catches fast but
// burns out quickly, everything else ("generic" - wood,
// fabric, paper, skin, whatever) burns based on how dark
// it is.

function classifyMaterial(
    r,
    g,
    b
)
{
    const brightness =
        (r + g + b) / 3;

    const max =
        Math.max(r, g, b);

    const min =
        Math.min(r, g, b);

    const saturation =
        max - min;

    // water - blue clearly dominant

    if(
        b > r &&
        b > g &&
        (b - r) > 15
    )
    {
        return "water";
    }

    // metal / reflective - very
    // bright with little color
    // variation (grey, not tinted)

    if(
        brightness > 190 &&
        saturation < 25
    )
    {
        return "metal";
    }

    // foliage - green clearly
    // dominant

    if(
        g > r &&
        g > b &&
        (g - r) > 10
    )
    {
        return "foliage";
    }

    return "generic";
}

// -----------------------------------------------------
// GET MATERIAL AT SCREEN POSITION
// -----------------------------------------------------

function getMaterialAt(
    screenX,
    screenY
)
{
    if(
        !materialMap ||
        materialMap.length === 0
    )
    {
        return "generic";
    }

    const grid =
        screenToGrid(
            screenX,
            screenY
        );

    if(
        grid.gridY < 0 ||
        grid.gridY >= materialMap.length
    )
    {
        return "generic";
    }

    if(
        grid.gridX < 0 ||
        grid.gridX >= materialMap[grid.gridY].length
    )
    {
        return "generic";
    }

    return materialMap[grid.gridY][grid.gridX];
}

// -----------------------------------------------------
// GET RAW COLOR AT SCREEN POSITION
// -----------------------------------------------------
// the actual photo color at this point, unaffected by
// the edge-halo/base-black-hole gameplay tweaks that
// getBrightnessAt applies. falls back to a neutral grey
// if there's no map loaded yet.

function getColorAt(
    screenX,
    screenY
)
{
    const fallback =
    {
        r: 180,
        g: 180,
        b: 180
    };

    if(
        !colorMap ||
        colorMap.length === 0
    )
    {
        return fallback;
    }

    const grid =
        screenToGrid(
            screenX,
            screenY
        );

    if(
        grid.gridY < 0 ||
        grid.gridY >= colorMap.length
    )
    {
        return fallback;
    }

    if(
        grid.gridX < 0 ||
        grid.gridX >= colorMap[grid.gridY].length
    )
    {
        return fallback;
    }

    return colorMap[grid.gridY][grid.gridX];
}

// -----------------------------------------------------
// GET BURN FACTOR AT SCREEN POSITION
// -----------------------------------------------------
// 0 = won't ignite at all, higher = catches easier and
// (for "generic") burns longer. this is what fire
// ignition chance and fire lifetime should scale off of.

function getBurnFactor(
    screenX,
    screenY
)
{
    const material =
        getMaterialAt(
            screenX,
            screenY
        );

    if(material === "water")
    {
        return 0;
    }

    if(material === "metal")
    {
        return 0.05;
    }

    if(material === "foliage")
    {
        return 0.6;
    }

    // generic - darker burns hotter/
    // longer, but nothing is fully
    // fireproof and nothing is a
    // guaranteed instant catch

    const brightness =
        getBrightnessAt(
            screenX,
            screenY
        );

    return Math.max(
        0.1,
        1 -
        (brightness / 255) *
        0.9
    );
}

// -----------------------------------------------------
// GET BRIGHTNESS AT SCREEN POSITION
// -----------------------------------------------------

function getBrightnessAt(
    screenX,
    screenY
)
{
    if(
        !brightnessMap ||
        brightnessMap.length === 0
    )
    {
        return 255;
    }

    const grid =
        screenToGrid(
            screenX,
            screenY
        );

    if(
        grid.gridY < 0 ||
        grid.gridY >= brightnessMap.length
    )
    {
        return 9999;
    }

    if(
        grid.gridX < 0 ||
        grid.gridX >= brightnessMap[grid.gridY].length
    )
    {
        return 9999;
    }

    let brightness =
    brightnessMap
        [grid.gridY]
        [grid.gridX];

// --------------------------------
// TRENCH SHELTER
// --------------------------------
// this is the real gameplay effect of a trench - the
// creep map goes ~90% black here, so CR2 (fear of light)
// steers soldiers toward it exactly like a naturally
// dark spot. O(1) grid lookup, because this function
// runs thousands of times per frame.

if (
    typeof getTrenchDarknessAtGrid ===
    "function"
)
{
    brightness *=
        getTrenchDarknessAtGrid(
            grid.gridX,
            grid.gridY
        );
}

// --------------------------------
// BASE BLACK HOLE
// --------------------------------

if(playerBase)
{
    const dx =
        screenX -
        playerBase.x;

    const dy =
        screenY -
        playerBase.y;

    const dist =
        Math.hypot(
            dx,
            dy
        );

    // ------------------------
    // TUNING DIALS
    // ------------------------

    const coreRadius =
        25;

    const fadeRadius =
        150;

    // ------------------------
    // BLACK CORE
    // ------------------------

    if(dist <= coreRadius)
    {
        brightness = 0;
    }

    // ------------------------
    // FADE ZONE
    // ------------------------

    else if(
        dist < fadeRadius
    )
    {
        const t =
            (
                dist -
                coreRadius
            ) /
            (
                fadeRadius -
                coreRadius
            );

        brightness *=
    0.25 +
    (0.75 * t);
    }
}

brightness =
    Math.max(
        0,
        Math.min(
            255,
            brightness
        )
    );

return brightness;

// end
}

// end