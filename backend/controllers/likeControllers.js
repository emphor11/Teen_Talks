const { toggleLike, countLikes } = require("../models/Likes")


const handleLike = async (req,res) =>{
    try{
        const postId  = req.params.id
        const userId = req.userId

        const result = await toggleLike(userId,postId)
        const likeCount = await countLikes(postId)

        res.json({...result,likeCount})
    }catch (err) {
        console.error("Like Error:", err);
        res.status(500).json({ message: "Server error" });
      }
}

const getLikes = async (req, res) => {
    try {
      const postId = req.params.id;
      const likeCount = await countLikes(postId);
      res.json({ postId, likeCount });
    } catch (err) {
      console.error("Get Likes Error:", err);
      res.status(500).json({ message: "Server error" });
    }
}

module.exports = {handleLike,getLikes}