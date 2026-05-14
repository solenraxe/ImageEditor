let mainWindow = document.getElementById("main");

let canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");

let image = new Image();
image.src = "FlappyBird.png";
image.crossOrigin = "anonymous";
mainWindow.appendChild(image)

function changeImageColor(img, colorCodes) {
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i=0; i<data.length; i+=4) {
        const avgColor = Math.floor((data[i]+data[i+1]+data[i+2])/3)
        data[i] = colorCodes[0] * avgColor;
        data[i+1] = colorCodes[1] * avgColor;
        data[i+2] = colorCodes[2] * avgColor;
    }

    ctx.putImageData(imageData, 0, 0);
}

function addPadding(img, pX, pY) {
    const prevW = img.width;
    const prevH = img.height;
    
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

                newData[newIndex]     = oldData[oldIndex];     // R
                newData[newIndex + 1] = oldData[oldIndex + 1]; // G
                newData[newIndex + 2] = oldData[oldIndex + 2]; // B
                newData[newIndex + 3] = oldData[oldIndex + 3]; // A
            } else {
                newData[newIndex + 3] = 0; 
            }
        }
    }
    ctx.putImageData(newImgData, 0, 0);
}

addPadding(image, 20, 20)