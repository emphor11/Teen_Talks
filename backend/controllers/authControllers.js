const { createUser, findUserByEmail, findUserById } = require("../models/User");

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET);
  }

const signup = async (req, res) =>{
    try{
        const {name,email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Email and password required "
            })
        }
        const existingUser = await findUserByEmail(email);
        if (existingUser){
            return res.status(400).json({message: "User already existed"})
        }
        const hashedPassword = await bcrypt.hash(password, 12);

    // save new user
        const newUser = await createUser(name, email, hashedPassword);

        const token = generateToken(newUser.id);

        res.status(201).json({
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        },
        });


    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
      }
    

}

const signin = async (req,res) =>{
    try{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Email and password required"})
    }
    const user = await findUserByEmail(email)
    if(!user){
        return res.status(400).json({message: "Invalid Credentials"})
    }
    const isMatch =await bcrypt.compare(password,user.password)
    if (!isMatch){
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id)
    console.log("🟢 Email:", email);
    console.log("🟢 Password:", password);
    console.log("🟢 User found:", user);
    console.log("🟢 Signed in successfully...");

    return res.status(200).json({
        message: "Signed in successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          // any other fields you want to expose
        },
      });
    }catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error" });
}
}

const profile = async (req,res) => {
    try{
        const userId = req.userId
        if(!userId){
            return res.status(401).json({message: "Unauthorised"})
        }
        const user = await findUserById(userId)
        if(!user){
            return res.status(401).json({message: "User not found"})
        }
        res.json({ user})
    }catch(err){
        console.error("Profile error:", err);
        res.status(500).json({ message: "Server error" });
    }
}



module.exports ={signup,signin,profile}