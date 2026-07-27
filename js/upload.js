console.log("upload.js loaded");

// Global selected file
window.selectedFile = null;

// Global processed files
window.compressedFile = null;
window.convertedFile = null;
window.croppedFile = null;
window.resizedFile = null;

// Update current tool state
window.updateToolButtons = function ()
{
    const processBtn = document.getElementById("processBtn");
    const convertBtn = document.getElementById("convertBtn");
    const cropBtn = document.getElementById("cropBtn");
    const resizeBtn = document.getElementById("resizeBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const controls = document.querySelectorAll(`
        #qualityRange,
        #format,
        #convertFormat,
        #cropRatio,
        #resizeWidth,
        #resizeHeight,
        #resizePercent,
        #keepAspect,
        #rotateLeftBtn,
        #rotateRightBtn,
        #flipHorizontalBtn,
        #flipVerticalBtn,
        #resetRotateBtn
    `);
    const hasFile = window.selectedFile !== null;

    // Process buttons
    if(processBtn)
    {
        processBtn.disabled = !hasFile;
    }
    if(convertBtn)
    {
        convertBtn.disabled = !hasFile;
    }
    if(cropBtn)
    {
        cropBtn.disabled = !hasFile;
    }
    if(resizeBtn)
    {
        resizeBtn.disabled = !hasFile;
    }

    // Controls
    controls.forEach(control =>
    {
        control.disabled = !hasFile;
    });

    // Download disabled until processing
    if(downloadBtn)
    {
        downloadBtn.disabled = true;
    }
};

// File chooser handling
document.addEventListener("click", function(e)
{
    const chooseBtn = e.target.closest("#chooseImageBtn");
    const uploadArea = e.target.closest("#uploadArea");

    if(chooseBtn)
    {
        e.stopPropagation();
        document.getElementById("imageInput").click();
        return;
    }
    if(uploadArea)
    {
        document.getElementById("imageInput").click();
    }
});

// File selected
document.addEventListener("change", function(e)
{
    if(e.target.id !== "imageInput")
    {
        return;
    }
    const file =
        e.target.files[0];

    if(!file)
    {
        return;
    }


    console.log("File selected:", file);


    // Store selected image

    window.selectedFile = file;


    // Reset processed files

    window.compressedFile = null;
    window.convertedFile = null;
    window.croppedFile = null;
    window.resizedFile = null;
    window.rotatedFile = null;

    // Show preview
showImagePreview(file,function()
{

    switch(window.currentTool)
    {

        case "crop":

            if(typeof window.enableCropEditor==="function")
            {
                enableCropEditor();
            }

            break;



        case "resize":

            if(typeof window.enableResizeEditor==="function")
            {
                enableResizeEditor();
            }

            break;



        case "rotate":

            if(typeof window.enableRotateEditor==="function")
            {
                enableRotateEditor();
            }

            break;

    }

});

    // Enable controls

    updateToolButtons();


    console.log(
        "Process disabled:",
        document.getElementById("processBtn")?.disabled
    );

    console.log(
        "Convert disabled:",
        document.getElementById("convertBtn")?.disabled
    );

    console.log(
        "Crop disabled:",
        document.getElementById("cropBtn")?.disabled
    );

    console.log(
        "Resize disabled:",
        document.getElementById("resizeBtn")?.disabled
    );

    console.log(
        "Download disabled:",
        document.getElementById("downloadBtn")?.disabled
    );

});