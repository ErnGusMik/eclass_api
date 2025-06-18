import pool from "../config/db.js"

const verifyIfUserExists = async (google_uid) => {
    const userId = await pool.query("SELECT id, role, status FROM users WHERE google_uid=$1", [google_uid]);
    if (userId.rows[0]) {
        return userId.rows[0]
    }
    return false
}

export {
    verifyIfUserExists
}