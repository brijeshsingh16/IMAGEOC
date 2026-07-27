function loadConvertUI()
{

    const controlsTitle =
        document.getElementById("controlsTitle");


    const controlsContent =
        document.getElementById("controlsContent");



    controlsTitle.textContent =
        "Conversion Settings";



    controlsContent.innerHTML = `


        <div class="control-group">

            <label>
                Convert To
            </label>


            <select
                id="convertFormat"
                disabled>


                <option value="image/jpeg">
                    JPG
                </option>


                <option value="image/png">
                    PNG
                </option>


                <option value="image/webp">
                    WEBP
                </option>


            </select>


        </div>



        <div class="control-buttons">


            <button
                class="btn btn-secondary"
                id="convertBtn"
                disabled>

                Convert

            </button>



            <button
                class="btn btn-primary"
                id="downloadBtn"
                disabled>

                Download

            </button>


        </div>


    `;




    const convertBtn =
        document.getElementById("convertBtn");




    convertBtn.addEventListener("click", function()
    {

        convertImage();

    });




    // Apply current state

    updateToolButtons();

}







function convertImage()
{

    if(!window.selectedFile)
    {
        return;
    }




    const convertBtn =
        document.getElementById("convertBtn");


    const downloadBtn =
        document.getElementById("downloadBtn");



    const formatValue =
        document.getElementById("convertFormat").value;




    convertBtn.disabled =
        true;



    convertBtn.innerHTML =
        `<i class="fas fa-spinner fa-spin"></i> Processing...`;





    const img =
        new Image();





    img.onload = function()
    {

        const canvas =
            document.createElement("canvas");



        const ctx =
            canvas.getContext("2d");



        canvas.width =
            img.width;


        canvas.height =
            img.height;




        ctx.drawImage(
            img,
            0,
            0
        );




        canvas.toBlob(

            function(blob)
            {

                window.convertedFile =
                    blob;



                downloadBtn.disabled =
                    false;




                convertBtn.innerHTML =
                    `<i class="fas fa-check"></i> Completed`;





                console.log(
                    "Converted:",
                    blob
                );




                setTimeout(function()
                {

                    convertBtn.innerHTML =
                        "Convert";


                    convertBtn.disabled =
                        false;


                },1500);



            },


            formatValue,


            0.95

        );


    };





    img.src =
        URL.createObjectURL(
            window.selectedFile
        );

}