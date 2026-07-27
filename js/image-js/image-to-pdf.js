console.log("image-to-pdf.js loaded");

/*=========================================
    GLOBAL STATE
=========================================*/

window.multiFiles = [];
window.generatedPdf = null;


/*=========================================
    LOAD UI
=========================================*/

function loadImageToPdfUI()
{
    window.currentTool = "image-to-pdf";

    window.multiFiles = [];
    window.generatedPdf = null;

    document.getElementById("multiTitle").textContent =
        "Image to PDF";

    document.getElementById("multiDescription").textContent =
        "Convert multiple images into one PDF.";

    document.getElementById("multiUploadTitle").textContent =
        "Select Images";

    document.getElementById("multiUploadDescription").textContent =
        "Choose up to 20 images.";

    buildImagePdfControls();

    resetImagePdfWorkspace();

    bindImagePdfEvents();
}


/*=========================================
    BUILD RIGHT PANEL
=========================================*/

function buildImagePdfControls()
{
    document.getElementById("multiControlsContent").innerHTML = `

        <div class="control-row">

            <div class="control-group">

                <label>PDF Size</label>

                <select id="pdfPageSize" disabled>

                    <option value="a4">A4</option>

                </select>

            </div>

            <div class="control-group">

                <label>Orientation</label>

                <select id="pdfOrientation" disabled>

                    <option value="auto">Auto</option>

                    <option value="portrait">Portrait</option>

                    <option value="landscape">Landscape</option>

                </select>

            </div>

        </div>

        <div class="control-row">

            <div class="control-group">

                <label>Margin</label>

                <select id="pdfMargin" disabled>

                    <option value="0">0 mm</option>

                    <option value="5">5 mm</option>

                    <option value="10">10 mm</option>

                    <option value="15">15 mm</option>

                </select>

            </div>

            <div class="control-group">

                <label>&nbsp;</label>

                <button
                    id="multiAddMoreBtn"
                    class="btn btn-secondary"
                    disabled>

                    <i class="fas fa-plus"></i>

                    Add More

                </button>

            </div>

        </div>

        <div class="multi-buttons">

            <button
                id="multiRemoveAllBtn"
                class="btn btn-danger"
                disabled>

                <i class="fas fa-trash"></i>

                Remove All

            </button>

            <button
                id="multiProcessBtn"
                class="btn btn-primary"
                disabled>

                <i class="fas fa-file-pdf"></i>

                Create PDF

            </button>

            <button
                id="multiDownloadBtn"
                class="btn btn-success"
                disabled>

                <i class="fas fa-download"></i>

                Download PDF

            </button>

        </div>

    `;
}


/*=========================================
    RESET WORKSPACE
=========================================*/

function resetImagePdfWorkspace()
{
    document.getElementById("multiUploadArea").style.display = "flex";

    document.getElementById("multiGrid").classList.add("hidden");

    document.getElementById("multiGrid").innerHTML = "";

    document.getElementById("multiFileInfo").classList.add("hidden");

    document.getElementById("multiInput").value = "";

    updateImagePdfButtons();
}
/*=========================================
    EVENTS
=========================================*/

function bindImagePdfEvents()
{
    const chooseBtn =
        document.getElementById("chooseFilesBtn");

    const input =
        document.getElementById("multiInput");

    chooseBtn.onclick = () => input.click();

    document.getElementById("multiUploadArea").onclick = function(e)
    {
        if(e.target.closest("button"))
        {
            return;
        }

        input.click();
    };

    input.onchange = handleImageSelection;

    document.getElementById("multiAddMoreBtn").onclick = function()
    {
        input.click();
    };

    document.getElementById("multiRemoveAllBtn").onclick =
        removeAllImages;

    document.getElementById("multiProcessBtn").onclick =
        createPdf;

    document.getElementById("multiDownloadBtn").onclick =
        downloadPdf;
}


/*=========================================
    IMAGE SELECTION
=========================================*/

function handleImageSelection(e)
{
    const files =
        Array.from(e.target.files);

    if(files.length === 0)
    {
        return;
    }

    files.forEach(file =>
    {
        if(window.multiFiles.length >= 20)
        {
            return;
        }

        if(!file.type.startsWith("image/"))
        {
            return;
        }

        window.multiFiles.push(file);
    });

    renderImageGrid();

    e.target.value = "";
}


/*=========================================
    UPDATE BUTTONS
=========================================*/

function updateImagePdfButtons()
{
    const hasFiles =
        window.multiFiles.length > 0;
    const isFull = 
        window.multiFiles.length >= 20;

    document.getElementById("pdfPageSize").disabled =
        !hasFiles;

    document.getElementById("pdfOrientation").disabled =
        !hasFiles;

    document.getElementById("pdfMargin").disabled =
        !hasFiles;

    document.getElementById("multiAddMoreBtn").disabled =
        !hasFiles || isFull;

    document.getElementById("multiRemoveAllBtn").disabled =
        !hasFiles;

    document.getElementById("multiProcessBtn").disabled =
        !hasFiles;

    document.getElementById("multiDownloadBtn").disabled =
        window.generatedPdf === null;
}
/*=========================================
    RENDER IMAGE GRID
=========================================*/

