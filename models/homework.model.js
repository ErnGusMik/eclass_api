import pool from "../config/db.js"

const createHomework = async (lessonDue, lessonAssigned, content) => {
    const query = await pool.query('INSERT INTO homework (lesson_id_due, lesson_id_assigned, description, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id;', [lessonDue, lessonAssigned, content]);
    if (query.rowCount == 1) return query.rows[0].id;
    return false;
}

const getHomework = async (type, lessonId) => {
    let query;
    if (type == 'due') {
        query = await pool.query('SELECT * FROM homework WHERE lesson_id_due = $1', [lessonId]);
    } else if (type == 'assigned') {
        query = await pool.query('SELECT * FROM homework WHERE lesson_id_assigned = $1', [lessonId]);
    } else {
        return false;
    }

    if (query.rowCount == 1) {
        return query.rows[0]
    } 
    return false;
}

const updateHomeworkData = async (homeworkId, content) => {
    const query = await pool.query('UPDATE homework SET description = $1 WHERE id = $2 RETURNING id', [content, homeworkId]);
    if (query.rowCount == 1) {
        return true;
    }
    return false;

}

export {
    updateHomeworkData,
    createHomework,
    getHomework
}