console.log("resize.js loaded");

window.originalWidth = 0;
window.originalHeight = 0;

window.resizedFile = null;

function loadResizeUI()
{
    window.currentTool = "resize";

    const controlsTitle =
        document.getElementById("controlsTitle");

    const controlsContent =
        document.getElementById("controlsContent");

    controlsTitle.textContent =
        "Resize Settings";

    controlsContent.innerHTML = `

<div class="control-group">

    <div class="input-row">

        <label for="resizeWidth">
            Width
        </label>

        <div class="input-unit">

            <input
                type="number"
                id="resizeWidth"
                disabled
            >

            <span>px</span>

        </div>

    </div>

</div>



<div class="control-group">

    <div class="input-row">

        <label for="resizeHeight">
            Height
        </label>

        <div class="input-unit">

            <input
                type="number"
                id="resizeHeight"
                disabled
            >

            <span>px</span>

        </div>

    </div>

</div>



<div class="control-group">

    <div class="checkbox-row">

        <label for="keepAspect">

            Keep Aspect Ratio

        </label>

        <input
            type="checkbox"
            id="keepAspect"
            checked
            disabled
        >

    </div>

</div>



<div class="control-group">

    <label>
        Resize %
    </label>

    <select
        id="resizePercent"
        disabled
    >

        <option value="100">100%</option>
        <option value="75">75%</option>
        <option value="50">50%</option>
        <option value="25">25%</option>

    </select>

</div>



<div class="control-buttons">

    <button
        class="btn btn-secondary"
        id="resizeBtn"
        disabled
    >
        Resize
    </button>



    <button
        class="btn btn-primary"
        id="downloadBtn"
        disabled
    >
        Download
    </button>

</div>

`;

    const widthInput =
        document.getElementById("resizeWidth");

    const heightInput =
        document.getElementById("resizeHeight");

    const keepAspect =
        document.getElementById("keepAspect");

    const percent =
        document.getElementById("resizePercent");

    const resizeBtn =
        document.getElementById("resizeBtn");



    resizeBtn.addEventListener("click", () =>
    {
        resizeImage();
    });



    percent.addEventListener("change", () =>
    {

        if(window.originalWidth === 0)
        {
            return;
        }

        const scale =
            Number(percent.value) / 100;

        widthInput.value =
            Math.round(window.originalWidth * scale);

        heightInput.value =
            Math.round(window.originalHeight * scale);

    });



    widthInput.addEventListener("input", () =>
    {

        if(!keepAspect.checked)
        {
            return;
        }

        const ratio =
            window.originalHeight /
            window.originalWidth;

        heightInput.value =
            Math.round(widthInput.value * ratio);

    });



    heightInput.addEventListener("input", () =>
    {

        if(!keepAspect.checked)
        {
            return;
        }

        const ratio =
            window.originalWidth /
            window.originalHeight;

        widthInput.value =
            Math.round(heightInput.value * ratio);

    });



    updateToolButtons();



    window.enableResizeEditor =
        enableResizeEditor;

}






function enableResizeEditor()
{

    const image =
        document.getElementById("previewImage");

    if(!image)
    {
        return;
    }

    const prepare = () =>
    {

        window.originalWidth =
            image.naturalWidth;

        window.originalHeight =
            image.naturalHeight;

        const widthInput =
            document.getElementById("resizeWidth");

        const heightInput =
            document.getElementById("resizeHeight");

        const keepAspect =
            document.getElementById("keepAspect");

        const percent =
            document.getElementById("resizePercent");

        const resizeBtn =
            document.getElementById("resizeBtn");

        widthInput.value =
            window.originalWidth;

        heightInput.value =
            window.originalHeight;

        widthInput.disabled = false;
        heightInput.disabled = false;
        keepAspect.disabled = false;
        percent.disabled = false;
        resizeBtn.disabled = false;

    };

    if(image.complete)
    {
        prepare();
    }
    else
    {
        image.onload = prepare;
    }

}
function resizeImage()
{

    if(!window.selectedFile)
    {
        return;
    }



    const width =
        Number(
            document.getElementById("resizeWidth").value
        );


    const height =
        Number(
            document.getElementById("resizeHeight").value
        );



    if(width <= 0 || height <= 0)
    {
        alert("Enter valid dimensions.");
        return;
    }



    const resizeBtn =
        document.getElementById("resizeBtn");


    const downloadBtn =
        document.getElementById("downloadBtn");



    resizeBtn.disabled = true;

    resizeBtn.innerHTML =
    `
    <i class="fas fa-spinner fa-spin"></i>
    Processing...
    `;




    const img =
        new Image();



    img.onload = function()
    {

        const canvas =
            document.createElement("canvas");


        const ctx =
            canvas.getContext("2d");



        canvas.width =
            width;


        canvas.height =
            height;



        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";



        ctx.drawImage(
            img,
            0,
            0,
            width,
            height
        );



        canvas.toBlob(

            function(blob)
            {

                window.resizedFile =
                    blob;



                downloadBtn.disabled =
                    false;



                resizeBtn.innerHTML =
                `
                <i class="fas fa-check"></i>
                Completed
                `;



                console.log(
                    "Original:",
                    window.selectedFile.size
                );


                console.log(
                    "Resized:",
                    blob.size
                );



                setTimeout(() =>
                {

                    resizeBtn.innerHTML =
                        "Resize";


                    resizeBtn.disabled =
                        false;


                },1200);



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