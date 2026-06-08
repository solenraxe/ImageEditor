let renderZone = document.getElementById("render-zone")

let canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

let image = document.getElementById("source-img");
image.crossOrigin = "anonymous";
image.src = "Beest.png";

let format = "png";

let layers = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
let currentLayer = 0;

function download() {
    const dataURL = canvas.toDataURL("image/" + format);

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "image." + format;
    a.click();
}

let downloadAs = document.getElementById("download-as");
downloadAs.addEventListener("change", function() {
    format = downloadAs.value
})

let layerCont = document.getElementById("layer-display");
function createButton() {
    let newButton = document.createElement("button");
    const layerIndex = layers.length - 1;
    newButton.onclick = () => changeLayer(layerIndex);
    newButton.className = "button";
    newButton.textContent = "Layer " + (currentLayer+1);
    layerCont.appendChild(newButton);
}
createButton();

function addLayer() {
    layers[currentLayer] = ctx.getImageData(0, 0, canvas.width, canvas.height)

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    layers.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

    currentLayer = layers.length - 1;

    createButton();
}

function changeLayer(num) {
    layers[currentLayer] = ctx.getImageData(0, 0, canvas.width, canvas.height);

    currentLayer = num;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let imageData = layers[currentLayer];
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    canvas.style.width = Math.floor(250 * (imageData.width/imageData.height)) + "px";
    ctx.putImageData(layers[currentLayer], 0, 0);

    image.src = canvas.toDataURL("image/png");
    image.onload = function() {
        const targetHeight = 200;
        const dimRatio = targetHeight / image.naturalHeight;
    
        const targetWidth = Math.floor(image.naturalWidth * dimRatio);

        image.style.width = targetWidth + "px";
        image.style.height = targetHeight + "px";

        image.width = targetWidth;
        image.height = targetHeight;

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        canvas.style.width = Math.floor(250 * (image.naturalWidth/image.naturalHeight)) + "px";

        ctx.drawImage(image, 0, 0)
    }
}

