import fs from 'fs';
import fetch from 'node-fetch'; // Make sure you have the 'node-fetch' package installed.

export async function identifyBreed(filename) {
  try {
    // Read the image file
    const data = fs.readFileSync(filename);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/wesleyacheng/dog-breeds-multiclass-image-classification-with-vit",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "image/jpeg", // Set the content type to match your image format
        },
        body: data, // Send the image data in the body
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}



/*
    <!-- Breed Identification Form -->
    <form
      id="breed-identification-form"
      enctype="multipart/form-data"
      action="/identify-breed"
      method="POST"
    >
      <input type="file" id="image-input" accept="image/*" name="dogImage" />
      <button type="submit" id="identify-button" class="btn btn-dark btn-lg">
        Identify
      </button>
    </form>


    <!-- Result Display -->
    <% if (locals.response) { %>
    <div id="result" class="mt-4">
      <h3 class="mb-3">Top 5 Dog Breeds:</h3>
      <ul class="list-group">
        <% locals.response.forEach((breed, index) => { %>
        <li class="list-group-item">
          <%= breed.label %> (Accuracy: <%= (breed.score * 100).toFixed(2) %>%)
        </li>
        <% }); %>
      </ul>
    </div>
    <% } %>
*/