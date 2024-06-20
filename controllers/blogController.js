const { GoogleGenerativeAI } = require("@google/generative-ai");
const Blog = require("../models/blog");
const bodyParser = require("body-parser");

const SECRET_KEY = process.env.SECRET_KEY;

// Initialize the generative model
const genAI = new GoogleGenerativeAI(SECRET_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getMeBlogGemini = async (title) => {
  const prompt = `You are an experienced writer and blogger. Please write a comprehensive, engaging, and informative blog post on the following topic:
    Title: ${title}

    Make sure to include an introduction that captures the reader's attention, a body with well-structured and informative content, and a conclusion that provides a summary or call to action.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("Error generating blog:", error);
    throw new Error("Failed to generate blog");
  }
};

// Controller to generate and save a new blog post
const generateBlog = async (req, res) => {
  try {
    const { title } = req.body;
    const content = await getMeBlogGemini(title);
    console.log(content);
    const blog = new Blog({
      title,
      blog: content,
    });
    await blog.save();
    res.status(201).json({ content, title });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const retrieveBlog = async (req, res) => {
  try {
    const blogs = await Blog.find();
    console.log(blogs);
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteAllBlogs = async (req, res) => {
  try {
    await Blog.deleteMany();
    res.status(200).json({ message: "All blogs deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  generateBlog,
  retrieveBlog,
  deleteAllBlogs,
};
