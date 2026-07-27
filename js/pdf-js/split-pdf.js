console.log("split-pdf.js loaded");

/*=========================================
    GLOBAL STATE
=========================================*/
window.splitPdfFile = null;
window.splitPdfOutputs = []; // Array of { blob, name }
const MAX_PAGES_PREVIEW = 50; // Performance guardrail for massive documents

/*=========================================
    LOAD UI
=========================================*/
function loadSplitPdfUI() {
    window.currentTool = "split-pdf";
    window.splitPdfFile = null;
    window.splitPdfOutputs = [];

    document.getElementById("multiTitle").textContent = "Split PDF File";
    document.getElementById("multiDescription").textContent = "Extract individual pages or split your PDF document into separate files.";
    document.getElementById("multiUploadTitle").textContent = "Select a PDF File";
    document.getElementById("multiUploadDescription").textContent = "Upload a multi-page PDF document to configure extraction.";

    buildSplitControls();
    resetSplitWorkspace();
    bindSplitEvents();
}

/*=========================================
    BUILD RIGHT PANEL
=========================================*/
function buildSplitControls() {
    document.getElementById("multiControlsContent").innerHTML = `
        <div class="control-group" style="margin-bottom: 15px;">
            <label>Split Method</label>
            <select id="splitMethod" class="form-control" disabled>
                <option value="range">Extract Page Range</option>
                <option value="all">Split Every Page</option>
            </select>
        </div>
        <div id="splitRangeGroup" class="control-row">
            <div class="control-group" style="flex: 1;">
                <label>From Page</label>
                <input type="number" id="splitFromPage" min="1" value="1" disabled>
            </div>
            <div class="control-group" style="flex: 1;">
                <label>To Page</label>
                <input type="number" id="splitToPage" min="1" value="1" disabled>
            </div>
        </div>
        <div class="multi-buttons" style="margin-top: 20px;">
            <button id="multiRemoveAllBtn" class="btn btn-danger" disabled>
                <i class="fas fa-trash"></i> Remove File
            </button>
            <button id="multiProcessBtn" class="btn btn-primary" disabled>
                <i class="fas fa-cut"></i> Split PDF
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
function resetSplitWorkspace() {
    document.getElementById("multiUploadArea").style.display = "flex";
    document.getElementById("multiGrid").classList.add("hidden");
    document.getElementById("multiGrid").innerHTML = "";
    document.getElementById("multiFileInfo").classList.add("hidden");
    document.getElementById("multiInput").value = "";
    updateSplitButtons();
}

/*=========================================
    EVENTS
=========================================*/
function bindSplitEvents() {
    const chooseBtn = document.getElementById("chooseFilesBtn");
    const input = document.getElementById("multiInput");

    // Force single selection layout for splitting operations
    input.removeAttribute("multiple"); 
    input.setAttribute("accept", "application/pdf");

    chooseBtn.onclick = () => input.click();
    document.getElementById("multiUploadArea").onclick = function(e) {
        if (e.target.closest("button")) return;
        input.click();
    };

    input.onchange = handleSplitSelection;
    document.getElementById("multiRemoveAllBtn").onclick = removeSplitFile;
    document.getElementById("multiProcessBtn").onclick = processSplitPdf;
    document.getElementById("multiDownloadBtn").onclick = downloadSplitResults;
}

/*=========================================
    PDF SELECTION & PARSING
=========================================*/
async function handleSplitSelection(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        e.target.value = "";
        return;
    }

    window.splitPdfFile = file;
    window.splitPdfOutputs = []; // Reset any generated assets
    e.target.value = "";

    await renderSplitGrid();
}

/*=========================================
    UPDATE BUTTONS
=========================================*/
function updateSplitButtons() {
    const hasFile = window.splitPdfFile !== null;
    const hasOutputs = window.splitPdfOutputs.length > 0;

    const methodSelect = document.getElementById("splitMethod");
    const fromInput = document.getElementById("splitFromPage");
    const toInput = document.getElementById("splitToPage");
    
    // Explicitly disable or enable all configurations based on file presence
    if (methodSelect) methodSelect.disabled = !hasFile;
    if (fromInput) fromInput.disabled = !hasFile;
    if (toInput) toInput.disabled = !hasFile;

    document.getElementById("multiRemoveAllBtn").disabled = !hasFile;
    document.getElementById("multiProcessBtn").disabled = !hasFile;
    document.getElementById("multiDownloadBtn").disabled = !hasOutputs;
}

/*=========================================
    RENDER SPLIT GRID (PAGES PREVIEW)
=========================================*/
async function renderSplitGrid() {
    const uploadArea = document.getElementById("multiUploadArea");
    const grid = document.getElementById("multiGrid");
    const info = document.getElementById("multiFileInfo");

    grid.innerHTML = "";

    if (!window.splitPdfFile) {
        uploadArea.style.display = "flex";
        grid.classList.add("hidden");
        info.classList.add("hidden");
        updateSplitButtons();
        return;
    }

    uploadArea.style.display = "none";
    grid.classList.remove("hidden");
    info.classList.remove("hidden");

    info.textContent = `Analyzing document structure...`;

    try {
        const fileArrayBuffer = await fileToArrayBuffer(window.splitPdfFile);
        const srcPdf = await PDFLib.PDFDocument.load(fileArrayBuffer);
        const totalPages = srcPdf.getPageCount();

        info.textContent = `File: ${window.splitPdfFile.name} (${totalPages} Pages)`;

        // Configure input elements dynamic thresholds
        const splitMethod = document.getElementById("splitMethod");
        const rangeGroup = document.getElementById("splitRangeGroup");
        const fromInput = document.getElementById("splitFromPage");
        const toInput = document.getElementById("splitToPage");

        fromInput.max = totalPages;
        toInput.max = totalPages;
        toInput.value = totalPages;

        splitMethod.onchange = () => {
            if (splitMethod.value === "range") {
                rangeGroup.classList.remove("hidden");
            } else {
                rangeGroup.classList.add("hidden");
            }
            updateSplitButtons();
        };

        // Render page block structures into visual workspace
        const previewLimit = Math.min(totalPages, MAX_PAGES_PREVIEW);
        for (let i = 0; i < previewLimit; i++) {
            const card = document.createElement("div");
            card.className = "multi-card pdf-card";
            card.innerHTML = `
                <div class="pdf-icon-wrapper" style="font-size: 2.5rem; color: #17a2b8; padding: 10px 0; text-align: center;">
                    <i class="fas fa-file-alt"></i>
                </div>
                <span style="display: block; text-align: center; font-weight: bold; margin-bottom: 4px;">Page ${i + 1}</span>
            `;
            grid.appendChild(card);
        }

        if (totalPages > MAX_PAGES_PREVIEW) {
            const truncatedCard = document.createElement("div");
            truncatedCard.className = "multi-card pdf-card architecture-break";
            truncatedCard.style.justifyContent = "center";
            truncatedCard.innerHTML = `<span style="color: #6c757d;">+ ${totalPages - MAX_PAGES_PREVIEW} more pages</span>`;
            grid.appendChild(truncatedCard);
        }

    } catch (err) {
        console.error("Error reading PDF pages:", err);
        info.textContent = "Failed to evaluate structural page elements.";
        removeSplitFile();
        return;
    }

    updateSplitButtons();
}

/*=========================================
    REMOVE FILE
=========================================*/
function removeSplitFile() {
    window.splitPdfFile = null;
    window.splitPdfOutputs = [];
    document.getElementById("multiInput").value = "";
    resetSplitWorkspace();
}

/*=========================================
    PROCESS / SPLIT PDF COMPILATION
=========================================*/
async function processSplitPdf() {
    if (!window.splitPdfFile) return;

    const processBtn = document.getElementById("multiProcessBtn");
    const splitMethod = document.getElementById("splitMethod").value;
    processBtn.disabled = true;
    processBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Splitting...`;

    try {
        const fileArrayBuffer = await fileToArrayBuffer(window.splitPdfFile);
        const srcPdf = await PDFLib.PDFDocument.load(fileArrayBuffer);
        const totalPages = srcPdf.getPageCount();
        const baseName = window.splitPdfFile.name.replace(/\.[^/.]+$/, "");
        
        const targetOutputs = [];

        if (splitMethod === "range") {
            // Extract a clean sub-range sequence exclusively
            let fromPage = parseInt(document.getElementById("splitFromPage").value, 10) - 1;
            let toPage = parseInt(document.getElementById("splitToPage").value, 10) - 1;

            if (isNaN(fromPage) || fromPage < 0) fromPage = 0;
            if (isNaN(toPage) || toPage >= totalPages) toPage = totalPages - 1;
            if (fromPage > toPage) {
                const temp = fromPage;
                fromPage = toPage;
                toPage = temp;
            }

            const targetIndices = [];
            for (let i = fromPage; i <= toPage; i++) {
                targetIndices.push(i);
            }

            const subDocument = await PDFLib.PDFDocument.create();
            const copiedPages = await subDocument.copyPages(srcPdf, targetIndices);
            copiedPages.forEach(page => subDocument.addPage(page));

            const bytes = await subDocument.save();
            const blob = new Blob([bytes], { type: "application/pdf" });

            targetOutputs.push({
                blob: blob,
                name: `${baseName}_range_${fromPage + 1}-${toPage + 1}.pdf`
            });
        } else {
            // "all" split option selected: Generate standalone files for every single page
            for (let i = 0; i < totalPages; i++) {
                const singleDocument = await PDFLib.PDFDocument.create();
                const [copiedPage] = await singleDocument.copyPages(srcPdf, [i]);
                singleDocument.addPage(copiedPage);

                const bytes = await singleDocument.save();
                const blob = new Blob([bytes], { type: "application/pdf" });

                targetOutputs.push({
                    blob: blob,
                    name: `${baseName}_page_${i + 1}.pdf`
                });
            }
        }

        window.splitPdfOutputs = targetOutputs;

        // UI Success Indicator without alerts
        processBtn.className = "btn btn-success";
        processBtn.innerHTML = `<i class="fas fa-check"></i> Done!`;
        
        setTimeout(() => {
            processBtn.className = "btn btn-primary";
            processBtn.innerHTML = `<i class="fas fa-cut"></i> Split PDF`;
            updateSplitButtons();
        }, 2000);

    } catch (error) {
        console.error("Error executing layout splitting engine:", error);
        processBtn.disabled = false;
        processBtn.innerHTML = `<i class="fas fa-cut"></i> Split PDF`;
        updateSplitButtons();
    }
}

