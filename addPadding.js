let mainWindow = document.getElementById("main");

let canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

let image = document.getElementById("source-img");
image.src = "FlappyBird.png";
image.crossOrigin = "anonymous";

let widthINP = document.getElementById("input-1");
let heightINP = document.getElementById("input-2");

let imgINP = document.getElementById("img-input");
imgINP.addEventListener("change", function() {
    const files = imgINP.files;
    if (files.length === 0) {return;}

    const newIMG = files[0];

    image.src = URL.createObjectURL(newIMG);

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

        addPadding(image);
    };
})

widthINP.addEventListener("change", function() {
    addPadding(image);
})

heightINP.addEventListener("change", function() {
    addPadding(image);
})

function addPadding(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let pX = parseInt(widthINP.value);
    let pY = parseInt(heightINP.value);

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

function download() {
  const dataURL = canvas.toDataURL("image/png");

  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "image.png";
  a.click();
}