document.addEventListener("DOMContentLoaded", () =>
{

    const workspace =
        document.getElementById("workspace");


    const title =
        document.getElementById("workspace-title");


    const description =
        document.getElementById("workspace-description");


    const closeBtn =
        document.getElementById("closeWorkspace");





    document
    .querySelectorAll(".tool-card")
    .forEach(card =>
    {

        card.addEventListener("click", function(e)
{
    e.preventDefault();

    const tool =
        card.dataset.tool;

    console.log("Switching to:", tool);

    /*==============================
        MULTI FILE TOOLS
    ==============================*/

    if(
        tool === "image-to-pdf" ||
        tool === "merge-images" ||
        tool === "merge-pdf" ||
        tool === "split-pdf" ||
        tool === "compress-pdf" ||
        tool === "rotate-pdf" ||
        tool === "rearrange-pdf" ||
        tool === "remove-pdf"
    )
    {
        document
            .getElementById("workspace")
            .classList.add("hidden");

        document
            .getElementById("multiWorkspace")
            .classList.remove("hidden");

        document.getElementById("multiTitle").textContent =
            card.querySelector("h4").textContent;

        document.getElementById("multiDescription").textContent =
            card.querySelector("p").textContent;

        loadTool(tool);

        document
            .getElementById("multiWorkspace")
            .scrollIntoView({
                behavior:"smooth",
                block:"start"
            });

        return;
    }

    /*==============================
        SINGLE IMAGE TOOLS
    ==============================*/

    document
        .getElementById("multiWorkspace")
        .classList.add("hidden");

    workspace.classList.remove("hidden");

    title.textContent =
        card.querySelector("h4").textContent;

    description.textContent =
        card.querySelector("p").textContent;

    window.selectedFile = null;
    window.compressedFile = null;
    window.convertedFile = null;

    const imageInput =
        document.getElementById("imageInput");

    if(imageInput)
    {
        imageInput.value = "";
    }

    const previewBox =
        document.querySelector(".image-preview");

    const previewImage =
        document.getElementById("previewImage");

    if(previewBox)
    {
        previewBox.classList.add("hidden");
    }

    if(previewImage)
    {
        previewImage.onload = null;
        previewImage.src = "";
    }

    const uploadArea =
        document.getElementById("uploadArea");

    if(uploadArea)
    {
        uploadArea.style.display = "flex";
    }

    loadTool(tool);

    workspace.scrollIntoView({
        behavior:"smooth",
        block:"start"
    });

});

    });

    closeBtn.addEventListener("click", () =>
    {

        workspace.classList.add("hidden");


    });

    const multiClose =
    document.getElementById("closeMultiWorkspace");

if(multiClose)
{
    multiClose.addEventListener("click", () =>
    {
        document
            .getElementById("multiWorkspace")
            .classList.add("hidden");
    });
}

});


function loadTool(tool)
{
    console.log("Switching to:", tool);

    // Destroy previous cropper
    if(window.cropper)
    {
        window.cropper.destroy();
        window.cropper = null;
    }

    // Remove any leftover Cropper DOM
    document.querySelectorAll(".cropper-container").forEach(container =>
    {
        container.remove();
    });

    // Reset preview image events
    const previewImage = document.getElementById("previewImage");

    if(previewImage)
    {
        previewImage.onload = null;
    }

    window.currentTool = tool;

    switch(tool)
    {

        case "compress":

            loadCompressUI();

            break;


        case "convert":

            loadConvertUI();

            break;


        case "crop":
             window.currentTool = "crop";
            loadCropUI();

            break;


        case "resize":

            loadResizeUI();

            break;


        case "rotate":

            loadRotateUI();

            break;


        case "image-to-pdf":

            loadImageToPdfUI();

            break;


        case "merge-images":

            loadMergeImagesUI();

            break;


        case "merge-pdf":

            loadMergePdfUI();

            break;


        case "split-pdf":

            loadSplitPdfUI();

            break;


        case "compress-pdf":

            loadCompressPdfUI();

            break;


        case "rotate-pdf":

            loadRotatePdfUI();

            break;


        case "rearrange-pdf":

            loadRearrangePdfUI();

            break;


        case "remove-pdf":

            loadRemovePdfUI();

            break;


        case "pdf-to-image":

            loadPdfToImageUI();

            break;

    }

}