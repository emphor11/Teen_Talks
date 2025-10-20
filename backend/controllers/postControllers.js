const { createPost, getAllPosts, getPostById } = require("../models/Post");
const path = require("path");

const addPost = async(req,res)=>{
    try {
        const { content } = req.body;
    
        if (!content && !req.file) {
          return res.status(400).json({ message: "Content or media required" });
        }
    
        const mediaPath = req.file ? req.file.path : null;
    
        const result = await createPost(req.userId, content, mediaPath);
    
        res.status(201).json({
          message: "Post created successfully",
          post: result,
        });
      } catch (err) {
        console.error("Error creating post:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
};

const getPost = async(req,res)=>{
    try{
        const result = await getAllPosts()
        res.json(result)
    }catch(err){
        console.log("Error is", err)
        res.status(500).json({message: "Internal Server Error"})
    }
}

const fetchPostById = async (req, res) => {
    try {
      const post = await getPostById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      res.json(post);
    } catch (err) {
      console.error("Fetch Post Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
module.exports = { addPost, getPost, fetchPostById };