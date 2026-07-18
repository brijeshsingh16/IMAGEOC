console.log("crop.js loaded");


window.cropper = null;




function loadCropUI()
{
    // Mark Crop tool as active
    window.currentTool = "crop";
    const controlsTitle =
        document.getElementById("controlsTitle");


    const controlsContent =
        document.getElementById("controlsContent");



    controlsTitle.textContent =
        "Crop Settings";



    controlsContent.innerHTML = `

        <div class="control-group">

            <label>
                Aspect Ratio
            </label>


            <select id="cropRatio" disabled>

                <option value="NaN">
                    Free
                </option>


                <option value="1">
                    Square (1:1)
                </option>


                <option value="1.777777">
                    Landscape (16:9)
                </option>


                <option value="1.333333">
                    Standard (4:3)
                </option>


            </select>

        </div>



        <div class="control-buttons">


            <button
                class="btn btn-secondary"
                id="cropBtn"
                disabled>

                Crop

            </button>




            <button
                class="btn btn-primary"
                id="downloadBtn"
                disabled>

                Download

            </button>


        </div>

    `;





    const cropBtn =
        document.getElementById("cropBtn");


    const ratioSelect =
        document.getElementById("cropRatio");





    cropBtn.addEventListener("click", () =>
    {

        cropImage();

    });







    ratioSelect.addEventListener("change", () =>
    {

        if(window.cropper)
        {

            const value =
                ratioSelect.value;



            if(value === "NaN")
            {
                window.cropper.setAspectRatio(NaN);
            }
            else
            {
                window.cropper.setAspectRatio(
                    Number(value)
                );
            }

        }

    });





    window.enableCropEditor =
        enableCropEditor;



    updateToolButtons();

}









function enableCropEditor()
{
    const image =
        document.getElementById("previewImage");

    if(!image)
    {
        console.log("Preview image missing");
        return;
    }

    const initCropper = () =>
    {
        // Destroy previous cropper
        if(window.cropper)
        {
            window.cropper.destroy();
            window.cropper = null;
        }

        // Remove leftover Cropper DOM
        document.querySelectorAll(".cropper-container").forEach(container =>
        {
            container.remove();
        });

        // Create new cropper
        window.cropper =
        new Cropper(
            image,
            {
                viewMode: 1,
                dragMode: "move",
                autoCropArea: 0.8,
                background: false,

                responsive: true,

                movable: true,
                zoomable: true,
                rotatable: true,
                scalable: true,

                aspectRatio: NaN,

                cropBoxMovable: true,
                cropBoxResizable: true,

                ready()
                {
                    console.log("Cropper ready");

                    const cropBtn =
                        document.getElementById("cropBtn");

                    const ratio =
                        document.getElementById("cropRatio");

                    if(cropBtn)
                    {
                        cropBtn.disabled = false;
                    }

                    if(ratio)
                    {
                        ratio.disabled = false;
                    }
                }
            }
        );
    };

    // Wait until image finishes loading
    if(image.complete && image.naturalWidth > 0)
    {
        initCropper();
    }
    else
    {
        image.onload = function()
        {
            image.onload = null;
            initCropper();
        };
    }
}












function cropImage()
{


    if(!window.cropper)
    {

        console.log(
            "Cropper not initialized"
        );

        return;

    }





    const cropBtn =
        document.getElementById("cropBtn");



    const downloadBtn =
        document.getElementById("downloadBtn");






    cropBtn.disabled =
        true;




    cropBtn.innerHTML =
    `
    <i class="fas fa-spinner fa-spin"></i>
    Processing...
    `;







    const canvas =
        window.cropper.getCroppedCanvas(
        {

            imageSmoothingEnabled:true,

            imageSmoothingQuality:"high"


        });






    if(!canvas)
    {

        console.log(
            "Crop canvas failed"
        );


        cropBtn.disabled =
            false;


        return;

    }







    canvas.toBlob(

        function(blob)
        {


            window.croppedFile =
                blob;





            downloadBtn.disabled =
                false;






            cropBtn.innerHTML =
            `
            <i class="fas fa-check"></i>
            Completed
            `;






            console.log(
                "Cropped file:",
                blob
            );








            setTimeout(() =>
            {

                cropBtn.innerHTML =
                    "Crop";


                cropBtn.disabled =
                    false;



            },1200);




        },


        "image/jpeg",


        0.95


    );


}