function mergeLayers() {
    layers[currentLayer] = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    for (let imageData of layers) {
        const offscreen = document.createElement("canvas");
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        offscreen.getContext("2d").putImageData(imageData, 0, 0);
        const xPos = Math.round(canvas.width/2 - imageData.width/2);
        const yPos = Math.round(canvas.height/2 - imageData.height/2);
        tempCtx.drawImage(offscreen, xPos, yPos);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
    image.src = canvas.toDataURL("image/png");
    image.onload = function() {
        const targetHeight = 200;
        const dimRatio = targetHeight / image.naturalHeight;
    
        const targetWidth = Math.floor(image.naturalWidth * dimRatio);

        image.style.width = targetWidth + "px";
        image.style.height = targetHeight + "px";

        image.width = targetWidth;
        image.height = targetHeight;

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        canvas.style.width = Math.floor(250 * (image.naturalWidth/image.naturalHeight)) + "px";

        ctx.drawImage(image, 0, 0)
    }

    layers = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    currentLayer = 0;

    layerCont.innerHTML = "";

    createButton();
}

let modesElements = {
    "padding": [document.getElementById("p-width"), document.getElementById("p-height")],
    "filter": [document.getElementById("f-color")],
    "replace": [document.getElementById("r-color-1"), document.getElementById("r-color-2"), document.getElementById("r-threshold")],
    "merge": [document.getElementById("m-nbr")],
    "opacity": [document.getElementById("o-ratio")],
    "flip": [document.getElementById("f-direction")],
    "round": [document.getElementById("r-radius")],
    "blur": [document.getElementById("b-intensity")],
    "ratio": [document.getElementById("r-type"), document.getElementById("r-presets")],
    "background": [document.getElementById("b-type"), document.getElementById("b-threshold")],
    "text": [document.getElementById("t-text"), document.getElementById("t-size"), document.getElementById("t-font"), document.getElementById("t-color")],
    "transform": [document.getElementById("t-type")],
}

for (let mode in modesElements) {
    for (let elem of modesElements[mode]) {
        let inputElem = document.getElementById(elem.id + "-inp");
        inputElem.addEventListener("change", function() {
            processImage(image);
        })
    }
}

let pWidthINP = document.getElementById("p-width-inp");
let pHeightINP = document.getElementById("p-height-inp");

let fColorINP = document.getElementById("f-color-inp");

let rColor1INP = document.getElementById("r-color-1-inp");
let rColor2INP = document.getElementById("r-color-2-inp");
let rThresholdINP = document.getElementById("r-threshold-inp");

let mNbrINP = document.getElementById("m-nbr-inp");

let oRatioINP = document.getElementById("o-ratio-inp");

let fDirectionINP = document.getElementById("f-direction-inp");

let rRadiusINP = document.getElementById("r-radius-inp");

let bIntensityINP = document.getElementById("b-intensity-inp");

let rTypeINP = document.getElementById("r-type-inp");
let rPresetsINP = document.getElementById("r-presets-inp");

let bColorINP = document.getElementById("b-color-inp");
let bTypeINP = document.getElementById("b-type-inp");
bTypeINP.addEventListener("change", function() {
    if (bTypeINP.value === "change") {
        document.getElementById("b-color").style.display = "block";
    } else {
        document.getElementById("b-color").style.display = "none";
    }
})
let bThresholdINP = document.getElementById("b-threshold-inp");

let tTextINP = document.getElementById("t-text-inp");
let tSizeINP = document.getElementById("t-size-inp");
let tFontINP = document.getElementById("t-font-inp");
let tColorINP = document.getElementById("t-color-inp");

let tTypeINP = document.getElementById("t-type-inp");

let currentMode = "padding";
for (let elem of modesElements[currentMode]) {
    elem.style.display = "block";
}
function changeMode(mode) {
    for (let elem of modesElements[currentMode]) {
        elem.style.display = "none";
    }

    currentMode = mode;
    for (let elem of modesElements[currentMode]) {
        elem.style.display = "block";
    }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function checkColClose(color1, color2) {
    const threshold = rThresholdINP.value;
    const rDiff = Math.abs(color1[0] - color2[0]);
    const gDiff = Math.abs(color1[1] - color2[1]);
    const bDiff = Math.abs(color1[2] - color2[2]);

    return (rDiff < threshold) && (gDiff < threshold) && (bDiff < threshold);
}

function addPadding(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let pX = parseInt(pWidthINP.value);
    let pY = parseInt(pHeightINP.value);

    const prevW = img.naturalWidth;
    const prevH = img.naturalHeight;
    
    ctx.drawImage(img, 0, 0);
    const oldData = ctx.getImageData(0, 0, prevW, prevH).data;

    canvas.width = prevW + (pX * 2);
    canvas.height = prevH + (pY * 2);
    
    const newImgData = ctx.createImageData(canvas.width, canvas.height);
    const newData = newImgData.data;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const newIndex = (y * canvas.width + x) * 4;

            if (x >= pX && x < pX + prevW && y >= pY && y < pY + prevH) {
                const oldX = x - pX;
                const oldY = y - pY;
                const oldIndex = (oldY * prevW + oldX) * 4;

                newData[newIndex] = oldData[oldIndex];
                newData[newIndex + 1] = oldData[oldIndex + 1];
                newData[newIndex + 2] = oldData[oldIndex + 2];
                newData[newIndex + 3] = oldData[oldIndex + 3];
            } else {
                newData[newIndex + 3] = 0; 
            }
        }
    }
    ctx.putImageData(newImgData, 0, 0);
}

function changeImageColor(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    let rgb = hexToRgb(fColorINP.value)
    const colorCodes = [rgb.r/255, rgb.g/255, rgb.b/255]

    const prevW = img.naturalWidth;
    const prevH = img.naturalHeight;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, prevW, prevH);
    const data = imageData.data;

    for (let i=0; i<data.length; i+=4) {
        const avgColor = Math.floor((data[i]+data[i+1]+data[i+2])/3)

        data[i] = colorCodes[0] * avgColor;
        data[i+1] = colorCodes[1] * avgColor;
        data[i+2] = colorCodes[2] * avgColor;
    }

    ctx.putImageData(imageData, 0, 0);
}

