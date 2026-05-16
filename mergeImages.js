let mainWindow = document.getElementById("main");

let canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

let image = document.getElementById("source-img");
image.src = "FlappyBird.png";
image.crossOrigin = "anonymous";

let imgINP = document.getElementById("img-input");
imgINP.addEventListener("change", async function() {
    const files = imgINP.files;
    if (files.length === 0) { return; }

    let maxH = 0;
    let maxW = 0;
    
    const loadedImages = [];

    for (let file of files) {
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

    for (let img of loadedImages) {
        ctx.drawImage(img, Math.round(maxW/2 - img.naturalWidth/2), Math.round(maxH/2 - img.naturalHeight/2)); 
    }

    if (loadedImages.length > 0) {
        const lastImg = loadedImages[loadedImages.length - 1];
        const targetHeight = 200;
        const dimRatio = targetHeight / lastImg.naturalHeight;
        
        image.src = lastImg.src;
        image.style.height = targetHeight + "px";
        image.style.width = Math.floor(lastImg.naturalWidth * dimRatio) + "px";
    }
});

function download() {
  const dataURL = canvas.toDataURL("image/png");

  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "image.png";
  a.click();
}