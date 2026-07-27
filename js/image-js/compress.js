function loadCompressUI()
{

    const controlsTitle =
        document.getElementById("controlsTitle");


    const controlsContent =
        document.getElementById("controlsContent");



    controlsTitle.textContent =
        "Compression Settings";



    controlsContent.innerHTML = `

        <div class="control-group">

            <label>
                Quality
            </label>


            <input
                type="range"
                id="qualityRange"
                min="10"
                max="100"
                value="80"
                disabled
            >


            <span id="qualityValue">
                80%
            </span>

        </div>



        <div class="control-group">

            <label>
                Output Format
            </label>


            <select
                id="format"
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
                id="processBtn"
                disabled>

                Compress

            </button>



            <button
                class="btn btn-primary"
                id="downloadBtn"
                disabled>

                Download

            </button>


        </div>

    `;




    const qualityRange =
        document.getElementById("qualityRange");


    const qualityValue =
        document.getElementById("qualityValue");


    const processBtn =
        document.getElementById("processBtn");



    qualityRange.addEventListener("input", function()
    {

        qualityValue.textContent =
            qualityRange.value + "%";

    });




    processBtn.addEventListener("click", function()
    {

        compressImage();

    });




    // Apply current file state

    updateToolButtons();

}







function compressImage()
{

    if(!window.selectedFile)
    {
        return;
    }



    const processBtn =
        document.getElementById("processBtn");


    const downloadBtn =
        document.getElementById("downloadBtn");



    const quality =
        document.getElementById("qualityRange").value / 100;



    const format =
        document.getElementById("format").value;




    processBtn.disabled = true;


    processBtn.innerHTML =
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


                if(
                    format === "image/png" &&
                    blob.size >= window.selectedFile.size
                )
                {
                    window.compressedFile =
                        window.selectedFile;
                }
                else
                {
                    window.compressedFile =
                        blob;
                }




                downloadBtn.disabled =
                    false;



                processBtn.innerHTML =
                    `<i class="fas fa-check"></i> Completed`;




                console.log(
                    "Original:",
                    window.selectedFile.size
                );


                console.log(
                    "Compressed:",
                    window.compressedFile.size
                );




                setTimeout(function()
                {

                    processBtn.innerHTML =
                        "Compress";


                    processBtn.disabled =
                        false;


                },1500);



            },

            format,

            quality

        );


    };




    img.src =
        URL.createObjectURL(
            window.selectedFile
        );

}