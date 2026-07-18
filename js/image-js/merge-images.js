console.log("merge-images.js loaded");

/*=========================================
    GLOBAL STATE
=========================================*/
window.mergeFiles = [];
window.mergedCanvas = null;

/*=========================================
    LOAD UI
=========================================*/
function loadMergeImagesUI() {
    window.currentTool = "merge-images";
    window.mergeFiles = [];
    window.mergedCanvas = null;

    document.getElementById("multiTitle").textContent = "Merge Images Side by Side / Grid";
    document.getElementById("multiDescription").textContent = "Combine 2, 3, or 4 images into a clean side-by-side or grid layout.";
    document.getElementById("multiUploadTitle").textContent = "Select 2 to 4 Images";
    document.getElementById("multiUploadDescription").textContent = "Upload between 2 and 4 images to merge.";

    buildMergeControls();
    resetMergeWorkspace();
    bindMergeEvents();
}

/*=========================================
    BUILD RIGHT PANEL
=========================================*/
function buildMergeControls() {
    document.getElementById("multiControlsContent").innerHTML = `
        <div class="control-row">
            <div class="control-group">
                <label>Output Format</label>
                <select id="mergeFormat" disabled>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/png">PNG</option>
                </select>
            </div>
            <div class="control-group">
                <label>&nbsp;</label>
                <button id="multiAddMoreBtn" class="btn btn-secondary" disabled>
                    <i class="fas fa-plus"></i> Add Images
                </button>
            </div>
        </div>
        <div class="multi-buttons">
            <button id="multiRemoveAllBtn" class="btn btn-danger" disabled>
                <i class="fas fa-trash"></i> Remove All
            </button>
            <button id="multiProcessBtn" class="btn btn-primary" disabled>
                <i class="fas fa-layer-group"></i> Merge Images
            </button>
            <button id="multiDownloadBtn" class="btn btn-success" disabled>
                <i class="fas fa-download"></i> Download Image
            </button>
        </div>
    `;
}

/*=========================================
    RESET WORKSPACE
=========================================*/
function resetMergeWorkspace() {
    document.getElementById("multiUploadArea").style.display = "flex";
    document.getElementById("multiGrid").classList.add("hidden");
    document.getElementById("multiGrid").innerHTML = "";
    document.getElementById("multiFileInfo").classList.add("hidden");
    document.getElementById("multiInput").value = "";
    updateMergeButtons();
}

/*=========================================
    EVENTS
=========================================*/
function bindMergeEvents() {
    const chooseBtn = document.getElementById("chooseFilesBtn");
    const input = document.getElementById("multiInput");

    chooseBtn.onclick = () => input.click();
    document.getElementById("multiUploadArea").onclick = function(e) {
        if (e.target.closest("button")) return;
        input.click();
    };

    input.onchange = handleMergeSelection;
    document.getElementById("multiAddMoreBtn").onclick = () => input.click();
    document.getElementById("multiRemoveAllBtn").onclick = removeAllMergeImages;
    document.getElementById("multiProcessBtn").onclick = processMergeImages;
    document.getElementById("multiDownloadBtn").onclick = downloadMergedImage;
}

/*=========================================
    IMAGE SELECTION
=========================================*/
function handleMergeSelection(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
        if (window.mergeFiles.length >= 4) return; // Enforce maximum 4 images
        if (!file.type.startsWith("image/")) return;
        window.mergeFiles.push(file);
    });

    renderMergeGrid();
    e.target.value = "";
}

/*=========================================
    UPDATE BUTTONS
=========================================*/
function updateMergeButtons() {
    const fileCount = window.mergeFiles.length;
    const isFull = fileCount === 4;
    const isValid = fileCount >= 2 && fileCount <= 4;

    document.getElementById("mergeFormat").disabled = fileCount === 0;
    document.getElementById("multiAddMoreBtn").disabled = isFull || fileCount === 0;
    document.getElementById("multiRemoveAllBtn").disabled = fileCount === 0;
    
    // Process button is enabled when 2, 3, or 4 images are loaded
    document.getElementById("multiProcessBtn").disabled = !isValid;
    document.getElementById("multiDownloadBtn").disabled = window.mergedCanvas === null;
}

