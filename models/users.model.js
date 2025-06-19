import pool from "../config/db.js"

const verifyIfUserExists = async (google_uid) => {
    const userId = await pool.query("SELECT id, role, status FROM users WHERE google_uid=$1", [google_uid]);
    if (userId.rows[0]) {
        return userId.rows[0]
    }
    return false
}

const createUser = async (email, displayName, photoUrl, google_uid, role) => {
    if (displayName == null) {
        displayName = 'User';
    }
    const userExists = await pool.query('SELECT id FROM users WHERE google_uid=$1', [google_uid]);
    if (userExists.rows[0]) return userExists.rows[0].id;
    const user = await pool.query("INSERT INTO users (email, display_name, photo_url, google_uid, role, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id", [email, displayName, photoUrl, google_uid, role]);
    return user.rows[0].id;
}

export {
    verifyIfUserExists,
    createUser
}