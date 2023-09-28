

js code to show prominent code in github to js
import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/identify-breed", (req, res) => {
  res.render("identify-breed.ejs");
});

app.post("/identify-breed", upload.single("dogImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("Done1");

    const filename = `./uploads/${req.file.filename}`;
    console.log(filename);

    const response = await identifyBreed(filename);
    console.log(response);

    if (response && response.length > 0) {
      // Render the result page with image and response data
      const data = {
        imageFileName: filename, // Pass the path to the uploaded image
        response: response,      // Pass the breed identification results
      };
      res.render("identify-breed.ejs", data);
    } else {
      // Handle cases where no valid response is available
      res.status(500).json({ error: "Breed identification failed." });
    }
  } catch (err) {
    console.error("Some error occurred:", err);
    // Handle and respond to the error
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get("/price", (req, res) => {
  res.render("price.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about-us.ejs");
});



////////////////////////////////////////////////////////////////////////////////////////

// blog section

// Connect to MongoDB
async function makeConnection() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error occurred while making connection:", error);
  }
}
makeConnection();

// Define a schema
const blogSchema = mongoose.Schema({
  Author: {
    type: String,
    required: [true, "Please enter an author name"],
  },
  Content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// Defining the model
const Blog = mongoose.model("Blog", blogSchema);

// Default blogs
const defaultBlogs = [
  {
    Author: "Prakash Jha",
    Content: "Are you a dog lover? If so, you're in the right place! In this blog post, we'll embark on a journey into the fascinating world of canine companions. Dogs have been our loyal friends for thousands of years, and there's so much to discover about them.",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya Keshari",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
];

// Insert default blogs into the database blogDB
async function insertDefaultBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(defaultBlogs);
      console.log("Successfully inserted default blogs to DB");
    }
  } catch (error) {
    console.error("Insert Default blogs Error:", error);
  }
}
insertDefaultBlogs();

