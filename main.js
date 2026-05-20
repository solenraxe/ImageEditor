let canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

let image = document.getElementById("source-img");
image.crossOrigin = "anonymous";
image.src = "Beest.png";

function download() {
    const dataURL = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = "image.png";
    a.click();
}

let modesElements = {
    "padding": [document.getElementById("p-width"), document.getElementById("p-height")],
    "filter": [document.getElementById("f-color")],
    "replace": [document.getElementById("r-color-1"), document.getElementById("r-color-2"), document.getElementById("r-threshold")],
    "merge": [document.getElementById("m-nbr")],
    "opacity": [document.getElementById("o-ratio")],
    "flip": [document.getElementById("f-direction")],
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
let currentMode = "padding";
for (let elem of modesElements[currentMode]) {
    elem.style.display = "block";
    let inputElem = document.getElementById(elem.id + "-inp");
}
function changeMode(mode) {
    for (let elem of modesElements[currentMode]) {
        elem.style.display = "none";
        let inputElem = document.getElementById(elem.id + "-inp");
    }

    currentMode = mode;
    for (let elem of modesElements[currentMode]) {
        elem.style.display = "block";
        let inputElem = document.getElementById(elem.id + "-inp");
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
    }
}

let loadedImages = [];
let imgINP = document.getElementById("img-input");
imgINP.addEventListener("change", async function() {
    const files = imgINP.files;
    if (files.length === 0) {return;}

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
})

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