/*=========================================
    RENDER IMAGE GRID
=========================================*/
function renderMergeGrid() {
    const uploadArea = document.getElementById("multiUploadArea");
    const grid = document.getElementById("multiGrid");
    const info = document.getElementById("multiFileInfo");

    grid.innerHTML = "";

    if (window.mergeFiles.length === 0) {
        uploadArea.style.display = "flex";
        grid.classList.add("hidden");
        info.classList.add("hidden");
        updateMergeButtons();
        return;
    }

    uploadArea.style.display = "none";
    grid.classList.remove("hidden");
    info.classList.remove("hidden");
    
    info.textContent = `${window.mergeFiles.length} / 4 Files Selected ${window.mergeFiles.length < 2 ? '(Need at least 2 images)' : ''}`;

    window.mergeFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const card = document.createElement("div");
            card.className = "multi-card";
            card.innerHTML = `
                <button class="remove-file" data-index="${index}" type="button">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${e.target.result}" alt="${file.name}" draggable="false">
                <span>${file.name}</span>
            `;
            grid.appendChild(card);
            bindMergeRemoveButtons();
        };
        reader.readAsDataURL(file);
    });

    if (window.mergeFiles.length < 4) {
        const addCard = document.createElement("div");
        addCard.className = "add-more-card";
        addCard.innerHTML = `
            <i class="fas fa-plus"></i>
            <span>Add Image</span>
        `;
        addCard.onclick = () => document.getElementById("multiInput").click();
        grid.appendChild(addCard);
    }

    updateMergeButtons();
}

/*=========================================
    REMOVE ONE IMAGE
=========================================*/
function bindMergeRemoveButtons() {
    document.querySelectorAll(".remove-file").forEach(button => {
        button.onclick = function(e) {
            e.stopPropagation();
            const index = Number(this.dataset.index);
            window.mergeFiles.splice(index, 1);
            window.mergedCanvas = null; // Invalidate current merge layout
            renderMergeGrid();
        };
    });
}

/*=========================================
    REMOVE ALL
=========================================*/
function removeAllMergeImages() {
    window.mergeFiles = [];
    window.mergedCanvas = null;
    document.getElementById("multiInput").value = "";
    renderMergeGrid();
}

