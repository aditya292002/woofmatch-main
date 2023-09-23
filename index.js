import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";


// import requirements for blog section 
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/identify-breed", (req, res) => {
  res.render("identify-breed.ejs");
});



// app.post("/identify-breed", upload.single("dogImage"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }
//     console.log("Done1");

//     const filename = `./uploads/${req.file.filename}`;
//     console.log(filename);

//     const response = await identifyBreed(filename);
//     console.log(response);

//     if (response && response.length > 0) {
//       // Render the result page with image and response data
//       const data = {
//         imageFileName: filename, // Pass the path to the uploaded image
//         response: response,      // Pass the breed identification results
//       };
//       res.render("identify-breed.ejs", data);
//     } else {
//       // Handle cases where no valid response is available
//       res.status(500).json({ error: "Breed identification failed." });
//     }
//   } catch (err) {
//     console.error("Some error occurred:", err);
//     // Handle and respond to the error
//     res.status(500).json({ error: "Internal server error." });
//   }
// });


app.get("/price", (req, res) => {
  res.render("price.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about-us.ejs");
});



////////////////////////////////////////////////////////////////////////////////////////

// blog section 

const API_URL = "http://localhost:4000";

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to render the main page
app.get("/blog", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    console.log(response);
    res.render("blog_files/index.ejs", { posts: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the edit page
app.get("/blog/new", (req, res) => {
  res.render("blog_files/modify.ejs", { heading: "New Post", submit: "Create Post" });
});

app.get("/blog/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    console.log(response.data);
    res.render("blog_files/modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post: response.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Create a new post
app.post("/blog/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    console.log(response.data);
    res.redirect("/blog");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Partially update a post
app.post("/blog/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/blog");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/blog/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/posts/${req.params.id}`);
    res.redirect("/blog");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});



