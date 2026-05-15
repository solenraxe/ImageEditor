let mainWindow = document.getElementById("main");

let canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

let image = document.getElementById("source-img");
image.src = "FlappyBird.png";
image.crossOrigin = "anonymous";

let colorINP = document.getElementById("input-1")

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

        changeImageColor(image)
    };
})

colorINP.addEventListener("change", function() {
    changeImageColor(image)
})

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function changeImageColor(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let rgb = hexToRgb(colorINP.value)
    const colorCodes = [rgb.r/255, rgb.g/255, rgb.b/255]

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    const data = imageData.data;

    for (let i=0; i<data.length; i+=4) {
        const avgColor = Math.floor((data[i]+data[i+1]+data[i+2])/3)
        data[i] = colorCodes[0] * avgColor;
        data[i+1] = colorCodes[1] * avgColor;
        data[i+2] = colorCodes[2] * avgColor;
    }

    ctx.putImageData(imageData, 0, 0);
}

function download() {
  const dataURL = canvas.toDataURL("image/png");

  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "image.png";
  a.click();
}