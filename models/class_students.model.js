import pool from "../config/db.js";

const getStudentsInClass = async (classId) => {
    const query = `
        SELECT s.id, s.display_name, s.email
        FROM users s
        JOIN class_students cs ON s.id = cs.student_id
        WHERE cs.class_id = $1
    `;
    const values = [classId];
    const result = await pool.query(query, values);
    return result.rows;
};

export { getStudentsInClass };
