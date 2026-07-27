console.log("merge-pdf.js loaded");

/*=========================================
    GLOBAL STATE
=========================================*/
window.mergePdfFiles = [];
window.mergedPdfBlob = null;
const MAX_PDF_FILES = 4;
/*=========================================
    LOAD UI
=========================================*/
function loadMergePdfUI() {
    window.currentTool = "merge-pdf";
    window.mergePdfFiles = [];
    window.mergedPdfBlob = null;

    document.getElementById("multiTitle").textContent = "Merge PDF Files";
    document.getElementById("multiDescription").textContent = "Combine multiple PDF documents into a single organized file.";
    document.getElementById("multiUploadTitle").textContent = "Select 2 or More PDFs";
    document.getElementById("multiUploadDescription").textContent = "Upload your PDF files to arrange and merge them.";

    buildPdfControls();
    resetPdfWorkspace();
    bindPdfEvents();
}

/*=========================================
    BUILD RIGHT PANEL
=========================================*/
function buildPdfControls() {
    document.getElementById("multiControlsContent").innerHTML = `
        <div class="control-row">
            <div class="control-group">
                <label>Output Format</label>
                <select id="pdfFormat" disabled>
                    <option value="application/pdf">PDF Document (.pdf)</option>
                </select>
            </div>
            <div class="control-group">
                <label>&nbsp;</label>
                <button id="multiAddMoreBtn" class="btn btn-secondary" disabled>
                    <i class="fas fa-plus"></i> Add PDFs
                </button>
            </div>
        </div>
        <div class="multi-buttons">
            <button id="multiRemoveAllBtn" class="btn btn-danger" disabled>
                <i class="fas fa-trash"></i> Remove All
            </button>
            <button id="multiProcessBtn" class="btn btn-primary" disabled>
                <i class="fas fa-file-pdf"></i> Merge PDFs
            </button>
            <button id="multiDownloadBtn" class="btn btn-success" disabled>
                <i class="fas fa-download"></i> Download PDF
            </button>
        </div>
    `;
}

/*=========================================
    RESET WORKSPACE
=========================================*/
function resetPdfWorkspace() {
    document.getElementById("multiUploadArea").style.display = "flex";
    document.getElementById("multiGrid").classList.add("hidden");
    document.getElementById("multiGrid").innerHTML = "";
    document.getElementById("multiFileInfo").classList.add("hidden");
    document.getElementById("multiInput").value = "";
    updatePdfButtons();
}

/*=========================================
    EVENTS
=========================================*/
function bindPdfEvents() {
    const chooseBtn = document.getElementById("chooseFilesBtn");
    const input = document.getElementById("multiInput");

    // Temporarily point input to accept only PDFs for this tool
    input.removeAttribute("multiple"); 
    input.setAttribute("multiple", "true");
    input.setAttribute("accept", "application/pdf");

    chooseBtn.onclick = () => input.click();
    document.getElementById("multiUploadArea").onclick = function(e) {
        if (e.target.closest("button")) return;
        input.click();
    };

    input.onchange = handlePdfSelection;
    document.getElementById("multiAddMoreBtn").onclick = () => input.click();
    document.getElementById("multiRemoveAllBtn").onclick = removeAllPdfFiles;
    document.getElementById("multiProcessBtn").onclick = processMergePdfs;
    document.getElementById("multiDownloadBtn").onclick = downloadMergedPdf;
}

/*=========================================
    PDF SELECTION
=========================================*/
/*=========================================
    PDF SELECTION
=========================================*/
function handlePdfSelection(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    for (let file of files) {
        // Enforce the 4-file maximum limit
        if (window.mergePdfFiles.length >= MAX_PDF_FILES) {
            alert(`You can only select up to ${MAX_PDF_FILES} PDF files.`);
            break; 
        }
        
        if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) continue;
        window.mergePdfFiles.push(file);
    }

    renderPdfGrid();
    e.target.value = "";
}

/*=========================================
    UPDATE BUTTONS
=========================================*/
/*=========================================
    UPDATE BUTTONS
=========================================*/
function updatePdfButtons() {
    const fileCount = window.mergePdfFiles.length;
    const isValid = fileCount >= 2;

    document.getElementById("pdfFormat").disabled = fileCount === 0;
    
    // Disable "Add PDFs" if no files are loaded, OR if the limit (4) is reached
    document.getElementById("multiAddMoreBtn").disabled = fileCount === 0 || fileCount >= MAX_PDF_FILES;
    
    document.getElementById("multiRemoveAllBtn").disabled = fileCount === 0;
    
    document.getElementById("multiProcessBtn").disabled = !isValid;
    document.getElementById("multiDownloadBtn").disabled = window.mergedPdfBlob === null;
}

