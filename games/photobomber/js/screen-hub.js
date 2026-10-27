/*
==============================================================================
SCREEN HUB
==============================================================================

The Main Hub.

Your flow doc in screen-manager.js describes the hub as part of
the screen manager, but that class is deliberately navigation-only
("knows NOTHING about gameplay"). So the hub gets its own screen,
and the manager just routes to it like any other.

==============================================================================
SCREEN FLOW
------------------------------------------------------------------------------

screen-menu.js
    |
    v
screen-hub.js
    |
    +-- Start Game ----------> screen-gameMode.js
    |
    +-- Upgrades ------------> screen-upgrade.js
    |
    +-- Badge Room ----------> screen-badgeRoom.js
    |
    +-- Loadout -------------> screen-loadout.js
    |
    +-- Creep Editor --------> screen-creepEditor.js
    |
    +-- Return To Save Menu -> screen-menu.js

==============================================================================
*/

/*
==============================================================================
SCREEN HUB
==============================================================================
*/

class ScreenHub extends MenuScreen
{
    constructor()
{
    super("HEADQUARTERS");

    this.background =
        new Image();

    this.background.src =
        "assets/103-menu_main.png";

    this.background.onload = () =>
    {
        console.log(
            "HUB BACKGROUND LOADED"
        );
    };

    this.background.onerror = () =>
    {
        console.log(
            "HUB BACKGROUND FAILED"
        );
    };
}
//end

    //----------------------------------------------------------------------
    // open
    //----------------------------------------------------------------------

    open()
    {
        console.log("HUB OPEN");

        this.refresh();
    }

draw(ctx)
{
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
            "blue";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    ctx.fillStyle =
        "rgba(0,0,0,0.75)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    super.draw(ctx);
}
    //----------------------------------------------------------------------
    // refresh
    //----------------------------------------------------------------------

    refresh()
    {
        const name =
            currentSave
                ? currentSave.playerName
                : "no save loaded";

        this.setLines([]);

        this.setButtons(
        [
            {
                label: "Start Game",

                action: () =>
                    screenManager.changeScreenByName(
                        "gameMode"
                    )
            },

            {
                label: "Upgrades",

                action: () =>
                    screenManager.changeScreenByName(
                        "upgrade"
                    )
            },

            {
                label: "Badge Room",

                action: () =>
                    screenManager.changeScreenByName(
                        "badgeRoom"
                    )
            },

            {
                label: "Loadout",

                action: () =>
                    screenManager.changeScreenByName(
                        "loadout"
                    )
            },

            {
                label: "Creep Editor",

                action: () =>
                    screenManager.changeScreenByName(
                        "creepEditor"
                    )
            },

            {
                label: "Return To Save Menu",

                action: () =>
                {
                    saveManager.saveCurrent();

                    screenManager.changeScreenByName(
                        "menu"
                    );
                }
            }
        ]);
    }
}

const screenHub = new ScreenHub();
