// // Function to handle the click event of the "Identify" button
// document.getElementById("identify-button").addEventListener("click", async () => {
//   try {
//     const imageInput = document.getElementById("image-input");
//     const imageFile = imageInput.files[0];

//     if (!imageFile) {
//       alert("Please select an image file.");
//       return;
//     }

//     // Create a FileReader object to read the selected image as a data URL
//     const reader = new FileReader();

//     // Define a callback function to execute when the image is loaded
//     reader.onload = function(event) {
//       const imageData = event.target.result; // Get the data URL of the image

//       // Display the selected image on the screen
//       const imagePreview = document.getElementById("image-preview");
//       imagePreview.innerHTML = `<img src="${imageData}" alt="Selected Image" width="200">`;
//     };

//     // Read the file as data URL
//     reader.readAsDataURL(imageFile);
//   } catch (error) {
//     console.error("Error identifying the breed:", error.message);
//   }
// });




// Function to send the image data to the API and identify the breed
async function identifyDogBreed(imageData) {
  try {
    const apiUrl = "https://mikachou-dog-breed-identification.hf.space/api/predict";
    const payload = {
      data: [imageData],
    };

    const response = await axios.post(apiUrl, payload);
    const prediction = response.data.data[0];

    const primaryLabel = prediction.label;
    const confidences = prediction.confidences;

    console.log("Primary Breed Label:", primaryLabel);
    console.log("Confidences:");
    confidences.forEach((labelConfidence) => {
      console.log(labelConfidence.label, "-", labelConfidence.confidence);
    });

    return primaryLabel;
  } catch (error) {
    console.error("Error identifying the breed:", error.message);
    throw error;
  }
}

// Function to handle the click event of the "Identify" button
document.getElementById("identify-button").addEventListener("click", async () => {
  try {
    const imageInput = document.getElementById("image-input");
    const imageFile = imageInput.files[0];

    if (!imageFile) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const imageData = reader.result; // No need to extract base64 data

      const breed = await identifyDogBreed(imageData);
      console.log("Done");

      // Display the selected image on the screen
      const imagePreview = document.getElementById("image-preview");
      imagePreview.innerHTML = `<img src="${imageData}" alt="Selected Image" width="200">`;

      // Display the breed identification result
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = `<p>The identified dog breed is: ${breed}</p>`;
    };

    // Read the file as data URL
    reader.readAsDataURL(imageFile);
  } catch (error) {
    console.error("Error identifying the breed:", error.message);
  }
});


