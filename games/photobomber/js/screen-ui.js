/*
==============================================================================
SCREEN UI
==============================================================================

Shared base class for menu screens.

Handles the boring parts so each screen only has to say
what its title is and what its buttons do:

    button layout

    hover highlight

    click detection

    background / title / body text drawing

USAGE
------------------------------------------------------------------------------

class ScreenThing extends MenuScreen
{
    constructor()
    {
        super("THING");
    }

    open()
    {
        this.setButtons(
        [
            {
                label: "Do Something",
                action: () => { ... }
            },

            {
                label: "Return To Main Hub",
                action: () =>
                    screenManager.changeScreenByName("hub")
            }
        ]);
    }
}

==============================================================================
*/

class MenuScreen
{
    constructor(title)
    {
        this.title = title;

        this.buttons = [];

        // free text drawn above the buttons

        this.lines = [];

        this.buttonWidth = 520;
        this.buttonHeight = 70;
        this.buttonGap = 12;
    }

    //----------------------------------------------------------------------
    // set buttons
    //----------------------------------------------------------------------

    setButtons(list)
    {
        this.buttons = list || [];
    }

    setLines(list)
    {
        this.lines = list || [];
    }

    //----------------------------------------------------------------------
    // layout
    //----------------------------------------------------------------------
    // recalculated every frame so it survives
    // window resizing

    layout()
    {
        const totalHeight =
            this.buttons.length *
            (this.buttonHeight + this.buttonGap);

        const startY =
    Math.max(
        200,
        (canvas.height - totalHeight) / 2
    );

        const x =
            (canvas.width - this.buttonWidth) / 2;

        for (
            let i = 0;
            i < this.buttons.length;
            i++
        )
        {
            const b = this.buttons[i];

            b.x = x;

            b.y =
                startY +
                i * (this.buttonHeight + this.buttonGap);

            b.w = this.buttonWidth;
            b.h = this.buttonHeight;
        }
    }

    //----------------------------------------------------------------------
    // hit test
    //----------------------------------------------------------------------

    hitTest(px, py)
    {
        for (const b of this.buttons)
        {
            if (
                px >= b.x &&
                px <= b.x + b.w &&
                py >= b.y &&
                py <= b.y + b.h
            )
            {
                return b;
            }
        }

        return null;
    }

    //----------------------------------------------------------------------
    // open / close
    //----------------------------------------------------------------------

    open()
    {

    }

    close()
    {

    }

    //----------------------------------------------------------------------
    // update
    //----------------------------------------------------------------------

    update(delta)
    {
        this.layout();

        const click = input.takeClick();

        if (!click)
        {
            return;
        }

        const hit =
            this.hitTest(
                click.x,
                click.y
            );

        if (
            hit &&
            typeof hit.action === "function"
        )
        {
            soundManager.playSound(
                hit.sound,
                0.4
            );

            hit.action();
        }
    }

    //----------------------------------------------------------------------
    // draw
    //----------------------------------------------------------------------

    draw(ctx)
    {
        this.layout();

        // ---------------- background
// Screen handles its own background

/*

    0,
    0,
    canvas.width,
    canvas.height
);
*/

        // ---------------- title

        ctx.fillStyle = "#d8b46a";
        ctx.textAlign = "center";
        ctx.font = "bold 48px Georgia";

        ctx.fillText(
            this.title,
            canvas.width / 2,
            90
        );

        // ---------------- body lines

        ctx.font = "15px Arial";
        ctx.fillStyle = "#b99d67";

        let lineY = 125;

        for (const line of this.lines)
        {
            ctx.fillText(
                line,
                canvas.width / 2,
                lineY
            );

            lineY += 20;
        }

        // ---------------- buttons

        for (const b of this.buttons)
        {
            const hovered =
                input.mouseX >= b.x &&
                input.mouseX <= b.x + b.w &&
                input.mouseY >= b.y &&
                input.mouseY <= b.y + b.h;

            ctx.fillStyle =
                hovered
                    ? "#5a4020"
                    : "#2a1d10";

            ctx.fillRect(
                b.x,
                b.y,
                b.w,
                b.h
            );

            ctx.strokeStyle =
                hovered
                    ? "#d8b46a"
                    : "#8b6a2b";

            ctx.lineWidth = 2;

            ctx.strokeRect(
                b.x,
                b.y,
                b.w,
                b.h
            );

            ctx.fillStyle =
                hovered
                    ? "#fff0c0"
                    : "#d8c090";

            ctx.font = "26px Georgia";
            ctx.textAlign = "center";

            ctx.fillText(
                b.label,
                b.x + b.w / 2,
                b.y + b.h / 2 + 6
            );

            // optional right-aligned value
            // (used for ON/OFF toggles)

            if (b.value !== undefined)
            {
                ctx.textAlign = "right";

                ctx.fillStyle = "#6fcf6f";

                ctx.fillText(
                    b.value,
                    b.x + b.w - 16,
                    b.y + b.h / 2 + 6
                );

                ctx.textAlign = "center";
            }
        }

        ctx.textAlign = "left";
    }
}
