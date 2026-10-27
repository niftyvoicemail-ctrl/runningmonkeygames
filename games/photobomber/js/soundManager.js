/*
==============================================================================
SOUND MANAGER
==============================================================================

Minimal audio layer for menus.

Responsibilities:

    play / stop music

    play one-shot sound effects

    music ON/OFF toggle

    sound effects ON/OFF toggle

Toggles are stored in the save file when one is loaded,
otherwise they just live here for the session.

NOTE
------------------------------------------------------------------------------
Gameplay weapon sounds still play directly from weapons.js.
Routing those through here is a later cleanup, not needed
to test the menus.

==============================================================================
*/

const soundManager =
{
    musicOn: true,
    soundOn: true,

    currentMusic: null,
    currentMusicName: "",

    musicVolume: 0.5,
    soundVolume: 0.8,

    //----------------------------------------------------------------------
    // play music
    //----------------------------------------------------------------------

    playMusic(fileName)
    {
        // already playing this track

        if (
            this.currentMusicName === fileName &&
            this.currentMusic &&
            !this.currentMusic.paused
        )
        {
            return;
        }

        this.stopMusic();

        this.currentMusicName = fileName;

        if (!this.musicOn)
        {
            return;
        }

        if (!fileName)
        {
            return;
        }

        this.currentMusic =
            new Audio(
                "assets/" + fileName
            );

        this.currentMusic.loop = true;

        this.currentMusic.volume =
            this.musicVolume;

        // browsers block autoplay until the
        // player interacts - that's expected,
        // the title screen starts it on the
        // first keypress/click anyway

        this.currentMusic.play().catch(
            () => {}
        );
    },

    //----------------------------------------------------------------------
    // stop music
    //----------------------------------------------------------------------

    stopMusic()
    {
        if (this.currentMusic)
        {
            this.currentMusic.pause();

            this.currentMusic = null;
        }
    },

    //----------------------------------------------------------------------
    // play sound
    //----------------------------------------------------------------------

    playSound(fileName, volume)
    {
        if (!this.soundOn)
        {
            return;
        }

        if (!fileName)
        {
            return;
        }

        const sound =
            new Audio(
                "assets/" + fileName
            );

        sound.volume =
            volume !== undefined
                ? volume
                : this.soundVolume;

        sound.play().catch(
            () => {}
        );
    },

    //----------------------------------------------------------------------
    // toggles
    //----------------------------------------------------------------------

    toggleMusic()
    {
        this.musicOn = !this.musicOn;

        if (!this.musicOn)
        {
            this.stopMusic();
        }
        else
        {
            // restart whatever was playing

            const name =
                this.currentMusicName;

            this.currentMusicName = "";

            this.playMusic(name);
        }

        return this.musicOn;
    },

    toggleSound()
    {
        this.soundOn = !this.soundOn;

        return this.soundOn;
    }
};
