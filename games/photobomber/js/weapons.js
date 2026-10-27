// =====================================================
// WEAPONS
// =====================================================

const DANGER_MARKER_FRAMES = 60;

// =====================================================
// PENDING ATTACK
// =====================================================

let pendingHitAmmoId = null;

// =====================================================
// AUTOMATIC FIRE
// =====================================================

let mouseDown = false;

let weaponCooldown = 0;

let roundsFired = 0;

let reloading = false;

let reloadTimer = 0;

// end

// =====================================================
// MACHINEGUN UPGRADES
// =====================================================

let machinegunBarrels = 1;

// =====================================================
// AUDIO
// =====================================================

const weaponSounds = {};

// =====================================================
// HELPERS
// =====================================================

function getCurrentAmmo()
{
    if(
        typeof getAmmoType !==
        "function"
    )
    {
        return null;
    }

    return getAmmoType(
        currentAmmoId
    );
}

function upgradeMachinegunBarrels()
{
    machinegunBarrels =
        Math.min(
            4,
            machinegunBarrels + 1
        );

    console.log(
        "barrels:",
        machinegunBarrels
    );
}

// =====================================================
// DETERMINE ATTACK VALUES
// =====================================================

function buildAttack()
{
    const weapon =
        getCurrentWeapon();

    const ammo =
        getCurrentAmmo();

    if(
        !weapon ||
        !ammo
    )
    {
        pendingHitDamage = 1;
        pendingHitRadius = 25;
        pendingHitAmmoId = null;
        return;
    }

    pendingHitDamage =
        ammo.damageHit || 1;

    pendingHitRadius =
        ammo.splashRadius || 25;

    pendingHitAmmoId =
        ammo.id;

    // -------------------------
    // MACHINEGUN
    // -------------------------

    if(
        weapon.id ===
        "weapon01"
    )
    {
        pendingHitRadius =
            Math.max(
                10,
                ammo.splashRadius
            );
    }

    // -------------------------
    // HOWITZER
    // -------------------------

    if(
        weapon.id ===
        "weapon02"
    )
    {
        pendingHitRadius =
            Math.max(
                30,
                ammo.splashRadius
            );
    }

    // -------------------------
    // BOMB
    // -------------------------

    if(
        weapon.id ===
        "weapon03"
    )
    {
        pendingHitRadius =
            Math.max(
                60,
                ammo.splashRadius
            );
    }
}

// =====================================================
// FIRE WEAPON
// =====================================================

function playWeaponSound()
{
    const weapon =
        getCurrentWeapon();

    if(!weapon)
    {
        return;
    }

    if(!weapon.bang)
    {
        return;
    }

    console.log(
        "BANG!",
        weapon.bang
    );

    const sound =
        new Audio(
            "assets/" +
            weapon.bang
        );

    sound.volume =
        weapon.bangVolume;

    sound.play().catch(
        err =>
        {
            console.error(
                "sound error",
                err
            );
        }
    );
}

function fireWeapon(
    x,
    y
)
{
    buildAttack();
	
	const ammo =
    getCurrentAmmo();

if(
    typeof scheduleAmmoImpact ===
    "function"
)
{
    scheduleAmmoImpact(
        ammo,
        x,
        y
    );
}
// end

    playWeaponSound();

   
    pendingHitX = x;
    pendingHitY = y;
}

// =====================================================
// AUTOMATIC FIRE UPDATE
// =====================================================

function getBarrelCount()
{
    return weaponUpgrade01 + 1;
}
// end

function getMagazineSize()
{
    switch(weaponUpgrade02)
    {
        case 0:
            return 50;

        case 1:
            return 100;

        case 2:
            return 150;

        case 3:
            return Infinity;
    }

    return 50;
}
// end

