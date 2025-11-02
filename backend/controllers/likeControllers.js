const { toggleLike, countLikes } = require("../models/Likes")


const handleLike = async (req,res) =>{
    try{
        const postId  = req.params.postId
        const userId = req.userId

        const result = await toggleLike(userId,postId)
        const likeCount = await countLikes(postId)
        console.log("Like API:", { postId, userId, ...result, likeCount });
        res.json({success: true,
          liked: result.liked,
          count: parseInt(likeCount, 10),})
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