function replaceImageColor(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    let rgb = hexToRgb(rColor2INP.value)
    const colorCodes = [rgb.r/255, rgb.g/255, rgb.b/255]

    let specRGB = hexToRgb(rColor1INP.value);
    let specColor = [specRGB.r, specRGB.g, specRGB.b];

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    const data = imageData.data;

    for (let i=0; i<data.length; i+=4) {
        if (!checkColClose([data[i], data[i+1], data[i+2]], specColor)) {
            continue;
        }
        const avgColor = Math.floor((data[i]+data[i+1]+data[i+2])/3)

        data[i] = colorCodes[0] * avgColor;
        data[i+1] = colorCodes[1] * avgColor;
        data[i+2] = colorCodes[2] * avgColor;
    }

    ctx.putImageData(imageData, 0, 0);
}

function mergeImages(img) {
    ctx.drawImage(img, Math.round(canvas.width/2 - img.naturalWidth/2), Math.round(canvas.height/2 - img.naturalHeight/2)); 
}

function changeImageOpacity(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ratio = parseFloat(oRatioINP.value);

    const prevW = img.naturalWidth;
    const prevH = img.naturalHeight;

    canvas.width = prevW;
    canvas.height = prevH;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, prevW, prevH);
    const data = imageData.data;

    for (let i=0; i<data.length; i+=4) {
        let originalAlpha = data[i+3];

        if (ratio >= 0) {
            data[i+3] = originalAlpha * (1 - ratio);
        } else {
            let absRatio = Math.abs(ratio);
            data[i+3] = originalAlpha + (255 - originalAlpha) * absRatio;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function flipImage(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const prevW = img.naturalWidth;
    const prevH = img.naturalHeight;

    canvas.width = prevW;
    canvas.height = prevH;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, prevW, prevH);
    const data = imageData.data;

    const flippedData = ctx.createImageData(canvas.width, canvas.height);
    const flippedDataArray = flippedData.data;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            let flippedX = x;
            let flippedY = y;

            if (fDirectionINP.value === "horizontal") {
                flippedX = canvas.width - 1 - x;
            } else if (fDirectionINP.value === "vertical") {
                flippedY = canvas.height - 1 - y;
            }

            const flippedIndex = (flippedY * canvas.width + flippedX) * 4;
            flippedDataArray[index] = data[flippedIndex];
            flippedDataArray[index + 1] = data[flippedIndex + 1];
            flippedDataArray[index + 2] = data[flippedIndex + 2];
            flippedDataArray[index + 3] = data[flippedIndex + 3];
        }
    }

    ctx.putImageData(flippedData, 0, 0);
}

function roundImageCorners(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const prevW = img.naturalWidth;
    const prevH = img.naturalHeight;

    canvas.width = prevW;
    canvas.height = prevH;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, prevW, prevH);
    const data = imageData.data;

    const newImgData = ctx.createImageData(canvas.width, canvas.height);
    const newData = newImgData.data;

    const radius = parseInt(rRadiusINP.value);
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;

            const distToLeft = x;
            const distToRight = canvas.width - 1 - x;
            const distToTop = y;
            const distToBottom = canvas.height - 1 - y;

            let xDistToCorner = Math.min(distToLeft, distToRight);
            let yDistToCorner = Math.min(distToTop, distToBottom);

            if (xDistToCorner < radius && yDistToCorner < radius) {
                const dx = radius - xDistToCorner;
                const dy = radius - yDistToCorner;
                const distToCorner = Math.sqrt(dx * dx + dy * dy);
                if (distToCorner >= radius) {
                    newData[index + 3] = 0;
                } else {
                    newData[index + 3] = data[index + 3];
                }
            } else {
                newData[index + 3] = data[index + 3];
            }

            newData[index] = data[index];
            newData[index + 1] = data[index + 1];
            newData[index + 2] = data[index + 2];
        }
    }
    ctx.putImageData(newImgData, 0, 0);
}