function playReloadSound()
{
    const weapon =
        getCurrentWeapon();

    if(!weapon)
    {
        return;
    }

    // no reload_sound line in
    // 300-weapon_file.txt for this
    // weapon - nothing to play

    if(!weapon.reloadSound)
    {
        return;
    }

    const barrels =
        getBarrelCount();

    for(
        let i = 0;
        i < barrels;
        i++
    )
    {
        setTimeout(
            () =>
            {
                const sound =
                    new Audio(
                        "assets/" +
                        weapon.reloadSound
                    );

                sound.volume =
                    weapon.reloadVolume;

                sound.play().catch(
                    err =>
                    {
                        console.error(
                            "reload sound error",
                            err
                        );
                    }
                );
            },

            i * 500
        );
    }
}
// end

function updateWeaponFire()
{
	if(reloading)
{
    reloadTimer--;

    if(
        reloadTimer <= 0
    )
    {
        reloading = false;

        roundsFired = 0;
    }

    return;
}
    if(
        weaponCooldown > 0
    )
    {
        weaponCooldown--;
    }

    // -------------------------
    // MACHINEGUN ONLY
    // -------------------------

    if(
        currentWeaponId !==
        "weapon01"
    )
    {
        return;
    }

    if(
        !mouseDown
    )
    {
        return;
    }

    if(
        weaponCooldown > 0
    )
    {
        return;
    }

 const barrelCount =
    getBarrelCount();

for(
    let i = 0;
    i < barrelCount;
    i++
)
{
    fireWeapon(
        mouseX +
        (
            Math.random() -
            0.5
        ) * 6,

        mouseY +
        (
            Math.random() -
            0.5
        ) * 6
    );

    roundsFired++;
}   

const magazineSize =
    getMagazineSize();

if(
    roundsFired >=
    magazineSize
)
{
    reloading = true;

    reloadTimer =
        30 *
        barrelCount;

    playReloadSound();
}

  

    // 60fps / 10 rounds sec

    weaponCooldown =
    Math.max(
        1,
        Math.round(
            60 /
            (
                10 *
                machinegunBarrels
            )
        )
    );
}

// =====================================================
// MOUSE STATE
// =====================================================

canvas.addEventListener(
    "mousedown",
    () =>
    {
        mouseDown = true;
    }
);

canvas.addEventListener(
    "mouseup",
    () =>
    {
        mouseDown = false;
    }
);

canvas.addEventListener(
    "mouseleave",
    () =>
    {
        mouseDown = false;
    }
);

// =====================================================
// CLICK FIRE
// =====================================================

canvas.addEventListener(
    "click",
    (e) =>
    {
        const rect =
            canvas.getBoundingClientRect();

        const x =
            e.clientX -
            rect.left;

        const y =
            e.clientY -
            rect.top;

        // -------------------------
        // PLACE BASE
        // -------------------------

        if(
            waitingForBasePlacement
        )
        {
            playerBase =
            {
                x: x,
                y: y,
                hp: 100
            };

            waitingForBasePlacement =
                false;

            return;
        }

        // -------------------------
        // MACHINEGUN
        // automatic fire handles it
        // -------------------------

        if(
            currentWeaponId ===
            "weapon01"
        )
        {
            return;
        }

        // -------------------------
        // HOWITZER / BOMB
        // -------------------------

        fireWeapon(
            x,
            y
        );
    }
);

// =====================================================
// DISPLAY HELPERS
// =====================================================

function getSelectedWeaponName()
{
    const weapon =
        getCurrentWeapon();

    if(!weapon)
    {
        return "None";
    }

    return weapon.name;
}

function getSelectedAmmoName()
{
    const ammo =
        getCurrentAmmo();

    if(!ammo)
    {
        return "None";
    }

    return ammo.name;
}

// =====================================================
// FUTURE EFFECT HOOKS
// =====================================================

function ammoStartsFire()
{
    if(
        pendingHitAmmoId ===
        "bullet03"
    )
    {
        return (
            Math.random() <
            0.50
        );
    }

    return false;
}

function ammoCreatesSmoke()
{
    return (
        pendingHitAmmoId ===
        "bomb01" ||
        pendingHitAmmoId ===
        "bomb02" ||
        pendingHitAmmoId ===
        "shell01"
    );
}