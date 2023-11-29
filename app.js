let uploadedImage;
// ------------------------------------------- splash screen code --------------------------------------------------
const splash = document.querySelector('.splash');

document.addEventListener('DOMContentLoaded', (e)=>{
    setTimeout(()=>{
        splash.classList.add('display-none');
    }, 2000);
})

// ------------------------------------------------Handling of upload image button-------------------------------------------------------------------


const selectImage = document.querySelector('.select-image');
const inputFile = document.querySelector('#file');
document.getElementById('file').addEventListener('change', handleImageUpload);

selectImage.addEventListener('click', function(){
    inputFile.click();
})

function handleImageUpload(event) {
    const input = event.target;

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            uploadedImage = reader.result;
            console.log(uploadedImage);
            // displayImage(uploadedImage);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// function displayImage(imageSrc) {
//     const container = document.getElementById('imgContainer');
//     let img = document.createElement('img');
//     img.src = imageSrc;
//     img.id = 'uploadedImage';
//     container.appendChild(img);
// }


// ---------------------------------------------------------Cropper js handling----------------------------------------------------------------------

let img_result = document.querySelector('.img-result'),
img_w = document.querySelector('.img-w'),
img_h = document.querySelector('.img-h'),
options = document.querySelector('.options'),
save = document.querySelector('.save'),
downloadImage = document.querySelector('.download');
cropped = document.querySelector('.cropped'),
popup = document.querySelector('.popup'),
cropper = '',
rotateImage = document.querySelector('.rotate')

inputFile.addEventListener('change', (e) => {
    popup.style.display = 'flex'
      // Remove the old image if it exists
      const oldImage = document.getElementById('uploadedImage');
      if (oldImage) {
          oldImage.parentNode.removeChild(oldImage);
      }

      // Destroy the old cropper instance if it exists
      if (cropper) {
          cropper.destroy();
      }
    if (e.target.files.length) {
          // start file reader
      const reader = new FileReader();
      reader.onload = (e)=> {
        if(e.target.result){        
                  const container = document.getElementById('imgContainer');
                  let img = document.createElement('img');
                  img.src = e.target.result
                  img.id = 'uploadedImage';
                  container.appendChild(img);
                  // show save btn and options
                  save.classList.remove('hide');
                  options.classList.remove('hide');
                  // init cropper
                  cropper = new Cropper(img,{
                     rotatable:true,
                  });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });


// save on click
save.addEventListener('click',(e)=>{
  e.preventDefault();
  // get result to data uri
  let imgSrc = cropper.getCroppedCanvas({
		width: img_w.value // input value
	}).toDataURL();
  // remove hide class of img
  cropped.classList.remove('hide');
  img_result.classList.remove('hide');
  popup.style.display = 'none'
	// show image cropped
  cropped.src = imgSrc;
});

// -------------------------------------------------rotate image----------------------------------------------------------
rotateImage.addEventListener('click',(e)=>{
  e.preventDefault();
  cropper.rotate(90);
});

// ---------------------------------------------Function to flip the image horizontally and back to original--------------------------------------------------------------------------
let isFlipped = false;

function flipImage() {
    if (isFlipped) {
        cropper.scaleX(1); // Set scaleX to 1 to revert to the original state
    } else {
        cropper.scaleX(-1); // Set scaleX to -1 to flip the image horizontally
    }
    // Toggle the state
    isFlipped = !isFlipped;
}

// -------------------------------------------------------Image overlay-------------------------------------------------------------------------------

function ImageOverlay(path) {
  
  // Call the reusable function for the first shape
  applyImageToShape(path);
};

function applyImageToShape(shapeImagePath) {
  var resultCanvas = document.getElementById('resultCanvas');
  var ctx = resultCanvas.getContext('2d');


  // Clear the canvas
  ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

  // Wait for images to load
  Promise.all([
      loadImage(shapeImagePath),
      loadImage(originalImage.src)
  ]).then(function (images) {
      // Draw the shape image on the canvas
      ctx.drawImage(images[0], 0, 0, resultCanvas.width, resultCanvas.height);

      // Use the shape as a mask
      ctx.globalCompositeOperation = 'source-in';

      // Calculate dimensions to fit the original image within the shape
      var scale = Math.min(resultCanvas.width / images[1].width, resultCanvas.height / images[1].height);
      var width = images[1].width * scale;
      var height = images[1].height * scale;

      // Draw the original image inside the shape with calculated dimensions
      ctx.drawImage(images[1], (resultCanvas.width - width) / 2, (resultCanvas.height - height) / 2, width, height);

      // Reset globalCompositeOperation to default
      ctx.globalCompositeOperation = 'source-over';
      var image = document.getElementById("resultCanvas").toDataURL("image/png");
      downloadImage.setAttribute("href", image);
      downloadImage.classList.remove('hide');

  });
}



  // Function to load an image and return a promise
  function loadImage(src) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
            resolve(img);
        };
        img.onerror = function () {
            reject(new Error('Could not load image: ' + src));
        };
        img.src = src;
    });
}

// ------------------------------------------------------Download Image---------------------------------------------------------------
downloadImage.addEventListener('click',function(){
  downloadImage.download = "image.png";
  downloadImage.click();
})
