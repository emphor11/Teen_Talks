const express = require("express");
const { signup, signin, googleSignin, profile } = require("../controllers/authControllers");
const authMiddleware = require("../middleware/authmiddleware");
const router = express.Router();

router.post("/signup",signup)
router.post("/signin",signin)
router.post("/google", googleSignin)
router.get("/profile",authMiddleware,profile)


module.exports = router