/*=========================================
    PROCESS / MERGE SIDE-BY-SIDE
=========================================*/
/*=========================================
    PROCESS / MERGE DYNAMIC GRID LAYOUT
=========================================*/
async function processMergeImages() {
    const fileCount = window.mergeFiles.length;
    if (fileCount < 2 || fileCount > 4) return;

    const processBtn = document.getElementById("multiProcessBtn");
    processBtn.disabled = true;
    processBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Merging...`;

    // --- CONFIGURABLE LAYOUT PARAMETERS ---
    const padding = 20;      // Outer edge padding on all 4 sides
    const gap = 15;          // Space between images horizontally and vertically
    const backgroundColor = "#ffffff"; 
    // --------------------------------------

    try {
        // Load all selected images dynamically
        const loadedImages = [];
        for (let file of window.mergeFiles) {
            const imgData = await fileToDataURL(file);
            const img = await loadImage(imgData);
            loadedImages.push(img);
        }

        // 1. Arrange images into structural layout rows
        let rows = [];
        if (fileCount === 2) {
            rows = [
                [loadedImages[0], loadedImages[1]] // Row 1: 2 images side-by-side
            ];
        } else if (fileCount === 3) {
            rows = [
                [loadedImages[0], loadedImages[1]], // Row 1: 2 images
                [loadedImages[2]]                   // Row 2: 1 image (centered)
            ];
        } else if (fileCount === 4) {
            rows = [
                [loadedImages[0], loadedImages[1]], // Row 1: 2 images
                [loadedImages[2], loadedImages[3]]  // Row 2: 2 images
            ];
        }

        // 2. Find the minimum height across all images to serve as the height base
        let targetHeight = Math.min(...loadedImages.map(img => img.height));
        
        // Cap individual row height at 800px so multi-row layouts remain under 1MB easily
        if (targetHeight > 800) {
            targetHeight = 800;
        }

        // 3. Scale all images to targetHeight and measure row widths
        const rowWidths = [];
        const rowImagesData = rows.map(row => {
            const scaledRow = row.map(img => {
                const scale = targetHeight / img.height;
                const width = img.width * scale;
                return { img, width };
            });

            // Calculate total width of this specific row (images + gaps)
            const totalImgWidth = scaledRow.reduce((sum, item) => sum + item.width, 0);
            const totalRowWidth = totalImgWidth + (gap * (row.length - 1));
            rowWidths.push(totalRowWidth);

            return scaledRow;
        });

        // 4. Calculate final Canvas dimensions
        const maxRowWidth = Math.max(...rowWidths);
        const totalWidth = maxRowWidth + (padding * 2);
        const totalHeight = (rows.length * targetHeight) + (padding * 2) + ((rows.length - 1) * gap);

        // 5. Generate and prepare the Canvas
        const canvas = document.createElement("canvas");
        canvas.width = totalWidth;
        canvas.height = totalHeight;
        const ctx = canvas.getContext("2d");

        // Fill background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // 6. Draw each row (shorter rows will automatically be horizontally centered)
        let currentY = padding;
        for (let r = 0; r < rowImagesData.length; r++) {
            const row = rowImagesData[r];
            const currentRowWidth = rowWidths[r];
            
            // Calculate starting X to center the row perfectly inside the canvas
            let currentX = padding + (maxRowWidth - currentRowWidth) / 2;
            
            for (let item of row) {
                ctx.drawImage(item.img, currentX, currentY, item.width, targetHeight);
                currentX += item.width + gap; // Shift right for next image in row
            }
            
            currentY += targetHeight + gap; // Shift down for next row
        }

        window.mergedCanvas = canvas;
    } catch (error) {
        console.error("Error merging grid layout:", error);
    }

    processBtn.disabled = false;
    processBtn.innerHTML = `<i class="fas fa-layer-group"></i> Merge Images`;
    updateMergeButtons();
}

/*=========================================
    DOWNLOAD IMAGE
=========================================*/
/*=========================================
    DOWNLOAD IMAGE
=========================================*/
function downloadMergedImage() {
    if (!window.mergedCanvas) return;

    const format = document.getElementById("mergeFormat").value;
    const oneMegabyte = 1024 * 1024;
    
    let finalCanvas = window.mergedCanvas;
    let quality = 0.9;
    let dataUrl = finalCanvas.toDataURL(format, quality);
    let sizeInBytes = (dataUrl.length - 814) * 0.75;

    // 1. If JPEG and too large, try reducing quality first (PNG ignores quality parameter)
    if (format === "image/jpeg" && sizeInBytes > oneMegabyte) {
        while (sizeInBytes > oneMegabyte && quality > 0.4) {
            quality -= 0.1;
            dataUrl = finalCanvas.toDataURL(format, quality);
            sizeInBytes = (dataUrl.length - 814) * 0.75;
        }
    }

    // 2. If STILL over 1MB (or if it's a PNG that is too large), physically scale down the dimensions
    let scale = 0.9;
    while (sizeInBytes > oneMegabyte && scale > 0.2) {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = window.mergedCanvas.width * scale;
        tempCanvas.height = window.mergedCanvas.height * scale;
        
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(window.mergedCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
        
        finalCanvas = tempCanvas;
        dataUrl = finalCanvas.toDataURL(format, format === "image/jpeg" ? quality : undefined);
        sizeInBytes = (dataUrl.length - 814) * 0.75;
        
        scale -= 0.1; // Shrink dimensions by 10% more if it's still too big
    }

    const extension = format === "image/png" ? ".png" : ".jpg";
    
    const link = document.createElement("a");
    link.download = "merged-side-by-side" + extension;
    link.href = dataUrl;
    link.click();
}

/*=========================================
    HELPERS
=========================================*/
function fileToDataURL(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

function loadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}