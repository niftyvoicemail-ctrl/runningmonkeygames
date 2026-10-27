/*
==============================================================================
INPUT
==============================================================================

Minimal input layer for the menu screens.

Tracks:

    mouse position

    a single "consumable" click
        (taken by whichever screen handles it,
         so one click never triggers two screens)

    any key / any press
        (used by the title screen)

Gameplay input (firing, crosshair) still lives in
weapons.js and crosshair.js - this does NOT replace it.

==============================================================================
*/

const input =
{
    mouseX: 0,
    mouseY: 0,

    // set true on click, cleared when a screen takes it

    clickPending: false,

    clickX: 0,
    clickY: 0,

    // set true on any key / click, cleared when read

    pressPending: false,

    //----------------------------------------------------------------------
    // take click
    //----------------------------------------------------------------------
    // returns {x, y} once, then clears.
    // returns null if there is no unhandled click.

    takeClick()
    {
        if (!this.clickPending)
        {
            return null;
        }

        this.clickPending = false;

        return {
            x: this.clickX,
            y: this.clickY
        };
    },

    //----------------------------------------------------------------------
    // any pressed
    //----------------------------------------------------------------------
    // true once after any key or click, then clears.

    anyPressed()
    {
        if (!this.pressPending)
        {
            return false;
        }

        this.pressPending = false;

        // a press also eats the click so the
        // next screen doesn't immediately
        // receive it

        this.clickPending = false;

        return true;
    },

    //----------------------------------------------------------------------
    // clear
    //----------------------------------------------------------------------

    clear()
    {
        this.clickPending = false;
        this.pressPending = false;
    }
};

//--------------------------------------------------------------------------
// WIRE UP
//--------------------------------------------------------------------------

window.addEventListener(
    "keydown",
    () =>
    {
        input.pressPending = true;
    }
);

canvas.addEventListener(
    "mousemove",
    (e) =>
    {
        const rect =
            canvas.getBoundingClientRect();

        input.mouseX =
            e.clientX - rect.left;

        input.mouseY =
            e.clientY - rect.top;
    }
);

canvas.addEventListener(
    "mousedown",
    (e) =>
    {
        const rect =
            canvas.getBoundingClientRect();

        input.clickX =
            e.clientX - rect.left;

        input.clickY =
            e.clientY - rect.top;

        input.clickPending = true;
        input.pressPending = true;
    },

    // capture phase - runs before the
    // gameplay listeners in weapons.js

    true
);
