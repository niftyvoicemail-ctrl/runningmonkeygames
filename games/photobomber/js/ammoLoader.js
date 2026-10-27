// =====================================================
// AMMO FILE LOADER
// =====================================================

const AMMO_FILE_PATH =
    "400-ammo_file.txt";

let ammoTypes = [];
let ammoTypesReady = false;

// =====================================================
// LOAD FILE
// =====================================================

fetch(AMMO_FILE_PATH)
    .then(
        res => res.text()
    )
    .then(text =>
    {
        ammoTypes =
            parseAmmoFile(text);

        ammoTypesReady = true;

        console.log(
            "loaded ammo:",
            ammoTypes.length,
            ammoTypes
        );
    })
    .catch(err =>
    {
        console.error(
            "failed to load " +
            AMMO_FILE_PATH,
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
    return /^(yes|true)/i.test(
        value || ""
    );
}

// =====================================================
// AMMO PARSER
// =====================================================

function parseAmmoFile(
    text
)
{
    const lines =
        text.split(/\r?\n/);

    const ammo = [];

    let currentCategory =
        "unknown";

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

        // --------------------
        // CATEGORY HEADERS
        // --------------------

        if(/^BULLETS$/i.test(line))
        {
            currentCategory = "bullet";
            continue;
        }

        if(/^SHELLS$/i.test(line))
        {
            currentCategory = "shell";
            continue;
        }

        if(/^BOMBS$/i.test(line))
        {
            currentCategory = "bomb";
            continue;
        }

        // --------------------
        // AMMO HEADER
        // --------------------

        const header =
            line.match(
                /^([A-Za-z0-9_]+)\s*:\s*(.+)$/i
            );

        if(header)
        {
            const id =
                header[1]
                    .toLowerCase();

            if(
                id.startsWith("bullet") ||
                id.startsWith("shell") ||
                id.startsWith("bomb")
            )
            {
                if(current)
                {
                    ammo.push(current);
                }

                current =
                {
                    id: id,

                    name:
                        header[2].trim(),

                    category:
                        currentCategory,

                    fields: {}
                };

                continue;
            }
        }

        // --------------------
        // KEY : VALUE
        // --------------------
        // some keys (ability, in particular) can appear
        // more than once for the same ammo entry - stack
        // those into an array instead of the later line
        // silently overwriting the earlier one

        if(current)
        {
            const kv =
                line.match(
                    /^(.+?)\s*:\s*(.+)$/
                );

            if(kv)
            {
                const key =
                    kv[1]
                    .trim()
                    .toLowerCase();

                const value =
                    kv[2].trim();

                if(current.fields[key] !== undefined)
                {
                    if(Array.isArray(current.fields[key]))
                    {
                        current.fields[key].push(value);
                    }
                    else
                    {
                        current.fields[key] =
                        [
                            current.fields[key],
                            value
                        ];
                    }
                }
                else
                {
                    current.fields[key] = value;
                }
            }
        }
    }

    if(current)
    {
        ammo.push(current);
    }

    // --------------------
    // CONVERT
    // --------------------

    return ammo.map(
        a =>
        {
            const f = a.fields;

            // ability may be a single string or an
            // array (see stacking above) - normalize
            // to an array so downstream code has one
            // shape to deal with

            const abilities =
                f["ability"] === undefined
                    ? []
                    : Array.isArray(f["ability"])
                        ? f["ability"]
                        : [f["ability"]];

            return {
                id: a.id,

                name: a.name,

                category: a.category,

                icon:
                    f["icon"] || "",

                damageHit:
                    parseHitDamage(f["damage"]),

                damageSplash:
                    parseSplashDamage(f["damage"]),

                splashRadius:
                    firstNumber(
                        f["splash effect"],
                        0
                    ),

                projectileSpeed:
                    firstNumber(
                        f["bullet speed"] ||
                        f["shell speed"] ||
                        f["bomb speed"],
                        0
                    ),

                weight:
                    firstNumber(
                        f["bullet weight"] ||
                        f["shell weight"] ||
                        f["bomb weight"],
                        0
                    ),

                damageDelay:
                    firstNumber(
                        f["damage delay"],
                        0
                    ),

                damageSize:
                    firstNumber(
                        f["damage size"],
                        0
                    ),

                // --------------------
                // DUST
                // --------------------
                // lingers and drifts with wind - fade
                // time is per-ammo (dust time), not a
                // fixed effect-wide duration

                dustDamage:
                    yesNo(f["dust damage"]),

                dustSize:
                    firstNumber(
                        f["dust size"],
                        8
                    ),

                dustTime:
                    firstNumber(
                        f["dust time"],
                        5
                    ),

                // --------------------
                // FLASH
                // --------------------
                // brief bright instant, not lingering.
                // "flast size" is a typo seen in the
                // data file (bullet03) - tolerated here
                // rather than silently dropped

                flashDamage:
                    yesNo(f["flash damage"]),

                flashSize:
                    firstNumber(
                        f["flash size"] ||
                        f["flast size"],
                        8
                    ),

                flashTime:
                    firstNumber(
                        f["flash time"],
                        0.1
                    ),

                // BOMB03 still uses this ("none see
                // shells") - kept for anything that
                // hasn't moved to dust/flash fields

                damageType:
                    Array.isArray(f["damage type"])
                        ? f["damage type"].join(", ")
                        : (f["damage type"] || ""),

                damageTime:
                    f["damage time"] || "",

                report:
                    f["report"] || "none",

                reportVolume:
                    firstNumber(
                        f["report volumn"],
                        0
                    ),

                reportDelay:
                    firstNumber(
                        f["report delay"],
                        0
                    ),

                // ability text joined for display and
                // logging - gameplay code should read the
                // parsed values below instead of
                // re-matching this string

                ability:
                    abilities.join("; "),

                // --------------------
                // PARSED ABILITIES
                // --------------------
                // 0 = this ammo doesn't have that ability

                fireStartChance:
                    parsePercentAbility(
                        abilities,
                        /chance to start fire/i
                    ),

                shelterBypassChance:
                    parsePercentAbility(
                        abilities,
                        /chance to kill (?:solders|soldiers) inside/i
                    ),

                // BOMB01: probabilistic all-or-nothing
                // crew wipe

                crewKillChance:
                    parsePercentAbility(
                        abilities,
                        /chance to kill (?:all )?crew/i
                    ),

                // bullet01 / shell01: guaranteed fixed
                // count per hit, no roll

                crewKillCount:
                    parseCountAbility(
                        abilities,
                        /kills\s+(\d+)\s+crew/i
                    ),

                upgrade01:
                    Array.isArray(f["upgrade01"])
                        ? f["upgrade01"].join("; ")
                        : (f["upgrade01"] || ""),

                gm01:
                    yesNo(f["gm01"]),

                gm03:
                    yesNo(f["gm03"]),

                rawFields: f
            };
        }
    );
}

// =====================================================
// DAMAGE PARSERS
// =====================================================

function parseHitDamage(
    damageText
)
{
    if(!damageText)
    {
        return 0;
    }

    const match =
        damageText.match(
            /(\d+)\s*hit/i
        );

    if(!match)
    {
        return 0;
    }

    return parseFloat(match[1]);
}

function parseSplashDamage(
    damageText
)
{
    if(!damageText)
    {
        return 0;
    }

    const match =
        damageText.match(
            /(\d+)\s*splash/i
        );

    if(!match)
    {
        return 0;
    }

    return parseFloat(match[1]);
}

// =====================================================
// ABILITY PERCENTAGE PARSER
// =====================================================
// scans the ability lines for one matching pattern and
// pulls the leading percentage off it. returns 0 if no
// line matches - a normal "this ammo doesn't do that",
// not an error.

function parsePercentAbility(
    abilities,
    pattern
)
{
    for(const line of abilities)
    {
        if(pattern.test(line))
        {
            const match =
                line.match(/(\d+)\s*%/);

            if(match)
            {
                return parseFloat(match[1]) / 100;
            }
        }
    }

    return 0;
}

// =====================================================
// ABILITY COUNT PARSER
// =====================================================
// for guaranteed-effect abilities phrased as a count
// rather than a chance - "kills 1 crew member" vs
// BOMB01's "20% chance to kill all crew". different
// mechanics, so separate fields.

function parseCountAbility(
    abilities,
    pattern
)
{
    for(const line of abilities)
    {
        const match =
            line.match(pattern);

        if(match)
        {
            return parseInt(match[1], 10);
        }
    }

    return 0;
}

// =====================================================
// LOOKUP
// =====================================================

function getAmmoType(
    ammoId
)
{
    return ammoTypes.find(
        ammo =>
            ammo.id.toLowerCase() ===
            ammoId.toLowerCase()
    );
}

// =====================================================
// CURRENT MODE
// =====================================================

function getAmmoForCurrentMode()
{
    return ammoTypes.filter(
        ammo =>
        {
            if(ACTIVE_GAME_MODE === "gm01")
            {
                return ammo.gm01;
            }

            if(ACTIVE_GAME_MODE === "gm03")
            {
                return ammo.gm03;
            }

            return true;
        }
    );
}