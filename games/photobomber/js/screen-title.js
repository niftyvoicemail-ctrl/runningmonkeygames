/*
==============================================================================
SCREEN TITLE
==============================================================================

    music: 101-title_music.wav
    image: 101-title_image.png

Any key / click advances to the save menu.

NOTE
------------------------------------------------------------------------------
The image is drawn only once it has actually loaded. If the
asset is missing, the screen still works - it just falls back
to a plain background instead of throwing on every frame.

Browsers block audio until the player interacts with the page,
so the music is also (re)started on that first press.

==============================================================================
*/

class ScreenTitle
{
    constructor()
    {
        this.image = null;

        this.imageReady = false;

        this.blinkTimer = 0;
    }

    //----------------------------------------------------------------------
    // open
    //----------------------------------------------------------------------

    open()
    {
        console.log("TITLE OPEN");

        this.image = new Image();

        this.imageReady = false;

        this.image.onload = () =>
        {
            this.imageReady = true;
        };

        this.image.onerror = () =>
        {
            console.warn(
                "title image not found:",
                this.image.src
            );
        };

        this.image.src =
            "assets/101-title_image.png";

        soundManager.playMusic(
            "101-title_music.wav"
        );
    }

    //----------------------------------------------------------------------
    // close
    //----------------------------------------------------------------------

    close()
    {
        console.log("TITLE CLOSE");
    }

    //----------------------------------------------------------------------
    // update
    //----------------------------------------------------------------------

    update(delta)
    {
        this.blinkTimer += delta;

        if (input.anyPressed())
        {
            // autoplay unlock - the first real
            // interaction lets music start

            soundManager.playMusic(
                "101-title_music.wav"
            );

            screenManager.changeScreenByName(
                "menu"
            );
        }
    }

    //----------------------------------------------------------------------
    // draw
    //----------------------------------------------------------------------

    draw(ctx)
    {
        ctx.fillStyle = "#08080c";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        if (
            this.imageReady &&
            this.image.naturalWidth > 0
        )
        {
            ctx.drawImage(
                this.image,
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
        else
        {
            ctx.fillStyle = "#e8e8f0";
            ctx.textAlign = "center";
            ctx.font = "48px Arial";

            ctx.fillText(
                "PHOTO BLASTER",
                canvas.width / 2,
                canvas.height / 2
            );
        }

        // blinking prompt

        const visible =
            Math.floor(
                this.blinkTimer / 500
            ) % 2 === 0;

        if (visible)
        {
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = "20px Arial";

            ctx.fillText(
                "PRESS ANY KEY",
                canvas.width / 2,
                canvas.height - 100
            );
        }

        ctx.textAlign = "left";
    }
}

const screenTitle = new ScreenTitle();