const express = require("express")
const authMiddleware = require("../middleware/authmiddleware")
const { addPost, getPost, fetchPostById } = require("../controllers/postControllers")
const { handleLike, getLikes } = require("../controllers/likeControllers")
const { createComment, fetchComments, removeComment } = require("../controllers/commentControllers")
const upload = require("../middleware/uploadMiddleware")

const router = express.Router()

router.post("/",authMiddleware,upload.single("media"), addPost)
router.get("/",getPost)
router.get("/:id",fetchPostById)

router.post("/:id/like",authMiddleware, handleLike)
router.get("/:id/likes", getLikes)

router.post("/comments/:postId",authMiddleware,createComment)
router.get("/comments/:postId",fetchComments)
router.delete("/comments/:commentId", authMiddleware,removeComment)

module.exports = router

