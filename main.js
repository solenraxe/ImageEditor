let canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");

function changeImageColor(img, colorCodes) {
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i=0; i<data.length; i+=4) {
        data[i] = colorCodes[0];
        data[i+1] = colorCodes[1];
        data[i+2] = colorCodes[2];
    }

    ctx.putImageData(imageData, 0, 0);
}

function addPadding(img, pX, pY) {
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const prevW = canvas.width
    const prevH = canvas.height

    const width = canvas.width + pX*2
    const height = canvas.height + pY*2
    const newImgData = ctx.createImageData(img, width, height);
    const newData = newImgData.data;

    for (let i=0; i<newData.length; i+= 4) {
        const y = (i/4)/width;
        const x = i/4 - (y*4*width);
        if (x <= pX || x >= prevW+pX || y <= pY || y >= prevH+pY) {
            newData[i+3] = 255;
        } else {
            const oldInd = i + pY*width*4 + pX*4;
            newData[i] = data[oldInd];
            newData[i+1] = data[oldInd+1];
            newData[i+2] = data[oldInd+2];
            newData[i+3] = data[oldInd+3];
        }
    }

    ctx.putImageData(newImgData, 0, 0)
}