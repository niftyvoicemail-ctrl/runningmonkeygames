// =====================================================
// CAMERA CAPTURE
// =====================================================
// ported from PhotoBlaster's web build (openCam /
// gotStream / doSnap). Same fallback order: try the
// rear camera first, fall back to any camera, fall back
// to a clear error message pointing at the manual
// "Load Map Image" file picker (already in map.js) if
// no camera is available at all.
//
// on capture, the frame is drawn onto an offscreen
// canvas and handed to mapImage via a data URL - from
// there the existing map.js pipeline (mapImage.onload ->
// findDarkSpots()) picks it up exactly like it would a
// picked file or the old sample JPG. nothing downstream
// needs to know or care where the image came from.

const cameraOverlay =
    document.getElementById(
        "cameraOverlay"
    );

const cameraStatus =
    document.getElementById(
        "cameraStatus"
    );

const camVideo =
    document.getElementById(
        "camVideo"
    );

const takePhotoBtn =
    document.getElementById(
        "takePhotoBtn"
    );

let camStream = null;

// --------------------------------
// OPEN CAMERA
// --------------------------------

function openCam()
{
    if(
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    )
    {
        showCameraFallback(
            "This browser doesn't support camera access.\n" +
            "Use \"Load Map Image\" instead once the game loads."
        );

        return;
    }

    navigator.mediaDevices.getUserMedia(
        {
            video:
            {
                facingMode:
                {
                    ideal: "environment"
                },
                width:
                {
                    ideal: 1920
                },
                height:
                {
                    ideal: 1080
                }
            },
            audio: false
        }
    )
        .then(gotStream)
        .catch(() =>
        {
            // rear camera not available - try any camera

            navigator.mediaDevices.getUserMedia(
                {
                    video:
                    {
                        width:
                        {
                            ideal: 1920
                        },
                        height:
                        {
                            ideal: 1080
                        }
                    },
                    audio: false
                }
            )
                .then(gotStream)
                .catch(err =>
                {
                    let msg =
                        "No camera found.\n" +
                        "Use \"Load Map Image\" instead once the game loads.";

                    if(
                        err.name === "NotAllowedError" ||
                        err.name === "PermissionDeniedError"
                    )
                    {
                        msg =
                            "Camera access blocked.\n" +
                            "Allow it in your browser settings, or use \"Load Map Image\" instead.";
                    }
                    else if(err.name === "NotFoundError")
                    {
                        msg =
                            "No webcam detected.\n" +
                            "Use \"Load Map Image\" instead once the game loads.";
                    }
                    else if(err.name === "NotReadableError")
                    {
                        msg =
                            "Camera is in use\n" +
                            "by another app right now.";
                    }
                    else
                    {
                        msg =
                            "Camera error: " +
                            err.name;
                    }

                    showCameraFallback(msg);
                });
        });
}

// --------------------------------
// GOT STREAM
// --------------------------------

function gotStream(stream)
{
    camStream = stream;

    camVideo.srcObject = stream;

    camVideo.onplaying = () =>
    {
        takePhotoBtn.disabled = false;

        cameraStatus.textContent =
            "Point the camera, then take your photo";
    };

    camVideo.play().catch(() => {});
}

// --------------------------------
// CAMERA UNAVAILABLE
// --------------------------------

function showCameraFallback(msg)
{
    cameraStatus.textContent = msg;

    takePhotoBtn.disabled = true;
}

// --------------------------------
// STOP CAMERA
// --------------------------------
// called right after a successful snap so the camera
// isn't still running in the background during play.

function stopCam()
{
    if(camStream)
    {
        camStream
            .getTracks()
            .forEach(
                track => track.stop()
            );

        camStream = null;
    }
}

// --------------------------------
// TAKE PHOTO
// --------------------------------

function doSnap()
{
    if(!camVideo.videoWidth)
    {
        return;
    }

    const tmp =
        document.createElement(
            "canvas"
        );

    tmp.width =
        camVideo.videoWidth;

    tmp.height =
        camVideo.videoHeight;

    tmp.getContext("2d")
        .drawImage(
            camVideo,
            0,
            0
        );

    mapImage.src =
        tmp.toDataURL(
            "image/jpeg",
            0.9
        );

    stopCam();

    cameraOverlay.classList.add(
        "hidden"
    );
}

takePhotoBtn.addEventListener(
    "click",
    doSnap
);

// --------------------------------
// START CAMERA CAPTURE
// --------------------------------
// the camera no longer opens at page load - the menus
// need the screen first, and the overlay sits at
// z-index 30 so it would cover them. index.html's
// startGameplay() calls this once a game mode is chosen.

function startCameraCapture()
{
    cameraOverlay.classList.remove(
        "hidden"
    );

    cameraStatus.textContent =
        "Requesting camera access...";

    takePhotoBtn.disabled = true;

    openCam();
}