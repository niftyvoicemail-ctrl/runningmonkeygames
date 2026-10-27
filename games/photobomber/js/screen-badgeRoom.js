/*
==============================================================================
SCREEN BADGE ROOM
==============================================================================
*/

const badgeRanks =
[
    "RECRUIT",
    "PRIVATE",
    "CORPORAL",
    "SERGEANT",
    "LIEUTENANT",
    "CAPTAIN",
    "MAJOR",
    "COLONEL",
    "GENERAL",
    "SUPREME COMMANDER"
];
// end

const badgeGoals =
[
    10,
    100,
    1000,
    10000,
    100000,
    1000000,
    10000000,
    100000000,
    1000000000,
    10000000000
];
// end

const timeGoals =
[
    100,
    1000,
    10000,
    100000,
    1000000,
    10000000,
    100000000,
    1000000000,
    10000000000,
    100000000000
];
// end

class ScreenBadgeRoom
{
    constructor()
    {
        this.background =
            new Image();

        this.background.src =
            "assets/107-menu_badgeRoom.png";

        this.scrollRank = 0;
    }
// end

//------------------------------------------------------------------
// open
//------------------------------------------------------------------

    open()
    {
        console.log(
            "BADGE ROOM OPEN"
        );

       if (
    currentSave &&
    currentSave.career
)
{
    this.scrollRank =
        currentSave.career.currentRank;
}
else
{
    this.scrollRank = 0;
}
// end 
    }
// end

//------------------------------------------------------------------
// format number
//------------------------------------------------------------------

formatNumber(value)
{
    if (value >= 1000000000)
    {
        return (
            value / 1000000000
        ).toFixed(0) + "B";
    }

    if (value >= 1000000)
    {
        return (
            value / 1000000
        ).toFixed(0) + "M";
    }

    if (value >= 1000)
    {
        return (
            value / 1000
        ).toFixed(0) + "K";
    }

    return value.toString();
}
// end


//------------------------------------------------------------------
// update
//------------------------------------------------------------------

    update(delta)
    {
        const click =
            input.takeClick();

        if (!click)
        {
            return;
        }

        //--------------------------------------------------
        // headquarters
        //--------------------------------------------------

        const hqX =
            canvas.width - 260;

        const hqY =
            20;

        const hqW =
            220;

        const hqH =
            50;

        if (
            click.x >= hqX &&
            click.x <= hqX + hqW &&
            click.y >= hqY &&
            click.y <= hqY + hqH
        )
        {
            saveManager.saveCurrent();

            screenManager.changeScreenByName(
                "hub"
            );

            return;
        }

//--------------------------------------------------
// RESET BUTTON
//--------------------------------------------------

if (
    click.x >= 40 &&
    click.x <= 200 &&
    click.y >= 190 &&
    click.y <= 240
)
{
    currentSave.statistics.totalBodyCount =
        0;

    currentSave.statistics.totalPlayTime =
        0;

    currentSave.career.currentRank =
        0;

    currentSave.career.upgradePoints =
        0;

    saveManager.saveCurrent();
}
// end

        //--------------------------------------------------
        // DEBUG BUTTON
        //--------------------------------------------------

        if (
            click.x >= 40 &&
            click.x <= 200 &&
            click.y >= 120 &&
            click.y <= 170
        )
        {
            currentSave.statistics.totalBodyCount
                += 1000;

            saveManager.saveCurrent();
        }
		
		//--------------------------------------------------
// TIME BUTTON
//--------------------------------------------------

if (
    click.x >= 40 &&
    click.x <= 200 &&
    click.y >= 260 &&
    click.y <= 310
)
{
    currentSave.statistics.totalPlayTime
        += 1000;

    saveManager.saveCurrent();
}
// end

     //--------------------------------------------------
// PROMOTION
//--------------------------------------------------

const rank =
    currentSave.career.currentRank;

const goal =
    badgeGoals[rank];

if (
    currentSave.statistics.totalBodyCount
    >= goal
)
{
    const promoteX =
        canvas.width - 520;

    const promoteY =
        20;

    const promoteW =
        220;

    const promoteH =
        50;

   if (
    click.x >= promoteX &&
    click.x <= promoteX + promoteW &&
    click.y >= promoteY &&
    click.y <= promoteY + promoteH
)
{
    if (
        currentSave.career.currentRank <
        badgeRanks.length - 1
    )
    {
        currentSave.career.currentRank++;

        currentSave.career.upgradePoints += 3;

        saveManager.saveCurrent();
    }
}
// end 
}
// end   


    }
// end update

//------------------------------------------------------------------
// draw
//------------------------------------------------------------------