/*=========================================
    RENDER PDF GRID
=========================================*/
/*=========================================
    RENDER PDF GRID
=========================================*/
function renderPdfGrid() {
    const uploadArea = document.getElementById("multiUploadArea");
    const grid = document.getElementById("multiGrid");
    const info = document.getElementById("multiFileInfo");

    grid.innerHTML = "";

    if (window.mergePdfFiles.length === 0) {
        uploadArea.style.display = "flex";
        grid.classList.add("hidden");
        info.classList.add("hidden");
        updatePdfButtons();
        return;
    }

    uploadArea.style.display = "none";
    grid.classList.remove("hidden");
    info.classList.remove("hidden");
    
    info.textContent = `${window.mergePdfFiles.length} Files Selected ${window.mergePdfFiles.length < 2 ? '(Need at least 2 PDFs)' : ''}`;

    window.mergePdfFiles.forEach((file, index) => {
        const card = document.createElement("div");
        card.className = "multi-card pdf-card"; 
        card.innerHTML = `
            <button class="remove-file" data-index="${index}" type="button">
                <i class="fas fa-times"></i>
            </button>
            <div class="pdf-icon-wrapper" style="font-size: 3rem; color: #dc3545; padding: 15px 0; text-align: center;">
                <i class="fas fa-file-pdf"></i>
            </div>
            <span style="display: block; text-align: center; padding: 0 5px; word-break: break-all;">${file.name}</span>
        `;
        grid.appendChild(card);
    });

    bindPdfRemoveButtons();

    // ONLY render the "Add PDF" card if the total files are less than MAX_PDF_FILES (4)
    if (window.mergePdfFiles.length < MAX_PDF_FILES) {
        const addCard = document.createElement("div");
        addCard.className = "add-more-card";
        addCard.innerHTML = `
            <i class="fas fa-plus"></i>
            <span>Add PDF</span>
        `;
        addCard.onclick = () => document.getElementById("multiInput").click();
        grid.appendChild(addCard);
    }

    updatePdfButtons();
}

/*=========================================
    REMOVE ONE PDF
=========================================*/
function bindPdfRemoveButtons() {
    document.querySelectorAll(".remove-file").forEach(button => {
        button.onclick = function(e) {
            e.stopPropagation();
            const index = Number(this.dataset.index);
            window.mergePdfFiles.splice(index, 1);
            window.mergedPdfBlob = null; // Invalidate current merged cache
            renderPdfGrid();
        };
    });
}

/*=========================================
    REMOVE ALL
=========================================*/
function removeAllPdfFiles() {
    window.mergePdfFiles = [];
    window.mergedPdfBlob = null;
    document.getElementById("multiInput").value = "";
    renderPdfGrid();
}

/*=========================================
    PROCESS / MERGE PDF COMPILATION
=========================================*/
async function processMergePdfs() {
    const fileCount = window.mergePdfFiles.length;
    if (fileCount < 2) return;

    const processBtn = document.getElementById("multiProcessBtn");
    processBtn.disabled = true;
    processBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Merging...`;

    try {
        // Initialize an empty PDF Document using pdf-lib
        const mergedPdf = await PDFLib.PDFDocument.create();

        for (let file of window.mergePdfFiles) {
            const fileArrayBuffer = await fileToArrayBuffer(file);
            
            // Load the uploaded document safely
            const srcPdf = await PDFLib.PDFDocument.load(fileArrayBuffer);
            
            // Extract indices of all pages in the document
            const pageIndices = srcPdf.getPageIndices();
            
            // Copy pages from source document into context of merged document
            const copiedPages = await mergedPdf.copyPages(srcPdf, pageIndices);
            
            // Append each copied page sequentially into output
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        // Serialize PDF document structure into a Uint8Array bytes sequence
        const mergedPdfBytes = await mergedPdf.save();
        
        // Convert array buffer into a target raw binary Blob
        window.mergedPdfBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });

    } catch (error) {
        console.error("Error merging PDF documents:", error);
    }

    processBtn.disabled = false;
    processBtn.innerHTML = `<i class="fas fa-file-pdf"></i> Merge PDFs`;
    updatePdfButtons();
}

/*=========================================
    DOWNLOAD PDF
=========================================*/
function downloadMergedPdf() {
    if (!window.mergedPdfBlob) return;

    const dataUrl = URL.createObjectURL(window.mergedPdfBlob);
    
    const link = document.createElement("a");
    link.download = "merged-document.pdf";
    link.href = dataUrl;
    link.click();

    // Clean memory reference footprints safely 
    setTimeout(() => URL.revokeObjectURL(dataUrl), 100);
}

/*=========================================
    HELPERS
=========================================*/
function fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = err => reject(err);
        reader.readAsArrayBuffer(file);
    });
}