function blurImage(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const prevW = img.naturalWidth;
    const prevH = img.naturalHeight;

    canvas.width = prevW;
    canvas.height = prevH;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, prevW, prevH);
    const data = imageData.data;

    const blurredData = ctx.createImageData(canvas.width, canvas.height);
    const blurredDataArray = blurredData.data;

    const intensity = parseInt(bIntensityINP.value);
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;

            let rSum = 0;
            let gSum = 0;
            let bSum = 0;
            let count = 0;

            for (let j = -intensity; j <= intensity; j++) {
                for (let i = -intensity; i <= intensity; i++) {
                    const neighborX = x + i;
                    const neighborY = y + j;

                    if (neighborX >= 0 && neighborX < canvas.width && neighborY >= 0 && neighborY < canvas.height) {
                        const neighborIndex = (neighborY * canvas.width + neighborX) * 4;
                        if (data[neighborIndex + 3] === 0) {
                            continue;
                        }
                        rSum += data[neighborIndex];
                        gSum += data[neighborIndex + 1];
                        bSum += data[neighborIndex + 2];
                        count++;
                    }
                }
            }

            blurredDataArray[index]   = count > 0 ? rSum / count : 0;
            blurredDataArray[index+1] = count > 0 ? gSum / count : 0;
            blurredDataArray[index+2] = count > 0 ? bSum / count : 0;
            blurredDataArray[index + 3] = data[index + 3];
        }
    }
    ctx.putImageData(blurredData, 0, 0);
}

function changeImageRatio(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const prevW = img.naturalWidth;
    const prevH = img.naturalHeight;

    canvas.width = prevW;
    canvas.height = prevH;

    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, prevW, prevH)
    const data = imageData.data

    const ratioParts = rPresetsINP.value.split(":");
    const targetRatioW = parseFloat(ratioParts[0]);
    const targetRatioH = parseFloat(ratioParts[1]);
    const targetRatio = targetRatioW / targetRatioH;

    let ratioType = rTypeINP.value;

    let cropW = prevW;
    let cropH = prevW / targetRatio;

    if (cropH > prevH) {
        cropH = prevH;
        cropW = prevH * targetRatio;
    }

    let cropX = (prevW - cropW) / 2;
    let cropY = (prevH - cropH) / 2;

    if (ratioType === "crop") {
        canvas.width = cropW;
        canvas.height = cropH;

        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    } else if (ratioType == "fill") {
        const newW = prevW + cropX*2;
        const newH = prevH + cropY*2;

        canvas.width = newW;
        canvas.height = newH;
        const newImageData = ctx.createImageData(newW, newH)
        const newData = newImageData.data

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;

                if (x>=cropX && x<cropX+prevW && y>=cropY && y<cropY+prevH) {
                    const oldY = y - cropY;
                    const oldX = x - cropX;
                    const oldIndex = (oldY * prevW + oldX) * 4;

                    newData[index] = data[oldIndex];
                    newData[index+1] = data[oldIndex+1];
                    newData[index+2] = data[oldIndex+2];
                    newData[index+3] = data[oldIndex+3];
                } else {
                    newData[index] = 0;
                    newData[index+1] = 0;
                    newData[index+2] = 0;
                    newData[index+3] = 0;
                }
            }
        }
        ctx.putImageData(newImageData, 0, 0);
    }
}

