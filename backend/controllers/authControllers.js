const {
    createUser,
    createGoogleUser,
    findUserByEmail,
    findUserById,
    findUserByGoogleId,
    linkGoogleAccount,
} = require("../models/User");

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { getPostsByUserId } = require("../models/Post");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET);
}

async function buildAuthResponse(user) {
    const token = generateToken(user.id);
    const posts = await getPostsByUserId(user.id);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            profile_pic: user.profile_pic ?? null,
        },
        posts,
    };
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

        const authResponse = await buildAuthResponse(newUser);

        res.status(201).json(authResponse);


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
    if (!user.password) {
        return res.status(400).json({ message: "Use Google sign-in for this account" });
    }
    const isMatch =await bcrypt.compare(password,user.password)
    if (!isMatch){
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const authResponse = await buildAuthResponse(user)
    console.log(user)
    return res.status(200).json({
        message: "Signed in successfully",
        ...authResponse,
      });
    }catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error" });
}
}

const googleSignin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential required" });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({ message: "Google auth is not configured" });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload?.email || !payload?.sub || payload.email_verified === false) {
            return res.status(400).json({ message: "Invalid Google account" });
        }

        let user = await findUserByGoogleId(payload.sub);

        if (!user) {
            const existingUser = await findUserByEmail(payload.email);

            if (existingUser) {
                user = await linkGoogleAccount(
                    existingUser.id,
                    payload.sub,
                    payload.picture || null
                );
            } else {
                user = await createGoogleUser(
                    payload.name || payload.email.split("@")[0],
                    payload.email,
                    payload.sub,
                    payload.picture || null
                );
            }
        }

        const authResponse = await buildAuthResponse(user);

        return res.status(200).json({
            message: "Google sign-in successful",
            ...authResponse,
        });
    } catch (err) {
        console.error("Google signin error:", err);
        return res.status(500).json({ message: "Google sign-in failed" });
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


module.exports ={signup,signin,googleSignin,profile}
