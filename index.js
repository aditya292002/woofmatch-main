import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";

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


app.listen(port, () => {
  console.log("Server started on port 3000");
});



