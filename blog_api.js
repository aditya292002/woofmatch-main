import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "Exploring the World of Canine Companions",
    content:
      "Are you a dog lover? If so, you're in the right place! In this blog post, we'll embark on a journey into the fascinating world of canine companions. Dogs have been our loyal friends for thousands of years, and there's so much to discover about them.",
    author: "Prakash Jha",
    date: "2023-08-01",
  },
  {
    id: 2,
    title: "The Benefits of Having a Canine Companion",
    content:
      "Having a furry friend by your side offers numerous benefits. We'll discuss how dogs can improve your physical and mental health, provide companionship, and even enhance your social life. It's no wonder they're often referred to as 'man's best friend'",
    author: "Aditya Keshari",
    date: "2023-08-05",
  },
  {
    id: 3,
    title: "Doggy Adventures",
    content:
      "What's a dog blog without some exciting adventures? We'll share stories of incredible doggy journeys, from cross-country road trips to mountain hikes. Plus, we'll provide tips on how to plan your own dog-friendly adventures.",
    author: "Samuel Green",
    date: "2023-08-10",
  },
  {
    id: 4,
    title: "Training and Socialization",
    content:
      "What's a dog blog without some exciting adventures? We'll share stories of incredible doggy journeys, from cross-country road trips to mountain hikes. Plus, we'll provide tips on how to plan your own dog-friendly adventures.",
    author: "John Doe",
    date: "2023-08-12",
  },
];

let lastId = 4;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET all posts
app.get("/posts", (req, res) => {
  console.log(posts);
  res.json(posts);
});

// GET a specific post by id
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

// POST a new post
app.post("/posts", (req, res) => {
  const newId = lastId += 1;
  const post = {
    id: newId,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    date: new Date(),
  };
  lastId = newId;
  posts.push(post);
  res.status(201).json(post);
});

// PATCH a post when you just want to update one parameter
app.patch("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ message: "Post not found" });

  if (req.body.title) post.title = req.body.title;
  if (req.body.content) post.content = req.body.content;
  if (req.body.author) post.author = req.body.author;

  res.json(post);
});

// DELETE a specific post by providing the post id
app.delete("/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Post not found" });

  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
