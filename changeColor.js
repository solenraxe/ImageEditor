let mainWindow = document.getElementById("main");
let choiceZone = document.getElementById("choice-zone");

let canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d", {willReadFrequently: true});

let image = document.getElementById("source-img");
image.src = "FlappyBird.png";
image.crossOrigin = "anonymous";

let colorINP = document.getElementById("input-1")

let specINP = document.getElementById("input-2")
specINP.addEventListener("change", function() {
    if (specINP.checked) {
        let newDiv = document.createElement("div");
        newDiv.classList.add("choice-input");
        newDiv.innerHTML = `
            <label for="input-2">Specific Color:</label>
            <input type="color" id="input-3" class="color-input">
        `;
        choiceZone.insertBefore(newDiv, choiceZone.children[2]);
    } else {
        choiceZone.removeChild(choiceZone.children[2]);
    }
})

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

function checkColClose(color1, color2) {
    const threshold = 50;
    const rDiff = Math.abs(color1[0] - color2[0]);
    const gDiff = Math.abs(color1[1] - color2[1]);
    const bDiff = Math.abs(color1[2] - color2[2]);

    return (rDiff < threshold) && (gDiff < threshold) && (bDiff < threshold);
}

function changeImageColor(img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let rgb = hexToRgb(colorINP.value)
    const colorCodes = [rgb.r/255, rgb.g/255, rgb.b/255]

    let specColor = null;
    if (specINP.checked) {
        const specColorINP = document.getElementById("input-3");
        let specRGB = hexToRgb(specColorINP.value);
        specColor = [specRGB.r, specRGB.g, specRGB.b];
    }

    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
    const data = imageData.data;

    for (let i=0; i<data.length; i+=4) {
        if (specColor) {
            if (!checkColClose([data[i], data[i+1], data[i+2]], specColor)) {
                continue;
            }
        }

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