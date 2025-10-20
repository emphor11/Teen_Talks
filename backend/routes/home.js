const express = require("express");
const { signup, signin, profile } = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/signup",signup)
router.post("/signin",signin)
router.get("/profile",authMiddleware,profile)


module.exports = router