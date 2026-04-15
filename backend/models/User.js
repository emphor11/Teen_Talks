const pool = require("../db")


const createUser = async(name,email,password) =>{
    const result = await pool.query(
        "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
        [name,email,password]
    )
    return result.rows[0]; // ✅ now has id, username, email
    
}

const createGoogleUser = async (name, email, googleId, profilePic = null) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password, google_id, profile_pic)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [name, email, null, googleId, profilePic]
    );
    return result.rows[0];
}

const findUserByEmail = async(email) =>{
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )
    return result.rows[0];
}

const findUserById =async (id) =>{
    const result = await pool.query(
        "SELECT * FROM users WHERE id = $1", [id], 
    )
    return result.rows[0]
}

const findUserByGoogleId = async (googleId) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE google_id = $1",
        [googleId]
    );
    return result.rows[0];
}

const linkGoogleAccount = async (userId, googleId, profilePic = null) => {
    const result = await pool.query(
        `UPDATE users
         SET google_id = $2,
             profile_pic = COALESCE(profile_pic, $3)
         WHERE id = $1
         RETURNING *`,
        [userId, googleId, profilePic]
    );
    return result.rows[0];
}

module.exports = {
    createUser,
    createGoogleUser,
    findUserByEmail,
    findUserById,
    findUserByGoogleId,
    linkGoogleAccount
}
