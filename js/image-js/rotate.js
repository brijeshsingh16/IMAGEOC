console.log("rotate.js loaded");

/*=========================================
    GLOBAL STATE
=========================================*/

window.rotation = 0;
window.flipX = 1;
window.flipY = 1;

window.rotatedFile = null;
window.enableRotateEditor = null;

/*=========================================
    LOAD ROTATE UI
=========================================*/

function loadRotateUI()
{
    window.currentTool = "rotate";

    window.rotation = 0;
    window.flipX = 1;
    window.flipY = 1;

    window.rotatedFile = null;

    const controlsTitle =
        document.getElementById("controlsTitle");

    const controlsContent =
        document.getElementById("controlsContent");

    controlsTitle.textContent =
        "Rotate & Flip";

    controlsContent.innerHTML = `

        <div class="control-group">

            <label>Rotate</label>

            <div class="control-buttons">

                <button
                    id="rotateLeftBtn"
                    class="btn btn-secondary"
                    disabled>

                    <i class="fas fa-undo-alt"></i>

                    Left

                </button>

                <button
                    id="rotateRightBtn"
                    class="btn btn-secondary"
                    disabled>

                    <i class="fas fa-redo-alt"></i>

                    Right

                </button>

            </div>

        </div>



        <div class="control-group">

            <label>Flip</label>

            <div class="control-buttons">

                <button
                    id="flipHorizontalBtn"
                    class="btn btn-secondary"
                    disabled>

                    <i class="fas fa-arrows-alt-h"></i>

                    Horizontal

                </button>

                <button
                    id="flipVerticalBtn"
                    class="btn btn-secondary"
                    disabled>

                    <i class="fas fa-arrows-alt-v"></i>

                    Vertical

                </button>

            </div>

        </div>



        <div class="control-buttons">

            <button
                id="resetRotateBtn"
                class="btn btn-secondary"
                disabled>

                Reset

            </button>

            <button
                id="downloadBtn"
                class="btn btn-primary"
                disabled>

                Download

            </button>

        </div>

    `;

    bindRotateEvents();

    updateToolButtons();

    window.enableRotateEditor =
        enableRotateEditor;
}

/*=========================================
    ENABLE EDITOR
=========================================*/

function enableRotateEditor()
{
    window.rotation = 0;
    window.flipX = 1;
    window.flipY = 1;

    window.rotatedFile = null;

    document
        .querySelectorAll(
            "#rotateLeftBtn," +
            "#rotateRightBtn," +
            "#flipHorizontalBtn," +
            "#flipVerticalBtn," +
            "#resetRotateBtn"
        )
        .forEach(button =>
        {
            button.disabled = false;
        });

    renderRotatePreview();
}

/*=========================================
    EVENTS
=========================================*/

function bindRotateEvents()
{
    document
        .getElementById("rotateLeftBtn")
        .onclick = rotateLeft;

    document
        .getElementById("rotateRightBtn")
        .onclick = rotateRight;

    document
        .getElementById("flipHorizontalBtn")
        .onclick = flipHorizontal;

    document
        .getElementById("flipVerticalBtn")
        .onclick = flipVertical;

    document
        .getElementById("resetRotateBtn")
        .onclick = resetRotation;
}

/*=========================================
    BUTTON ACTIONS
=========================================*/

function rotateLeft()
{
    window.rotation -= 90;

    renderRotatePreview();
}

function rotateRight()
{
    window.rotation += 90;

    renderRotatePreview();
}

function flipHorizontal()
{
    window.flipX *= -1;

    renderRotatePreview();
}

function flipVertical()
{
    window.flipY *= -1;

    renderRotatePreview();
}

function resetRotation()
{
    window.rotation = 0;
    window.flipX = 1;
    window.flipY = 1;

    renderRotatePreview();
}
/*=========================================
    BUTTON ACTIONS
=========================================*/

function rotateLeft()
{
    window.rotation -= 90;
    renderRotatePreview();
}

function rotateRight()
{
    window.rotation += 90;
    renderRotatePreview();
}

function flipHorizontal()
{
    window.flipX *= -1;
    renderRotatePreview();
}

function flipVertical()
{
    window.flipY *= -1;
    renderRotatePreview();
}