    draw(ctx)
    {
        //--------------------------------------------------
        // background
        //--------------------------------------------------

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

        ctx.fillStyle =
            "rgba(0,0,0,0.75)";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        //--------------------------------------------------
        // headquarters button
        //--------------------------------------------------

        const hqX =
            canvas.width - 260;

        const hqY =
            20;

        const hqW =
            220;

        const hqH =
            50;

        ctx.fillStyle =
            "#2a1d10";

        ctx.fillRect(
            hqX,
            hqY,
            hqW,
            hqH
        );

        ctx.strokeStyle =
            "#d8b46a";

        ctx.strokeRect(
            hqX,
            hqY,
            hqW,
            hqH
        );

        ctx.fillStyle =
            "#d8c090";

        ctx.font =
            "22px Georgia";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "HEADQUARTERS",
            hqX + hqW / 2,
            hqY + 33
        );

//--------------------------------------------------
// KILLS PER SECOND DIAL
//--------------------------------------------------

const dialX =
    canvas.width - 170;

const dialY =
    220;

const killsPerSecond =
    currentSave.statistics.totalPlayTime > 0
    ?
    currentSave.statistics.totalBodyCount /
    currentSave.statistics.totalPlayTime
    :
    0;
// end

//--------------------------------------------------
// DIAL RING
//--------------------------------------------------

ctx.strokeStyle =
    "#9da3a8";

ctx.lineWidth =
    4;

ctx.beginPath();

ctx.arc(
    dialX,
    dialY,
    70,
    0,
    Math.PI * 2
);

ctx.stroke();

ctx.lineWidth = 1;
// end

//--------------------------------------------------
// DIAL LABELS
//--------------------------------------------------

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "18px Georgia";

ctx.textAlign =
    "center";

const dialLabels =
[
    { text:"0",    a:0.0 },
    { text:"10",    a:1 },
    { text:"100",   a:2 },
    { text:"1K",  a:3 },
    { text:"10K",   a:4 },
    { text:"100K", a:5 }
];

for (
    const label
    of
    dialLabels
)
{
    const radius =
        95;

    ctx.fillText(
        label.text,

        dialX +
        Math.cos(
            label.a
        ) * radius,

        dialY +
        Math.sin(
            label.a
        ) * radius
    );
}
// end

//--------------------------------------------------
// DIAL TICK MARKS
//--------------------------------------------------

for (
    const label
    of
    dialLabels
)
{
    const innerRadius =
        52;

    const outerRadius =
        66;

    ctx.beginPath();

    ctx.moveTo(
        dialX +
        Math.cos(
            label.a
        ) *
        innerRadius,

        dialY +
        Math.sin(
            label.a
        ) *
        innerRadius
    );

    ctx.lineTo(
        dialX +
        Math.cos(
            label.a
        ) *
        outerRadius,

        dialY +
        Math.sin(
            label.a
        ) *
        outerRadius
    );

    ctx.strokeStyle =
        "#9da3a8";

    ctx.stroke();
}
// end

//--------------------------------------------------
// NEEDLE
//--------------------------------------------------

const angle =
    2.42;

ctx.strokeStyle =
    "#9da3a8";

ctx.lineWidth =
    3;

ctx.beginPath();

ctx.moveTo(
    dialX,
    dialY
);

ctx.lineTo(
    dialX +
    Math.cos(
        angle
    ) * 50,

    dialY +
    Math.sin(
        angle
    ) * 50
);

ctx.stroke();

ctx.lineWidth = 1;
// end

//--------------------------------------------------
// CENTER POST
//--------------------------------------------------

ctx.beginPath();

ctx.arc(
    dialX,
    dialY,
    8,
    0,
    Math.PI * 2
);

ctx.fillStyle =
    "#9da3a8";

ctx.fill();

ctx.stroke();
// end

//--------------------------------------------------
// DIAL TITLE
//--------------------------------------------------

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "20px Georgia";

ctx.textAlign =
    "center";

ctx.fillText(
    "KILLS / SEC",
    dialX,
    dialY + 110
);
// end



		
		

        //--------------------------------------------------
        // rank title
        //--------------------------------------------------

        const rankIndex =
    Math.min(
        currentSave.career.currentRank,
        badgeRanks.length - 1
    );
// end

        ctx.fillStyle =
            "#d8b46a";

        ctx.font =
            "64px Georgia";

        ctx.fillText(
            badgeRanks[rankIndex],
            canvas.width / 2,
            100
        );

        //--------------------------------------------------
        // body count tube
        //--------------------------------------------------
		
		
        const goal =
            badgeGoals[rankIndex];

        const bodyCount =
            currentSave.statistics.totalBodyCount;

        const progress =
            Math.min(
                1,
                bodyCount / goal
            );

        const tubeX = 400;
        const tubeY = 160;

        const tubeW = 30;
        const tubeH =
    canvas.height + 200;

        ctx.strokeStyle =
            "#d8c090";

