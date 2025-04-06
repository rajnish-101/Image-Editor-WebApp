let canvas = document.getElementById("imageCanvas");
let ctx = canvas.getContext("2d");
let img = new Image();

document.getElementById("upload").addEventListener("change", function(event) {
    let file = event.target.files[0];
    if (file) {
        let formData = new FormData();
        formData.append("image", file);

        fetch("upload.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let imgSrc = data.filePath;
                document.getElementById("originalImage").src = imgSrc;
                img.src = imgSrc;
                img.onload = function() {
                    canvas.width = img.width / 2;
                    canvas.height = img.height / 2;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    updateEditedImage();
                };
            } else {
                alert("Upload failed: " + data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
});


function applyFilters() {
    let brightness = document.getElementById("brightness").value;
    let contrast = document.getElementById("contrast").value;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    updateEditedImage();
}

document.getElementById("brightness").addEventListener("input", applyFilters);
document.getElementById("contrast").addEventListener("input", applyFilters);

function rotateImage() {
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = canvas.height;
    tempCanvas.height = canvas.width;
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate(Math.PI / 2);
    tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.drawImage(tempCanvas, 0, 0);
    updateEditedImage();
}

document.getElementById("rotate").addEventListener("click", rotateImage);

function flipImage() {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    updateEditedImage();
}

document.getElementById("flip").addEventListener("click", flipImage);

function compressImage() {
    let quality = 0.5; 
    let compressedImage = canvas.toDataURL("image/jpeg", quality);
    let imgElement = document.createElement("img");
    imgElement.src = compressedImage;
    document.getElementById("compressedImage").innerHTML = "";
    document.getElementById("compressedImage").appendChild(imgElement);
}

document.getElementById("compress").addEventListener("click", compressImage);

function updateEditedImage() {
    let editedImage = canvas.toDataURL("image/png");
    document.getElementById("editedImage").src = editedImage;
}

// Reset Button
document.getElementById("reset").addEventListener("click", function() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    updateEditedImage();
});

// Download Button
document.getElementById("download").addEventListener("click", function() {
    let link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});