function editBackground(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let threshold = bThresholdINP.value
    let editMode = bTypeINP.value

    const prevW = img.naturalWidth;
    const prevH = img.naturalHeight;
    
    canvas.width = prevW;
    canvas.height = prevH;

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, prevW, prevH);
    const data = imageData.data;

    let colors = {};
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;

            let r = Math.round(data[index]/threshold) * threshold;
            let g = Math.round(data[index + 1]/threshold) * threshold;
            let b = Math.round(data[index + 2]/threshold) * threshold;
            
            let colorKey = `${r},${g},${b}`;

            let distToCenter = Math.sqrt((prevW/2 - x)**2 + (prevH - y)**2);

            if (colors[colorKey]) {
                colors[colorKey] += 1 + distToCenter/threshold;
            } else {
                colors[colorKey] = 1 + distToCenter/threshold;
            }
        }
    }

    let backgroundColorKey = "";
    let currentMax = 0;
    const colorKeys = Object.keys(colors);
    
    for (let colorKey of colorKeys) {
        if (colors[colorKey] > currentMax) {
            currentMax = colors[colorKey];
            backgroundColorKey = colorKey;
        }
    }

    const backgroundImageData = ctx.createImageData(prevW, prevH);
    const backgroundData = backgroundImageData.data;
    const newImageData = ctx.createImageData(prevW, prevH);
    const newData = newImageData.data;
    
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;

            let r = Math.round(data[index]/threshold) * threshold;
            let g = Math.round(data[index + 1]/threshold) * threshold;
            let b = Math.round(data[index + 2]/threshold) * threshold;
            let colorKey = `${r},${g},${b}`;

            if (colorKey === backgroundColorKey) {
                backgroundData[index] = data[index];
                backgroundData[index+1] = data[index+1];
                backgroundData[index+2] = data[index+2];
                backgroundData[index+3] = data[index+3];
                if (editMode === "remove") {
                    newData[index+3] = 0;
                } else if (editMode === "change") {
                    let rgb = hexToRgb(bColorINP.value)
                    newData[index] = rgb.r
                    newData[index+1] = rgb.g
                    newData[index+2] = rgb.b
                }
            } else {
                newData[index] = data[index];
                newData[index+1] = data[index+1];
                newData[index+2] = data[index+2];
                newData[index+3] = data[index+3];
            }
        }
    }
    ctx.putImageData(newImageData, 0, 0);
    addLayer();
    ctx.putImageData(backgroundImageData, 0, 0);
}

function addText() {
    let text = tTextINP.value;
    let size = tSizeINP.value;
    let color = tColorINP.value;
    let font = tFontINP.value;

    ctx.font = size + "px " + font;
    ctx.fillStyle = color;

    const xPos = Math.round(canvas.width/2 - (size/4)*text.length + size/2);
    const yPos = Math.round(canvas.height/2 + size/2)
    ctx.fillText(text, xPos, yPos);
}

let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let offsetX = 0, offsetY = 0;

function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top)  * scaleY,
    };
}

function onMouseDown(e) {
    isDragging = true;
    const pos = getCanvasPos(e);
    dragStartX = pos.x - offsetX;
    dragStartY = pos.y - offsetY;
}

function onMouseMove(e) {
    if (!isDragging) return;
    const pos = getCanvasPos(e);
    offsetX = pos.x - dragStartX;
    offsetY = pos.y - dragStartY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, offsetX, offsetY);
}

function onMouseUp() {
    isDragging = false;
}

function onMouseLeave() {
    if (isDragging) {
        isDragging = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, offsetX, offsetY);
    }
}

function transformTool(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let threshold = bThresholdINP.value;
    let editMode = bTypeINP.value;

    const prevW = img.naturalWidth;
    const prevH = img.naturalHeight;

    canvas.width = prevW;
    canvas.height = prevH;

    ctx.drawImage(img, 0, 0);

    let transformType = tTypeINP.value;

    if (transformType === "move") {

        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mouseleave", onMouseLeave);

    } else if (transformType === "none") {

        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mouseleave", onMouseLeave);
        
    }
}