app.get("/blog", async (req, res) => {
  try {
    const response = await Blog.find({});
    res.render("blog_files/index.ejs", { allBlogs: response });
  } catch (error) {
    console.error("Error occurred while getting all documents:", error);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.get("/compose", (req, res) => {
  res.render("blog_files/compose.ejs");
});

app.post("/newBlog", async (req, res) => {
  try {
    const author = req.body.blog_author;
    const content = req.body.blog_content;

    // Create a new instance of the Blog model with the data
    const blog = new Blog({
      Author: author,
      Content: content,
      Date: Date.now(),
    });

    // Save the new blog to the database
    await blog.save();

    // Redirect to the homepage or another appropriate page
    res.redirect("/blog");
  } catch (error) {
    console.error("Error inserting new blog:", error);
    res.status(500).send("Error inserting new blog");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/identify-breed", (req, res) => {
  res.render("identify-breed.ejs");
});

app.post("/identify-breed", upload.single("dogImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("Done1");

    const filename = `./uploads/${req.file.filename}`;
    console.log(filename);

    const response = await identifyBreed(filename);
    console.log(response);

    if (response && response.length > 0) {
      // Render the result page with image and response data
      const data = {
        imageFileName: filename, // Pass the path to the uploaded image
        response: response,      // Pass the breed identification results
      };
      res.render("identify-breed.ejs", data);
    } else {
      // Handle cases where no valid response is available
      res.status(500).json({ error: "Breed identification failed." });
    }
  } catch (err) {
    console.error("Some error occurred:", err);
    // Handle and respond to the error
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get("/price", (req, res) => {
  res.render("price.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about-us.ejs");
});



////////////////////////////////////////////////////////////////////////////////////////

// blog section

// Connect to MongoDB
async function makeConnection() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error occurred while making connection:", error);
  }
}
makeConnection();

// Define a schema
const blogSchema = mongoose.Schema({
  Author: {
    type: String,
    required: [true, "Please enter an author name"],
  },
  Content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// Defining the model
const Blog = mongoose.model("Blog", blogSchema);

// Default blogs
const defaultBlogs = [
  {
    Author: "Prakash Jha",
    Content: "Are you a dog lover? If so, you're in the right place! In this blog post, we'll embark on a journey into the fascinating world of canine companions. Dogs have been our loyal friends for thousands of years, and there's so much to discover about them.",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya Keshari",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
];

// Insert default blogs into the database blogDB
async function insertDefaultBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(defaultBlogs);
      console.log("Successfully inserted default blogs to DB");
    }
  } catch (error) {
    console.error("Insert Default blogs Error:", error);
  }
}
insertDefaultBlogs();

app.get("/blog", async (req, res) => {
  try {
    const response = await Blog.find({});
    res.render("blog_files/index.ejs", { allBlogs: response });
  } catch (error) {
    console.error("Error occurred while getting all documents:", error);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.get("/compose", (req, res) => {
  res.render("blog_files/compose.ejs");
});

app.post("/newBlog", async (req, res) => {
  try {
    const author = req.body.blog_author;
    const content = req.body.blog_content;

    // Create a new instance of the Blog model with the data
    const blog = new Blog({
      Author: author,
      Content: content,
      Date: Date.now(),
    });

    // Save the new blog to the database
    await blog.save();

    // Redirect to the homepage or another appropriate page
    res.redirect("/blog");
  } catch (error) {
    console.error("Error inserting new blog:", error);
    res.status(500).send("Error inserting new blog");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/identify-breed", (req, res) => {
  res.render("identify-breed.ejs");
});

app.post("/identify-breed", upload.single("dogImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("Done1");

    const filename = `./uploads/${req.file.filename}`;
    console.log(filename);

    const response = await identifyBreed(filename);
    console.log(response);

    if (response && response.length > 0) {
      // Render the result page with image and response data
      const data = {
        imageFileName: filename, // Pass the path to the uploaded image
        response: response,      // Pass the breed identification results
      };
      res.render("identify-breed.ejs", data);
    } else {
      // Handle cases where no valid response is available
      res.status(500).json({ error: "Breed identification failed." });
    }
  } catch (err) {
    console.error("Some error occurred:", err);
    // Handle and respond to the error
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get("/price", (req, res) => {
  res.render("price.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about-us.ejs");
});



////////////////////////////////////////////////////////////////////////////////////////

// blog section

// Connect to MongoDB
async function makeConnection() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error occurred while making connection:", error);
  }
}
makeConnection();

// Define a schema
const blogSchema = mongoose.Schema({
  Author: {
    type: String,
    required: [true, "Please enter an author name"],
  },
  Content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// Defining the model
const Blog = mongoose.model("Blog", blogSchema);

// Default blogs
const defaultBlogs = [
  {
    Author: "Prakash Jha",
    Content: "Are you a dog lover? If so, you're in the right place! In this blog post, we'll embark on a journey into the fascinating world of canine companions. Dogs have been our loyal friends for thousands of years, and there's so much to discover about them.",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya Keshari",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
];

// Insert default blogs into the database blogDB
async function insertDefaultBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(defaultBlogs);
      console.log("Successfully inserted default blogs to DB");
    }
  } catch (error) {
    console.error("Insert Default blogs Error:", error);
  }
}
insertDefaultBlogs();

app.get("/blog", async (req, res) => {
  try {
    const response = await Blog.find({});
    res.render("blog_files/index.ejs", { allBlogs: response });
  } catch (error) {
    console.error("Error occurred while getting all documents:", error);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.get("/compose", (req, res) => {
  res.render("blog_files/compose.ejs");
});

app.post("/newBlog", async (req, res) => {
  try {
    const author = req.body.blog_author;
    const content = req.body.blog_content;

    // Create a new instance of the Blog model with the data
    const blog = new Blog({
      Author: author,
      Content: content,
      Date: Date.now(),
    });

    // Save the new blog to the database
    await blog.save();

    // Redirect to the homepage or another appropriate page
    res.redirect("/blog");
  } catch (error) {
    console.error("Error inserting new blog:", error);
    res.status(500).send("Error inserting new blog");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/identify-breed", (req, res) => {
  res.render("identify-breed.ejs");
});

app.post("/identify-breed", upload.single("dogImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("Done1");

    const filename = `./uploads/${req.file.filename}`;
    console.log(filename);

    const response = await identifyBreed(filename);
    console.log(response);

    if (response && response.length > 0) {
      // Render the result page with image and response data
      const data = {
        imageFileName: filename, // Pass the path to the uploaded image
        response: response,      // Pass the breed identification results
      };
      res.render("identify-breed.ejs", data);
    } else {
      // Handle cases where no valid response is available
      res.status(500).json({ error: "Breed identification failed." });
    }
  } catch (err) {
    console.error("Some error occurred:", err);
    // Handle and respond to the error
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get("/price", (req, res) => {
  res.render("price.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about-us.ejs");
});



////////////////////////////////////////////////////////////////////////////////////////

// blog section

// Connect to MongoDB
async function makeConnection() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error occurred while making connection:", error);
  }
}
makeConnection();

// Define a schema
const blogSchema = mongoose.Schema({
  Author: {
    type: String,
    required: [true, "Please enter an author name"],
  },
  Content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// Defining the model
const Blog = mongoose.model("Blog", blogSchema);

// Default blogs
const defaultBlogs = [
  {
    Author: "Prakash Jha",
    Content: "Are you a dog lover? If so, you're in the right place! In this blog post, we'll embark on a journey into the fascinating world of canine companions. Dogs have been our loyal friends for thousands of years, and there's so much to discover about them.",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya Keshari",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
];

// Insert default blogs into the database blogDB
async function insertDefaultBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(defaultBlogs);
      console.log("Successfully inserted default blogs to DB");
    }
  } catch (error) {
    console.error("Insert Default blogs Error:", error);
  }
}
insertDefaultBlogs();

app.get("/blog", async (req, res) => {
  try {
    const response = await Blog.find({});
    res.render("blog_files/index.ejs", { allBlogs: response });
  } catch (error) {
    console.error("Error occurred while getting all documents:", error);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.get("/compose", (req, res) => {
  res.render("blog_files/compose.ejs");
});

app.post("/newBlog", async (req, res) => {
  try {
    const author = req.body.blog_author;
    const content = req.body.blog_content;

    // Create a new instance of the Blog model with the data
    const blog = new Blog({
      Author: author,
      Content: content,
      Date: Date.now(),
    });

    // Save the new blog to the database
    await blog.save();

    // Redirect to the homepage or another appropriate page
    res.redirect("/blog");
  } catch (error) {
    console.error("Error inserting new blog:", error);
    res.status(500).send("Error inserting new blog");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/identify-breed", (req, res) => {
  res.render("identify-breed.ejs");
});

app.post("/identify-breed", upload.single("dogImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("Done1");

    const filename = `./uploads/${req.file.filename}`;
    console.log(filename);

    const response = await identifyBreed(filename);
    console.log(response);

    if (response && response.length > 0) {
      // Render the result page with image and response data
      const data = {
        imageFileName: filename, // Pass the path to the uploaded image
        response: response,      // Pass the breed identification results
      };
      res.render("identify-breed.ejs", data);
    } else {
      // Handle cases where no valid response is available
      res.status(500).json({ error: "Breed identification failed." });
    }
  } catch (err) {
    console.error("Some error occurred:", err);
    // Handle and respond to the error
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get("/price", (req, res) => {
  res.render("price.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about-us.ejs");
});



////////////////////////////////////////////////////////////////////////////////////////

// blog section

// Connect to MongoDB
async function makeConnection() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error occurred while making connection:", error);
  }
}
makeConnection();

// Define a schema
const blogSchema = mongoose.Schema({
  Author: {
    type: String,
    required: [true, "Please enter an author name"],
  },
  Content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// Defining the model
const Blog = mongoose.model("Blog", blogSchema);

// Default blogs
const defaultBlogs = [
  {
    Author: "Prakash Jha",
    Content: "Are you a dog lover? If so, you're in the right place! In this blog post, we'll embark on a journey into the fascinating world of canine companions. Dogs have been our loyal friends for thousands of years, and there's so much to discover about them.",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya Keshari",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
];

// Insert default blogs into the database blogDB
async function insertDefaultBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(defaultBlogs);
      console.log("Successfully inserted default blogs to DB");
    }
  } catch (error) {
    console.error("Insert Default blogs Error:", error);
  }
}
insertDefaultBlogs();

app.get("/blog", async (req, res) => {
  try {
    const response = await Blog.find({});
    res.render("blog_files/index.ejs", { allBlogs: response });
  } catch (error) {
    console.error("Error occurred while getting all documents:", error);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.get("/compose", (req, res) => {
  res.render("blog_files/compose.ejs");
});

app.post("/newBlog", async (req, res) => {
  try {
    const author = req.body.blog_author;
    const content = req.body.blog_content;

    // Create a new instance of the Blog model with the data
    const blog = new Blog({
      Author: author,
      Content: content,
      Date: Date.now(),
    });

    // Save the new blog to the database
    await blog.save();

    // Redirect to the homepage or another appropriate page
    res.redirect("/blog");
  } catch (error) {
    console.error("Error inserting new blog:", error);
    res.status(500).send("Error inserting new blog");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/identify-breed", (req, res) => {
  res.render("identify-breed.ejs");
});

app.post("/identify-breed", upload.single("dogImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("Done1");

    const filename = `./uploads/${req.file.filename}`;
    console.log(filename);

    const response = await identifyBreed(filename);
    console.log(response);

    if (response && response.length > 0) {
      // Render the result page with image and response data
      const data = {
        imageFileName: filename, // Pass the path to the uploaded image
        response: response,      // Pass the breed identification results
      };
      res.render("identify-breed.ejs", data);
    } else {
      // Handle cases where no valid response is available
      res.status(500).json({ error: "Breed identification failed." });
    }
  } catch (err) {
    console.error("Some error occurred:", err);
    // Handle and respond to the error
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get("/price", (req, res) => {
  res.render("price.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about-us.ejs");
});



////////////////////////////////////////////////////////////////////////////////////////

// blog section

// Connect to MongoDB
async function makeConnection() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error occurred while making connection:", error);
  }
}
makeConnection();

// Define a schema
const blogSchema = mongoose.Schema({
  Author: {
    type: String,
    required: [true, "Please enter an author name"],
  },
  Content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// Defining the model
const Blog = mongoose.model("Blog", blogSchema);

// Default blogs
const defaultBlogs = [
  {
    Author: "Prakash Jha",
    Content: "Are you a dog lover? If so, you're in the right place! In this blog post, we'll embark on a journey into the fascinating world of canine companions. Dogs have been our loyal friends for thousands of years, and there's so much to discover about them.",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya Keshari",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
];

// Insert default blogs into the database blogDB
async function insertDefaultBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(defaultBlogs);
      console.log("Successfully inserted default blogs to DB");
    }
  } catch (error) {
    console.error("Insert Default blogs Error:", error);
  }
}
insertDefaultBlogs();

app.get("/blog", async (req, res) => {
  try {
    const response = await Blog.find({});
    res.render("blog_files/index.ejs", { allBlogs: response });
  } catch (error) {
    console.error("Error occurred while getting all documents:", error);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.get("/compose", (req, res) => {
  res.render("blog_files/compose.ejs");
});

app.post("/newBlog", async (req, res) => {
  try {
    const author = req.body.blog_author;
    const content = req.body.blog_content;

    // Create a new instance of the Blog model with the data
    const blog = new Blog({
      Author: author,
      Content: content,
      Date: Date.now(),
    });

    // Save the new blog to the database
    await blog.save();

    // Redirect to the homepage or another appropriate page
    res.redirect("/blog");
  } catch (error) {
    console.error("Error inserting new blog:", error);
    res.status(500).send("Error inserting new blog");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/identify-breed", (req, res) => {
  res.render("identify-breed.ejs");
});

app.post("/identify-breed", upload.single("dogImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("Done1");

    const filename = `./uploads/${req.file.filename}`;
    console.log(filename);

    const response = await identifyBreed(filename);
    console.log(response);

    if (response && response.length > 0) {
      // Render the result page with image and response data
      const data = {
        imageFileName: filename, // Pass the path to the uploaded image
        response: response,      // Pass the breed identification results
      };
      res.render("identify-breed.ejs", data);
    } else {
      // Handle cases where no valid response is available
      res.status(500).json({ error: "Breed identification failed." });
    }
  } catch (err) {
    console.error("Some error occurred:", err);
    // Handle and respond to the error
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get("/price", (req, res) => {
  res.render("price.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about-us.ejs");
});



////////////////////////////////////////////////////////////////////////////////////////

// blog section

// Connect to MongoDB
async function makeConnection() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error occurred while making connection:", error);
  }
}
makeConnection();

// Define a schema
const blogSchema = mongoose.Schema({
  Author: {
    type: String,
    required: [true, "Please enter an author name"],
  },
  Content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// Defining the model
const Blog = mongoose.model("Blog", blogSchema);

// Default blogs
const defaultBlogs = [
  {
    Author: "Prakash Jha",
    Content: "Are you a dog lover? If so, you're in the right place! In this blog post, we'll embark on a journey into the fascinating world of canine companions. Dogs have been our loyal friends for thousands of years, and there's so much to discover about them.",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya Keshari",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
];

// Insert default blogs into the database blogDB
async function insertDefaultBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(defaultBlogs);
      console.log("Successfully inserted default blogs to DB");
    }
  } catch (error) {
    console.error("Insert Default blogs Error:", error);
  }
}
insertDefaultBlogs();

app.get("/blog", async (req, res) => {
  try {
    const response = await Blog.find({});
    res.render("blog_files/index.ejs", { allBlogs: response });
  } catch (error) {
    console.error("Error occurred while getting all documents:", error);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.get("/compose", (req, res) => {
  res.render("blog_files/compose.ejs");
});

app.post("/newBlog", async (req, res) => {
  try {
    const author = req.body.blog_author;
    const content = req.body.blog_content;

    // Create a new instance of the Blog model with the data
    const blog = new Blog({
      Author: author,
      Content: content,
      Date: Date.now(),
    });

    // Save the new blog to the database
    await blog.save();

    // Redirect to the homepage or another appropriate page
    res.redirect("/blog");
  } catch (error) {
    console.error("Error inserting new blog:", error);
    res.status(500).send("Error inserting new blog");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
import express from "express";
import multer from "multer";
import { identifyBreed } from "./breedIdentification.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";

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

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/identify-breed", (req, res) => {
  res.render("identify-breed.ejs");
});

app.post("/identify-breed", upload.single("dogImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }
    console.log("Done1");

    const filename = `./uploads/${req.file.filename}`;
    console.log(filename);

    const response = await identifyBreed(filename);
    console.log(response);

    if (response && response.length > 0) {
      // Render the result page with image and response data
      const data = {
        imageFileName: filename, // Pass the path to the uploaded image
        response: response,      // Pass the breed identification results
      };
      res.render("identify-breed.ejs", data);
    } else {
      // Handle cases where no valid response is available
      res.status(500).json({ error: "Breed identification failed." });
    }
  } catch (err) {
    console.error("Some error occurred:", err);
    // Handle and respond to the error
    res.status(500).json({ error: "Internal server error." });
  }
});


app.get("/price", (req, res) => {
  res.render("price.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about-us.ejs");
});



////////////////////////////////////////////////////////////////////////////////////////

// blog section

// Connect to MongoDB
async function makeConnection() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to DB");
  } catch (error) {
    console.error("Error occurred while making connection:", error);
  }
}
makeConnection();

// Define a schema
const blogSchema = mongoose.Schema({
  Author: {
    type: String,
    required: [true, "Please enter an author name"],
  },
  Content: {
    type: String,
    required: [true, "Content cannot be empty"],
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// Defining the model
const Blog = mongoose.model("Blog", blogSchema);

// Default blogs
const defaultBlogs = [
  {
    Author: "Prakash Jha",
    Content: "Are you a dog lover? If so, you're in the right place! In this blog post, we'll embark on a journey into the fascinating world of canine companions. Dogs have been our loyal friends for thousands of years, and there's so much to discover about them.",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya Keshari",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
  {
    Author: "Aditya",
    Content: "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    Date: new Date("2023-09-23T12:00:00Z"),
  },
];

// Insert default blogs into the database blogDB
async function insertDefaultBlogs() {
  try {
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(defaultBlogs);
      console.log("Successfully inserted default blogs to DB");
    }
  } catch (error) {
    console.error("Insert Default blogs Error:", error);
  }
}
insertDefaultBlogs();

app.get("/blog", async (req, res) => {
  try {
    const response = await Blog.find({});
    res.render("blog_files/index.ejs", { allBlogs: response });
  } catch (error) {
    console.error("Error occurred while getting all documents:", error);
    res.status(500).send("Error occurred while fetching data");
  }
});

app.get("/compose", (req, res) => {
  res.render("blog_files/compose.ejs");
});

app.post("/newBlog", async (req, res) => {
  try {
    const author = req.body.blog_author;
    const content = req.body.blog_content;

    // Create a new instance of the Blog model with the data
    const blog = new Blog({
      Author: author,
      Content: content,
      Date: Date.now(),
    });

    // Save the new blog to the database
    await blog.save();

    // Redirect to the homepage or another appropriate page
    res.redirect("/blog");
  } catch (error) {
    console.error("Error inserting new blog:", error);
    res.status(500).send("Error inserting new blog");
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
