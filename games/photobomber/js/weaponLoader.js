// =====================================================
// WEAPON FILE LOADER
// =====================================================

const WEAPON_FILE_PATH =
    "300-weapon_file.txt";

let weaponTypes = [];
let weaponTypesReady = false;

// =====================================================
// PLAYER LOADOUT
// =====================================================

let currentWeaponId = null;
let currentAmmoId = null;

let currentWeaponIndex = 0;
let currentAmmoIndex = 0;

// =====================================================
// WEAPON UPGRADES
// =====================================================

let weaponUpgrade01 = 0;
let weaponUpgrade02 = 0;

// =====================================================
// LOAD FILE
// =====================================================

fetch(WEAPON_FILE_PATH)
    .then(
        res => res.text()
    )
    .then(text =>
    {
        weaponTypes =
            parseWeaponFile(text);

        weaponTypesReady = true;

        console.log(
            "loaded weapons:",
            weaponTypes.length
        );

        initializeWeaponSystem();
    })
    .catch(err =>
    {
        console.error(
            "failed to load " +
            WEAPON_FILE_PATH,
            err
        );
    });

// =====================================================
// HELPERS
// =====================================================

function firstNumber(
    str,
    fallback
)
{
    if(!str)
    {
        return fallback;
    }

    const match =
        str.match(
            /-?\d+(\.\d+)?/
        );

    return match
        ? parseFloat(match[0])
        : fallback;
}

function yesNo(
    value
)
{
    return /^yes/i.test(
        value || ""
    );
}

// =====================================================
// PARSE FILE
// =====================================================

function parseWeaponFile(
    text
)
{
    const lines =
        text.split(/\r?\n/);

    const weapons = [];

    let current = null;

    for(
        const rawLine of lines
    )
    {
        const line =
            rawLine.trim();

        if(
            line === "" ||
            /^=+$/.test(line)
        )
        {
            continue;
        }

        const header =
            line.match(
                /^(weapon\d+)\s*:\s*(.+)$/i
            );

        if(header)
        {
            if(current)
            {
                weapons.push(current);
            }

            current =
            {
                id:
                    header[1].toLowerCase(),

                name:
                    header[2].trim(),

                fields: {}
            };

            continue;
        }

        if(current)
        {
            const kv =
                line.match(
                    /^(.+?)\s*:\s*(.+)$/
                );

            if(kv)
            {
                current.fields[
                    kv[1].trim().toLowerCase()
                ] = kv[2].trim();
            }
        }
    }

    if(current)
    {
        weapons.push(current);
    }

    return weapons.map(
        weapon =>
        {
            const f = weapon.fields;

            return {
                id: weapon.id,

                name: weapon.name,

                crosshair:
                    f["crosshair"] || "",

                bang:
                    f["bang"] || "",

                bangVolume:
                    firstNumber(
                        f["bang volumn"],
                        1
                    ),

                reload:
                    firstNumber(
                        f["reload"],
                        0
                    ),

                reloadSound:
                    f["reload_sound"] || "",

                reloadVolume:
                    firstNumber(
                        f["reload volumn"],
                        1
                    ),

                fireRate:
                    firstNumber(
                        f["fire rate"],
                        1
                    ),

                gm01:
                    yesNo(f["gm01"]),

                gm03:
                    yesNo(f["gm03"]),

                upgrade01:
                    f["upgrade01"] || "",

                upgrade02:
                    f["upgrade02"] || "",

                ammoTypes:
                    determineAmmoTypes(weapon.id)
            };
        }
    );
}

// =====================================================
// AMMO LINKS
// =====================================================

function determineAmmoTypes(
    weaponId
)
{
    switch(weaponId.toLowerCase())
    {
        case "weapon01":
            return [
                "bullet01",
                "bullet02",
                "bullet03"
            ];

        case "weapon02":
            return [
                "shell01",
                "shell02",
                "shell03"
            ];

        case "weapon03":
            return [
                "bomb01",
                "bomb02",
                "bomb03"
            ];

        default:
            return [];
    }
}

// =====================================================
// LOOKUPS
// =====================================================

function getWeaponType(
    id
)
{
    return weaponTypes.find(
        weapon =>
            weapon.id === id.toLowerCase()
    );
}

