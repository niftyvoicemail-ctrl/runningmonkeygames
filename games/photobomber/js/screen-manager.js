/*
==============================================================================
SCREEN FLOW
==============================================================================

screen-title.js
    music: 101-title_music.wav
    image: 101-title_image.png

    |
    v

screen-menu.js

    +-- Music ON/OFF

    +-- Sound Effects ON/OFF

    +-- Save Slot 1

    +-- Save Slot 2

    +-- Save Slot 3

    |
    +-- Empty Slot
    |       |
    |       +-- Create New Save
    |
    +-- Used Slot
    |       |
    |       +-- Load Existing Save
    |
    v

screen-manager.js
(Main Hub)

    +-- Start Game
    |       |
    |       +-- Hub Music Ends
    |       | 
    |       +-- Choose game mode screen
    |       |	screen-gameMode.js
    |       |
    |       +-- Gameplay Begins
    |       |
    |       +-- Game Over
    |               |
    |               +-- Update Statistics
    |               +-- Save Game
    |               +-- OK
    |               +-- Return To Main Hub
    |
    +-- Upgrades
    |       |
    |       v
    |   screen-upgrade.js
    |
    +-- Badge Room
    |       |
    |       v
    |   screen-badgeRoom.js
    |
    +-- Loadout
    |       |
    |       v
    |   screen-loadout.js
    |
    +-- Creep Editor
    |       |
    |       v
    |   screen-creepEditor.js
    |
    +-- Return To Save Menu

==============================================================================
SAVE SYSTEM
==============================================================================

Local Save Files

    Save Slot 1
    Save Slot 2
    Save Slot 3

Each Save Contains

    Player Name

    Date Created

    Last Played

    Upgrade Data

    Badge Data

    Loadout Data

    Statistics

        Longest Run

        Total Play Time

        Total Body Count

        Individual Creep Body Counts

            example:

            Slime
            Ghost
            PumpkinHead

==============================================================================
SCREEN STANDARD
==============================================================================

Every Screen Must Support

    open()
    close()
    update(delta)
    draw(ctx)

==============================================================================
SCREEN MANAGER RESPONSIBILITIES
==============================================================================

    Track Current Screen

    Change Screens

    Open New Screen

    Close Current Screen

    Forward update()

    Forward draw()

==============================================================================
FUTURE NOTES
==============================================================================

    Screen Manager knows NOTHING about:

        upgrades
        loadouts
        badges
        creep editor
        gameplay

    Screen Manager only controls navigation.

==============================================================================
*/
/*
==============================================================================
SCREEN MANAGER
==============================================================================

Tracks the currently active screen.

Responsibilities:

    Change Screens

    Call open()

    Call close()

    Forward update()

    Forward draw()

This class knows NOTHING about:

    gameplay
    upgrades
    loadouts
    badges
    saves

==============================================================================
*/

class ScreenManager
{
    constructor()
{
    this.currentScreen = null;

    this.screens = {};
}


    //----------------------------------------------------------------------
    // register
    //----------------------------------------------------------------------

    register(name, screen)
    {
        this.screens[name] = screen;
    }

    //----------------------------------------------------------------------
    // get
    //----------------------------------------------------------------------

    get(name)
    {
        return this.screens[name];
    }

    //----------------------------------------------------------------------
    // change screen
    //----------------------------------------------------------------------

    changeScreen(screen)
    {
        // close current screen

        if (
            this.currentScreen &&
            typeof this.currentScreen.close === "function"
        )
        {
            this.currentScreen.close();
        }

        // switch

        this.currentScreen = screen;

        // open new screen

        if (
            this.currentScreen &&
            typeof this.currentScreen.open === "function"
        )
        {
            this.currentScreen.open();
        }
    }

    //----------------------------------------------------------------------
    // change by name
    //----------------------------------------------------------------------

    changeScreenByName(name)
    {
        const screen = this.screens[name];

        if (!screen)
        {
            console.error(
                "Screen not found:",
                name
            );

            return;
        }

        this.changeScreen(screen);
    }

    //----------------------------------------------------------------------
    // update
    //----------------------------------------------------------------------

    update(delta)
    {
        if (!this.currentScreen)
        {
            return;
        }

        if (
            typeof this.currentScreen.update === "function"
        )
        {
            this.currentScreen.update(delta);
        }
    }

    //----------------------------------------------------------------------
    // draw
    //----------------------------------------------------------------------

    draw(ctx)
    {
        if (!this.currentScreen)
        {
            return;
        }

        if (
            typeof this.currentScreen.draw === "function"
        )
        {
            this.currentScreen.draw(ctx);
        }
    }
}

/*
==============================================================================
GLOBAL INSTANCE
==============================================================================

Example:

screenManager.changeScreen(screenTitle);

============================================================================== 
*/

const screenManager = new ScreenManager();