/*=========================================
    DOWNLOAD OUTPUTS
=========================================*/
function downloadSplitResults() {
    if (window.splitPdfOutputs.length === 0) return;

    // Single document output optimization strategy
    if (window.splitPdfOutputs.length === 1) {
        const item = window.splitPdfOutputs[0];
        const dataUrl = URL.createObjectURL(item.blob);
        const link = document.createElement("a");
        link.download = item.name;
        link.href = dataUrl;
        link.click();
        setTimeout(() => URL.revokeObjectURL(dataUrl), 100);
    } else {
        // Fallback for batch arrays (uses JSZip if available globally)
        if (typeof JSZip !== "undefined") {
            const zip = new JSZip();
            window.splitPdfOutputs.forEach(item => {
                zip.file(item.name, item.blob);
            });
            zip.generateAsync({ type: "blob" }).then(content => {
                const dataUrl = URL.createObjectURL(content);
                const link = document.createElement("a");
                link.download = `${window.splitPdfFile.name.replace(/\.[^/.]+$/, "")}_split.zip`;
                link.href = dataUrl;
                link.click();
                setTimeout(() => URL.revokeObjectURL(dataUrl), 100);
            });
        } else {
            // Alternative: Trigger multiple separate down-stream saves sequentially 
            window.splitPdfOutputs.forEach((item, index) => {
                setTimeout(() => {
                    const dataUrl = URL.createObjectURL(item.blob);
                    const link = document.createElement("a");
                    link.download = item.name;
                    link.href = dataUrl;
                    link.click();
                    setTimeout(() => URL.revokeObjectURL(dataUrl), 100);
                }, index * 250);
            });
        }
    }
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