const jwt = require("jsonwebtoken")

const authMiddleware = async (req,res,next) =>{
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        return res.status(400).json({message: "Invalid token"})
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.userId = decoded.id
        next()
    }catch(err){
        console.log("Error:", err)
    }
}

module.exports = authMiddleware