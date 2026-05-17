let canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

let image = document.getElementById("source-img");
image.crossOrigin = "anonymous";
image.src = "FlappyBird.png";

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
}

let currentMode = "padding";
for (let elem in modesElements[currentMode]) {
    modesElements[currentMode][elem].style.display = "block";
}
function changeMode(mode) {
    for (let elem in modesElements[currentMode]) {
        modesElements[currentMode][elem].style.display = "none";
    }

    currentMode = mode;
    for (let elem in modesElements[currentMode]) {
        modesElements[currentMode][elem].style.display = "block";
    }
}

let pWidthINP = document.getElementById("p-width-inp");
let pHeightINP = document.getElementById("p-height-inp");
let fColorINP = document.getElementById("f-color-inp");
let rColor1INP = document.getElementById("r-color-1-inp");
let rColor2INP = document.getElementById("r-color-2-inp");
let rThresholdINP = document.getElementById("r-threshold-inp");
let mNbrINP = document.getElementById("m-nbr-inp");

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, Math.round(canvas.width/2 - img.naturalWidth/2), Math.round(canvas.height/2 - img.naturalHeight/2)); 
}

function processImage(img) {
    if (currentMode === "padding") {
        addPadding(img);
    } else if (currentMode === "filter") {
        changeImageColor(img);
    } else if (currentMode === "replace") {
        replaceImageColor(img);
    } else if (currentMode === "merge") {
        mergeImages(img);
    }
}

let imgINP = document.getElementById("img-input");
imgINP.addEventListener("change", async function() {
    const files = imgINP.files;
    if (files.length === 0) {return;}

    let imgNbr = 1;
    if (currentMode === "merge") {
        imgNbr = parseInt(mNbrINP.value);
    }

    const loadedImages = [];
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
})