        ctx.strokeRect(
            tubeX,
            tubeY,
            tubeW,
            tubeH
        );

        ctx.fillStyle =
            "#9da3a8";

        ctx.fillRect(
            tubeX + 4,
            tubeY + tubeH,
            tubeW - 8,
            -(tubeH * progress)
        );

//bubble

ctx.beginPath();

ctx.arc(
    tubeX + tubeW / 2,
    tubeY - 20,
    24,
    0,
    Math.PI * 2
);

ctx.stroke();
//end

//--------------------------------------------------
// PLAY TIME TUBE
//--------------------------------------------------

const playTime =
    currentSave.statistics.totalPlayTime;

const timeGoal =
    timeGoals[rankIndex];

const timeProgress =
    Math.min(
        1,
        playTime / timeGoal
    );

const timeTubeX =
    tubeX + 280;

ctx.strokeRect(
    timeTubeX,
    tubeY,
    tubeW,
    tubeH
);

ctx.fillRect(
    timeTubeX + 4,
    tubeY + tubeH,
    tubeW - 8,
    -(tubeH * timeProgress)
);

ctx.beginPath();

ctx.arc(
    timeTubeX + tubeW / 2,
    tubeY - 20,
    24,
    0,
    Math.PI * 2
);

ctx.stroke();
// end

//--------------------------------------------------
// AIR ASSULT KILLS creep 01-06 TUBE
//--------------------------------------------------

const creep1TubeX =
    tubeX + 560;

const creep1Count =
    currentSave.statistics.totalBodyCount;

const creep1Goal =
    badgeGoals[rankIndex];

const creep1Progress =
    Math.min(
        1,
        creep1Count /
        creep1Goal
    );

ctx.strokeRect(
    creep1TubeX,
    tubeY,
    tubeW,
    tubeH
);

ctx.fillRect(
    creep1TubeX + 4,
    tubeY + tubeH,
    tubeW - 8,
    -(tubeH * creep1Progress)
);

ctx.beginPath();

ctx.arc(
    creep1TubeX + tubeW / 2,
    tubeY - 20,
    24,
    0,
    Math.PI * 2
);

ctx.stroke();
// end

//--------------------------------------------------
// GROUND DEFENCE creep 07-10 TUBE
//--------------------------------------------------

const creep2TubeX =
    tubeX + 840;

const creep2Count =
    currentSave.statistics.totalBodyCount;

const creep2Goal =
    badgeGoals[rankIndex];

const creep2Progress =
    Math.min(
        1,
        creep2Count /
        creep2Goal
    );

ctx.strokeRect(
    creep2TubeX,
    tubeY,
    tubeW,
    tubeH
);

ctx.fillRect(
    creep2TubeX + 4,
    tubeY + tubeH,
    tubeW - 8,
    -(tubeH * creep2Progress)
);

ctx.beginPath();

ctx.arc(
    creep2TubeX + tubeW / 2,
    tubeY - 20,
    24,
    0,
    Math.PI * 2
);

ctx.stroke();
// end

//--------------------------------------------------
// SPECIAL TASK TUBE
//--------------------------------------------------

const taskTubeX =
    tubeX + 1120;

const taskCount =
    currentSave.statistics.totalBodyCount;

const taskGoal =
    badgeGoals[rankIndex];

const taskProgress =
    Math.min(
        1,
        taskCount /
        taskGoal
    );

ctx.strokeRect(
    taskTubeX,
    tubeY,
    tubeW,
    tubeH
);

ctx.fillRect(
    taskTubeX + 4,
    tubeY + tubeH,
    tubeW - 8,
    -(tubeH * taskProgress)
);

ctx.beginPath();

ctx.arc(
    taskTubeX + tubeW / 2,
    tubeY - 20,
    24,
    0,
    Math.PI * 2
);

ctx.stroke();
// end

//--------------------------------------------------
// TICK MARK DATA
//--------------------------------------------------

const visibleTop =
    tubeY;

const visibleBottom =
    canvas.height - 40;

const visibleHeight =
    visibleBottom - visibleTop;

const percent =
[
    "100%",
    "75%",
    "50%",
    "25%",
    "0%"
];
// end


//--------------------------------------------------
// BODY COUNT TICKS
//--------------------------------------------------

for (
    let i = 0;
    i < 5;
    i++
)
{
    const markY =
        visibleTop +
        (
            i *
            (
                visibleHeight / 4
            )
        );

    ctx.beginPath();

    ctx.moveTo(
        tubeX - 12,
        markY
    );

    ctx.lineTo(
        tubeX + tubeW + 12,
        markY
    );

    ctx.stroke();

    ctx.fillStyle =
        "#d8c090";

    ctx.font =
        "18px Georgia";

    ctx.textAlign =
        "left";

    ctx.fillText(
        percent[i],
        tubeX + 45,
        markY + 6
    );
}
// end

//--------------------------------------------------
// PLAY TIME TICKS
//--------------------------------------------------

for (
    let i = 0;
    i < 5;
    i++
)
{
    const markY =
        visibleTop +
        (
            i *
            (
                visibleHeight / 4
            )
        );

    ctx.beginPath();

    ctx.moveTo(
        timeTubeX - 12,
        markY
    );

    ctx.lineTo(
        timeTubeX + tubeW + 12,
        markY
    );

    ctx.stroke();
}
// end


