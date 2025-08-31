import pool from "../config/db.js";

const getScores = async (assessmentId, classId) => {
    const query = `
    WITH class_students AS (
        SELECT s.id, s.display_name, s.email
        FROM users s
        JOIN class_students cs ON s.id = cs.student_id
        WHERE cs.class_id = $2
    )
        SELECT cs.id, cs.display_name, cs.email, sc.score
        FROM class_students cs
        LEFT JOIN scores sc ON cs.id = sc.student_id AND sc.assessment_id = $1
    `;
    const values = [assessmentId, classId];
    const result = await pool.query(query, values);
    return result.rows;
}

const updateScoreRecord = async (studentId, assessmentId, score, classId) => {
    const query = await pool.query(
        `
        INSERT INTO scores (student_id, assessment_id, score)
        VALUES ($1, $2, $3)
        ON CONFLICT (assessment_id, student_id) DO UPDATE
            SET score = $3
        RETURNING id;
        `,
        [studentId, assessmentId, score]
    );

    if (query.rows.length > 0) {
        return query.rows[0].id;
    } else {
        return false;
    }

};

export {
    getScores,
    updateScoreRecord
}