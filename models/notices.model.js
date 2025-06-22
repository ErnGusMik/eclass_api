import pool from "../config/db.js";

const postNotice = async (title, authorId, content, tags) => {
    const noticeId = await pool.query(
        "INSERT INTO notices (title, author_id, content, tags, created_at) VALUES ($1, $2, $3, $4, NOW())",
        [title, authorId, content, tags]
    );
    return noticeId;
};

const getNoticesForTeacher = async (teacherId) => {
    const notices = await pool.query(
        `WITH related_classes AS (
            SELECT class_id
            FROM class_teachers
            WHERE teacher_id = $1
        ),
        related_teachers AS (
            SELECT DISTINCT teacher_id
            FROM class_teachers
            WHERE class_id IN (SELECT class_id FROM related_classes)
        )
        SELECT *
        FROM notices
        WHERE author_id IN (SELECT teacher_id FROM related_teachers);`)
    return notices.rows;
}

export {
    postNotice,
    getNoticesForTeacher
}