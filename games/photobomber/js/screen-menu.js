/*
==============================================================================
SCREEN MENU - 102-menu_save.png
==============================================================================

Save File Selection

Music ON/OFF

Sound Effects ON/OFF

Uses:

    102-menu_save.png

Visual Theme:

    WW1 Bunker

    Brass

    Steel

    Observation Post

==============================================================================
*/

class ScreenMenu extends MenuScreen
{
    constructor()
    {
        super("SELECT SAVE");

        this.buttonWidth = 520;
        this.buttonHeight = 70;

        //------------------------------------------------------
        // background image
        //------------------------------------------------------

        this.background =
            new Image();

        this.background.src =
            "assets/102-menu_save.png";

        this.background.onload = () =>
        {
            console.log(
                "MENU BACKGROUND LOADED"
            );
        };

        this.background.onerror = () =>
        {
            console.log(
                "MENU BACKGROUND FAILED"
            );
        };
    }

    //----------------------------------------------------------------------
    // open
    //----------------------------------------------------------------------

    open()
{
    console.log("MENU OPEN");

    document.body.style.cursor =
        "default";

    canvas.style.cursor =
        "default";

    this.setLines([
        " "
    ]);

    this.refresh();
}
	
    //----------------------------------------------------------------------
    // refresh
    //----------------------------------------------------------------------

    refresh()
    {
        const buttons = [];

        for (
            let slot = 1;
            slot <= 3;
            slot++
        )
        {
            const data =
                saveManager.load(slot);

            buttons.push(
            {
                label:
                    this.slotLabel(
                        slot,
                        data
                    ),

                action: () =>
                    this.chooseSlot(
                        slot
                    )
            });
        }

        buttons.push(
        {
            label: "Music",

            value:
                soundManager.musicOn
                    ? "ON"
                    : "OFF",

            action: () =>
            {
                soundManager.toggleMusic();

                saveManager.saveCurrent();

                this.refresh();
            }
        });

        buttons.push(
        {
            label:
                "Sound Effects",

            value:
                soundManager.soundOn
                    ? "ON"
                    : "OFF",

            action: () =>
            {
                soundManager.toggleSound();

                saveManager.saveCurrent();

                this.refresh();
            }
        });

        this.setButtons(
            buttons
        );
    }

    //----------------------------------------------------------------------
    // slot label
    //----------------------------------------------------------------------

  slotLabel(
    slot,
    data
)
{
    if (!data)
    {
        return (
            "SAVE-" +
            slot +
            "    EMPTY"
        );
    }

    const saveTime =
        data.lastPlayedTime ||
        "0000";

    const saveDate =
        data.lastPlayedDate ||
        "2026/01/01";

    return (
        "SAVE-" +
        slot +
        "   " +
        saveTime +
        "   " +
        saveDate
    );
}
//end

    //----------------------------------------------------------------------
    // choose slot
    //----------------------------------------------------------------------

    chooseSlot(slot)
    {
        let data =
            saveManager.load(
                slot
            );

        if (!data)
        {
            data =
                saveManager.createNew(
                    "Player " +
                    slot
                );

            saveManager.save(
                slot,
                data
            );

            console.log(
                "created new save in slot",
                slot
            );
        }
        else
        {
            console.log(
                "loaded save from slot",
                slot
            );
        }

        saveManager.activate(
            slot,
            data
        );

        screenManager.changeScreenByName(
            "hub"
        );
    }

//------------------------------------------------------------------
// draw
//------------------------------------------------------------------

draw(ctx)
{
    //------------------------------------------------------
    // background image
    //------------------------------------------------------

    if (
        this.background &&
        this.background.complete
    )
    {
        ctx.drawImage(
            this.background,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    else
    {
        ctx.fillStyle =
            "#111111";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    //------------------------------------------------------
    // dark overlay
    //------------------------------------------------------

    ctx.fillStyle =
        "rgba(0,0,0,0.75)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    //------------------------------------------------------
    // DEBUG BOX
    //------------------------------------------------------
    // If you don't see this bright red box,
    // something later is painting over the screen.

    
    
    //------------------------------------------------------
    // subtitle
    //------------------------------------------------------

    ctx.fillStyle =
        "#e6d7b0";

    ctx.font =
        "20px serif";

    

    //------------------------------------------------------
    // draw buttons
    //------------------------------------------------------



super.draw(ctx);

} // end
}

const screenMenu =
    new ScreenMenu();