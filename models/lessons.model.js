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


export {
    getLessonsInDay
}