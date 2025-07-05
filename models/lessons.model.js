import pool from "../config/db.js";

const getLessonsInDay = async (date, classId) => {
    const postgresDate = new Date(date);
    const lessons = await pool.query(
        "SELECT * FROM lessons WHERE class_id = $1 AND DATE(CAST(datetime AS TIMESTAMP)) = $2",
        [
            classId,
            `${postgresDate.getFullYear()}-${
                postgresDate.getMonth() + 1
            }-${postgresDate.getDate()}`,
        ]
    );
    return lessons.rows
};


const getLessonClass = async (lessonId) => {
    const classId = await pool.query('SELECT class_id FROM lessons WHERE id = $1', [lessonId]);
    if (classId.rowCount != 1) {
        return false;
    }
    return classId.rows[0].class_id;
}


const updateNotes = async (lessonId, content) => {
    const query = await pool.query('UPDATE lessons SET notes = $1 WHERE id = $2 RETURNING id', [content, lessonId]);
    if (query.rowCount == 1) {
        return true
    }
    return false;
}

const updateTopic = async (lessonId, content) => {
    const query = await pool.query('UPDATE lessons SET topic = $1 WHERE id = $2 RETURNING id', [content, lessonId]);
    if (query.rowCount == 1) {
        return true
    }
    return false;
}

const getAllLessons = async (classId) => {
    const query = await pool.query('SELECT id, datetime FROM lessons WHERE class_id = $1', [classId]);
    return query.rows;
}

export {
    getLessonsInDay,
    getLessonClass,
    updateNotes,
    updateTopic,
    getAllLessons
}