function getCurrentWeapon()
{
    return getWeaponType(currentWeaponId);
}

// =====================================================
// MODE FILTER
// =====================================================

function getWeaponsForCurrentMode()
{
    return weaponTypes.filter(
        weapon =>
        {
            if(ACTIVE_GAME_MODE === "gm01")
            {
                return weapon.gm01;
            }

            if(ACTIVE_GAME_MODE === "gm03")
            {
                return weapon.gm03;
            }

            return true;
        }
    );
}

// =====================================================
// UI
// =====================================================

const weaponBtn =
    document.getElementById("weaponBtn");

const ammoBtn =
    document.getElementById("ammoBtn");

const upgrade01Btn =
    document.getElementById("upgrade01Btn");

const upgrade02Btn =
    document.getElementById("upgrade02Btn");

// =====================================================
// INITIALIZE
// =====================================================

function initializeWeaponSystem()
{
    const weapons =
        getWeaponsForCurrentMode();

    if(weapons.length === 0)
    {
        return;
    }

    currentWeaponIndex = 0;

    currentWeaponId =
        weapons[0].id;

    currentAmmoIndex = 0;

    currentAmmoId =
        weapons[0].ammoTypes[0];

    weaponUpgrade01 = 0;
    weaponUpgrade02 = 0;

    updateWeaponButton();
    updateAmmoButton();
    updateUpgradeButtons();
}

// =====================================================
// WEAPON BUTTON
// =====================================================

weaponBtn.addEventListener(
    "click",
    () =>
    {
        const weapons =
            getWeaponsForCurrentMode();

        if(weapons.length === 0)
        {
            return;
        }

        currentWeaponIndex =
            (currentWeaponIndex + 1) %
            weapons.length;

        const weapon =
            weapons[currentWeaponIndex];

        currentWeaponId = weapon.id;

        currentAmmoIndex = 0;

        currentAmmoId =
            weapon.ammoTypes[0];

        weaponUpgrade01 = 0;
        weaponUpgrade02 = 0;

        updateWeaponButton();
        updateAmmoButton();
        updateUpgradeButtons();
    }
);
// end

// =====================================================
// AMMO BUTTON
// =====================================================

ammoBtn.addEventListener(
    "click",
    () =>
    {
        const weapon = getCurrentWeapon();

        if(
            !weapon ||
            weapon.ammoTypes.length === 0
        )
        {
            return;
        }

        currentAmmoIndex =
            (currentAmmoIndex + 1) %
            weapon.ammoTypes.length;

        currentAmmoId =
            weapon.ammoTypes[currentAmmoIndex];

        updateAmmoButton();
    }
);

upgrade01Btn.addEventListener(
    "click",
    () =>
    {
        weaponUpgrade01 =
            (weaponUpgrade01 + 1) % 4;

        updateUpgradeButtons();

        console.log("Upgrade01:", weaponUpgrade01);
    }
);

upgrade02Btn.addEventListener(
    "click",
    () =>
    {
        weaponUpgrade02 =
            (weaponUpgrade02 + 1) % 4;

        updateUpgradeButtons();

        console.log("Upgrade02:", weaponUpgrade02);
    }
);

// =====================================================
// BUTTON TEXT
// =====================================================

function updateWeaponButton()
{
    const weapon = getCurrentWeapon();

    if(!weapon)
    {
        return;
    }

    weaponBtn.textContent =
        "Weapon: " + weapon.name;
}
// end

function updateAmmoButton()
{
    const ammo =
        getAmmoType(currentAmmoId);

    if(!ammo)
    {
        return;
    }

    ammoBtn.textContent =
        "Ammo: " + ammo.name;
}
// end

function updateUpgradeButtons()
{
    upgrade01Btn.textContent =
        "Upgrade01 L" + weaponUpgrade01;

    upgrade02Btn.textContent =
        "Upgrade02 L" + weaponUpgrade02;
}
// end

// =====================================================
// GAME MODE CHANGED
// =====================================================

function refreshWeaponsForMode()
{
    currentWeaponIndex = 0;
    currentAmmoIndex = 0;

    initializeWeaponSystem();
}