function renderImageGrid()
{
    const uploadArea =
        document.getElementById("multiUploadArea");

    const grid =
        document.getElementById("multiGrid");

    const info =
        document.getElementById("multiFileInfo");

    grid.innerHTML = "";

    if(window.multiFiles.length === 0)
    {
        uploadArea.style.display = "flex";

        grid.classList.add("hidden");

        info.classList.add("hidden");

        updateImagePdfButtons();

        return;
    }

    uploadArea.style.display = "none";

    grid.classList.remove("hidden");

    info.classList.remove("hidden");

    info.textContent =
        `${window.multiFiles.length} / 20 Files Selected`;



    window.multiFiles.forEach((file,index)=>
    {
        const reader =
            new FileReader();

        reader.onload = function(e)
        {
            const card =
                document.createElement("div");

            card.className =
                "multi-card";

            card.innerHTML = `

                <button
                    class="remove-file"
                    data-index="${index}"
                    type="button">

                    <i class="fas fa-times"></i>

                </button>

                <img
                    src="${e.target.result}"
                    alt="${file.name}"
                    draggable="false">

                <span>${file.name}</span>

            `;

            grid.appendChild(card);

            bindRemoveButtons();
        };

        reader.readAsDataURL(file);

    });



    if(window.multiFiles.length < 20)
    {
        const addCard =
            document.createElement("div");

        addCard.className =
            "add-more-card";

        addCard.innerHTML = `

            <i class="fas fa-plus"></i>

            <span>Add Images</span>

        `;

        addCard.onclick = function()
        {
            document
                .getElementById("multiInput")
                .click();
        };

        grid.appendChild(addCard);
    }

    updateImagePdfButtons();
}


/*=========================================
    REMOVE ONE IMAGE
=========================================*/

function bindRemoveButtons()
{
    document
        .querySelectorAll(".remove-file")
        .forEach(button =>
    {
        button.onclick = function(e)
        {
            e.stopPropagation();

            const index =
                Number(this.dataset.index);

            window.multiFiles.splice(index,1);

            renderImageGrid();
        };
    });
}


/*=========================================
    REMOVE ALL
=========================================*/

function removeAllImages()
{
    window.multiFiles = [];

    window.generatedPdf = null;

    document.getElementById("multiInput").value = "";

    renderImageGrid();
}
/*=========================================
    CREATE PDF
=========================================*/

async function createPdf()
{
    if(window.multiFiles.length === 0)
    {
        return;
    }

    const processBtn =
        document.getElementById("multiProcessBtn");

    processBtn.disabled = true;

    processBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Creating...
    `;

    const { jsPDF } = window.jspdf;

    const orientation =
        document.getElementById("pdfOrientation").value;

    const pageSize =
        document.getElementById("pdfPageSize").value;

    const margin =
        Number(document.getElementById("pdfMargin").value);

    let pdf = null;

    for(let i=0;i<window.multiFiles.length;i++)
    {
        const file =
            window.multiFiles[i];

        const imageData =
            await fileToDataURL(file);

        const image =
            await loadImage(imageData);

        let pageOrientation =
            orientation;

        if(pageOrientation === "auto")
        {
            pageOrientation =
                image.width > image.height
                ? "landscape"
                : "portrait";
        }

        if(i === 0)
        {
            pdf = new jsPDF({

                orientation : pageOrientation,

                unit : "mm",

                format : pageSize

            });
        }
        else
        {
            pdf.addPage(pageSize,pageOrientation);
        }

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        const maxWidth =
            pageWidth - margin * 2;

        const maxHeight =
            pageHeight - margin * 2;

        let drawWidth =
            maxWidth;

        let drawHeight =
            image.height * drawWidth / image.width;

        if(drawHeight > maxHeight)
        {
            drawHeight =
                maxHeight;

            drawWidth =
                image.width * drawHeight / image.height;
        }

        const x =
            (pageWidth - drawWidth) / 2;

        const y =
            (pageHeight - drawHeight) / 2;

        pdf.addImage(

            imageData,

            "JPEG",

            x,

            y,

            drawWidth,

            drawHeight,

            undefined,

            "NONE"

        );
    }

    window.generatedPdf = pdf;

    processBtn.disabled = false;

    processBtn.innerHTML = `
        <i class="fas fa-file-pdf"></i>
        Create PDF
    `;

    updateImagePdfButtons();
}


/*=========================================
    DOWNLOAD PDF
=========================================*/

function downloadPdf()
{
    if(!window.generatedPdf)
    {
        return;
    }

    window.generatedPdf.save("imageoc.pdf");
}


/*=========================================
    HELPERS
=========================================*/

function fileToDataURL(file)
{
    return new Promise(resolve =>
    {
        const reader =
            new FileReader();

        reader.onload =
            e => resolve(e.target.result);

        reader.readAsDataURL(file);
    });
}


function loadImage(src)
{
    return new Promise(resolve =>
    {
        const img =
            new Image();

        img.onload =
            () => resolve(img);

        img.src = src;
    });
}