        //--------------------------------------------------
        // labels
        //--------------------------------------------------
		
		//--------------------------------------------------
        // body count
        //--------------------------------------------------

 ctx.save();

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "24px Georgia";

ctx.textAlign =
    "center";

ctx.translate(
    tubeX - 65,
    (canvas.height / 2) + 170
);

ctx.rotate(
    -Math.PI / 2
);

ctx.fillText(
    "BODY COUNT",
    0,
    0
);

ctx.restore();
// end    

  ctx.save();

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "20px Georgia";

ctx.textAlign =
    "center";

ctx.translate(
    tubeX - 95,
    (canvas.height / 2) - 40
);

ctx.rotate(
    -Math.PI / 2
);

ctx.fillText(
    this.formatNumber(
        bodyCount
    )
    +
    " / "
    +
    this.formatNumber(
        goal
    ),
    0,
    0
);

ctx.restore();
// end

ctx.save();

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "20px Georgia";

ctx.textAlign =
    "center";

ctx.translate(
    timeTubeX - 95,
    (canvas.height / 2) - 40
);

ctx.rotate(
    -Math.PI / 2
);

ctx.fillText(
    this.formatNumber(
        playTime
    )
    +
    " / "
    +
    this.formatNumber(
        timeGoal
    )
    +
    " SEC",
    0,
    0
);


ctx.restore();
// end

ctx.save();

ctx.fillStyle =
    "#d8c090";

ctx.font =
    "24px Georgia";

ctx.textAlign =
    "center";

ctx.translate(
    timeTubeX - 65,
    (canvas.height / 2) + 170
);

ctx.rotate(
    -Math.PI / 2
);

ctx.fillText(
    "PLAY TIME",
    0,
    0
);

ctx.restore();
// end




        //--------------------------------------------------
        // debug button
        //--------------------------------------------------

        ctx.fillStyle =
            "#2a1d10";

        ctx.fillStyle =
    "#2a1d10";

ctx.fillRect(
    40,
    190,
    160,
    50
);

ctx.strokeStyle =
    "#d8b46a";


ctx.fillStyle =
    "#d8c090";

ctx.fillText(
    "RESET",
    120,
    222
);
// end
		
		ctx.strokeStyle =
    "#d8b46a";

ctx.fillStyle =
    "#2a1d10";

ctx.fillRect(
    40,
    120,
    160,
    50
);
// end

ctx.strokeRect(
    40,
    190,
    160,
    50
);
// end

        ctx.strokeStyle =
            "#d8b46a";

        ctx.strokeRect(
            40,
            120,
            160,
            50
        );

        ctx.fillStyle =
            "#d8c090";

        ctx.fillText(
            "+1000 KILLS",
			
            120,
            152
        );
		
		ctx.fillRect(
    40,
    190,
    160,
    50
);
		
		ctx.fillText(
    "RESET",

    120,
    222
);
// end


ctx.fillStyle =
    "#2a1d10";

ctx.fillRect(
    40,
    260,
    160,
    50
);

ctx.strokeStyle =
    "#d8b46a";

ctx.strokeRect(
    40,
    260,
    160,
    50
);

ctx.fillStyle =
    "#d8c090";

ctx.fillText(
    "+1000 SEC",
    120,
    292
);
// end

       //--------------------------------------------------
// promote button
//--------------------------------------------------

if (
    bodyCount >= goal
)
{
    const promoteX =
        canvas.width - 520;

    const promoteY =
        20;

    const promoteW =
        220;

    const promoteH =
        50;

    ctx.fillStyle =
        "#204020";

    ctx.fillRect(
        promoteX,
        promoteY,
        promoteW,
        promoteH
    );

    ctx.strokeStyle =
        "#d8b46a";

    ctx.strokeRect(
        promoteX,
        promoteY,
        promoteW,
        promoteH
    );

    ctx.fillStyle =
        "#d8c090";

    ctx.font =
        "22px Georgia";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "PROMOTE",
        promoteX +
        promoteW / 2,
        promoteY + 33
    );
}
// end promote button

    }
// end draw

}
// end ScreenBadgeRoom

const screenBadgeRoom =
    new ScreenBadgeRoom();