function processImage(img) {
    if (img.width === 0 || img.height === 0) { return; }

    if (currentMode === "padding") {
        addPadding(img);
    } else if (currentMode === "filter") {
        changeImageColor(img);
    } else if (currentMode === "replace") {
        replaceImageColor(img);
    } else if (currentMode === "merge") {
        mergeImages(img);
    } else if (currentMode === "opacity") {
        changeImageOpacity(img);
    } else if (currentMode === "flip") {
        flipImage(img);
    } else if (currentMode === "round") {
        roundImageCorners(img);
    } else if (currentMode === "blur") {
        blurImage(img);
    } else if (currentMode === "ratio") {
        changeImageRatio(img);
    } else if (currentMode === "background") {
        editBackground(img);
    } else if (currentMode === "text") {
        addText();
    } else if (currentMode === "transform") {
        transformTool(img);
    }
}

async function uploadImage(files) {
    let imgNbr = 1;
    if (currentMode === "merge") {
        imgNbr = parseInt(mNbrINP.value);
    }

    let maxH = 0;
    let maxW = 0;

    for (let i=0; i<Math.min(imgNbr, files.length); i++) {
        let file = files[i];

        const tempImg = new Image();
        tempImg.crossOrigin = "anonymous";
        tempImg.src = URL.createObjectURL(file);

        await new Promise((resolve) => {
            tempImg.onload = function() {
                if (tempImg.naturalHeight > maxH) { maxH = tempImg.naturalHeight; }
                if (tempImg.naturalWidth > maxW) { maxW = tempImg.naturalWidth; }
                
                loadedImages.push(tempImg);
                resolve();
            };
        });
    }

    canvas.width = maxW;
    canvas.height = maxH;

    canvas.style.width = Math.floor(250 * (maxW / maxH)) + "px";

    for (let imageN of loadedImages) {
        processImage(imageN);
    }

    if (loadedImages.length > 0) {
        const lastImg = loadedImages[0];
        const targetHeight = 200;
        const dimRatio = targetHeight / lastImg.naturalHeight;
        
        image.src = lastImg.src;
        image.style.height = targetHeight + "px";
        image.style.width = Math.floor(lastImg.naturalWidth * dimRatio) + "px";
    }

    if (loadedImages.length >= imgNbr) {
        loadedImages = [];
    }
}

let loadedImages = [];
let imgINP = document.getElementById("img-input");
imgINP.addEventListener("change", async function() {
    const files = imgINP.files;
    if (files.length === 0) {return;}

    await uploadImage(files);
})

const dropZone = document.getElementById("input-zone");
dropZone.addEventListener("drop", async function(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length === 0) {return;}

    await uploadImage(files);
})

window.addEventListener("drop", (e) => {
  if ([...e.dataTransfer.items].some((item) => item.kind === "file")) {
    e.preventDefault();
  }
});

dropZone.addEventListener("dragover", (e) => {
  const fileItems = [...e.dataTransfer.items].filter(
    (item) => item.kind === "file",
  );
  if (fileItems.length > 0) {
    e.preventDefault();
    if (fileItems.some((item) => item.type.startsWith("image/"))) {
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  }
});

window.addEventListener("dragover", (e) => {
  const fileItems = [...e.dataTransfer.items].filter(
    (item) => item.kind === "file",
  );
  if (fileItems.length > 0) {
    e.preventDefault();
    if (!dropZone.contains(e.target)) {
      e.dataTransfer.dropEffect = "none";
    }
  }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        processImage(image);
    } else if (event.key === "Tab") {
        event.preventDefault();
        reEdit();
    } else if (event.key === "Escape") {
        download();
    } else if (event.key === "Sup") {
        event.preventDefault();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

function reEdit() {
    image.src = canvas.toDataURL("image/png");
    image.onload = function() {
        loadedImages.push(image);

        const targetHeight = 200;
        const dimRatio = targetHeight / image.naturalHeight;
    
        const targetWidth = Math.floor(image.naturalWidth * dimRatio);

        image.style.width = targetWidth + "px";
        image.style.height = targetHeight + "px";

        image.width = targetWidth;
        image.height = targetHeight;

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        canvas.style.width = Math.floor(250 * (image.naturalWidth/image.naturalHeight)) + "px";

        processImage(image);
    }
}