function resetRotation()
{
    window.rotation = 0;
    window.flipX = 1;
    window.flipY = 1;

    renderRotatePreview();
}


/*=========================================
    RENDER PREVIEW
=========================================*/

function renderRotatePreview()
{
    if(!window.selectedFile)
    {
        return;
    }

    const img = new Image();

    img.onload = function()
    {

        const angle =
            ((window.rotation % 360) + 360) % 360;

        const radians =
            angle * Math.PI / 180;

        const canvas =
            document.createElement("canvas");

        const ctx =
            canvas.getContext("2d");



        /*----------------------------------
            Calculate canvas size
        ----------------------------------*/

        const sin =
            Math.abs(Math.sin(radians));

        const cos =
            Math.abs(Math.cos(radians));

        canvas.width =
            Math.ceil(
                img.width * cos +
                img.height * sin
            );

        canvas.height =
            Math.ceil(
                img.width * sin +
                img.height * cos
            );



        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";



        ctx.save();

        ctx.translate(
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.rotate(radians);

        ctx.scale(
            window.flipX,
            window.flipY
        );

        ctx.drawImage(
            img,
            -img.width / 2,
            -img.height / 2
        );

        ctx.restore();



        /*----------------------------------
            Update Preview
        ----------------------------------*/

        const preview =
            document.getElementById("previewImage");

        preview.src =
            canvas.toDataURL(
                "image/jpeg",
                0.95
            );



        /*----------------------------------
            Create Blob
        ----------------------------------*/

        canvas.toBlob(

            function(blob)
            {

                window.rotatedFile =
                    blob;

                const downloadBtn =
                    document.getElementById("downloadBtn");

                if(downloadBtn)
                {
                    downloadBtn.disabled = false;
                }

            },

            "image/jpeg",

            0.95

        );

    };



    img.src =
        URL.createObjectURL(window.selectedFile);
}
/*=========================================
    PREPARE DOWNLOAD IMAGE
=========================================*/

function prepareRotatedImage(callback)
{
    if(!window.selectedFile)
    {
        return;
    }

    const img = new Image();

    img.onload = function()
    {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const angle =
            ((window.rotation % 360) + 360) % 360;

        if(angle === 90 || angle === 270)
        {
            canvas.width = img.height;
            canvas.height = img.width;
        }
        else
        {
            canvas.width = img.width;
            canvas.height = img.height;
        }

        ctx.save();

        ctx.translate(
            canvas.width / 2,
            canvas.height / 2
        );

        ctx.rotate(
            window.rotation * Math.PI / 180
        );

        ctx.scale(
            window.flipX,
            window.flipY
        );

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            img,
            -img.width / 2,
            -img.height / 2
        );

        ctx.restore();

        canvas.toBlob(

            function(blob)
            {
                window.rotatedFile = blob;

                if(typeof callback === "function")
                {
                    callback();
                }
            },

            "image/jpeg",

            0.95

        );
    };

    img.src =
        URL.createObjectURL(
            window.selectedFile
        );
}



/*=========================================
    DOWNLOAD INTERCEPT
=========================================*/

document.addEventListener("click", function(e)
{
    const button =
        e.target.closest("#downloadBtn");

    if(!button)
    {
        return;
    }

    if(window.currentTool !== "rotate")
    {
        return;
    }

    if(window.rotatedFile)
    {
        return;
    }

    e.preventDefault();

    button.disabled = true;

    button.innerHTML =
    `
        <i class="fas fa-spinner fa-spin"></i>
        Preparing...
    `;

    prepareRotatedImage(function()
    {
        button.disabled = false;

        button.innerHTML =
        `
            <i class="fas fa-download"></i>
            Download
        `;

        setTimeout(function()
        {
            button.click();
        },30);
    });

},true);



/*=========================================
    RESET
=========================================*/

function resetRotateState()
{
    window.rotation = 0;

    window.flipX = 1;

    window.flipY = 1;

    window.rotatedFile = null;
}



/*=========================================
    TOOL CHANGE
=========================================*/

document.addEventListener("DOMContentLoaded", function()
{
    document.addEventListener("toolChanged", function()
    {
        resetRotateState();
    });
});