/*
==============================================================================
SCREEN GAME MODE
==============================================================================

PURPOSE
------------------------------------------------------------------------------

Choose which game mode to play, then hand control to gameplay.

GM02 is retired - gravity now always lines up with the viewing
direction, so there are only two modes.

==============================================================================
SCREEN FLOW
------------------------------------------------------------------------------

screen-hub.js
    |
    +-- Start Game
            |
            v
    screen-gameMode.js
            |
            +-- GM01  Bomber        (looking down)
            |
            +-- GM03  Anti-Aircraft (looking up)
            |
            +-- Back To Main Hub

==============================================================================
HANDOFF
------------------------------------------------------------------------------

startGameplay(mode) lives in index.html.

It sets ACTIVE_GAME_MODE, flips gameState to "game", shows the
gameplay buttons, and opens the camera so the player can take
the map photo.

==============================================================================
*/

class ScreenGameMode extends MenuScreen
{
    constructor()
    {
        super("SELECT GAME MODE");
    }

    //----------------------------------------------------------------------
    // open
    //----------------------------------------------------------------------

    open()
    {
        console.log("GAME MODE OPEN");

        this.setLines(
        [
            "the next screen takes the photo",
            "that becomes your battlefield"
        ]);

        this.setButtons(
        [
            {
                label: "GM01  -  Bomber",

                action: () =>
                    startGameplay("gm01")
            },

            {
                label: "GM03  -  Anti-Aircraft",

                action: () =>
                    startGameplay("gm03")
            },

            {
                label: "Back To Main Hub",

                action: () =>
                    screenManager.changeScreenByName(
                        "hub"
                    )
            }
        ]);
    }
}

const screenGameMode = new ScreenGameMode();