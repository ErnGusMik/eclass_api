import pool from "../config/db.js";

const getLessonAttendance = async (lessonId, classId) => {
    const query = `
    WITH class_students AS (
        SELECT s.id, s.display_name, s.email
        FROM users s
        JOIN class_students cs ON s.id = cs.student_id
        WHERE cs.class_id = $2
    )
        SELECT cs.id, cs.display_name, cs.email, a.status
        FROM class_students cs
        LEFT JOIN attendance a ON cs.id = a.student_id AND a.lesson_id = $1
    `;
    const values = [lessonId, classId];
    const result = await pool.query(query, values);
    return result.rows;
};

const postAttendanceRecord = async (studentId, lessonId, status, classId) => {
    const query = await pool.query(
        `
        INSERT INTO attendance (lesson_id, student_id, class_id, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (lesson_id, student_id) DO UPDATE
            SET status = $4 
        RETURNING id;
        `,
        [lessonId, studentId, classId, status.toLowerCase()]
    );

    if (query.rows.length > 0) {
        return query.rows[0].id;
    } else {
        return false;
    }
};

export { getLessonAttendance, postAttendanceRecord };
