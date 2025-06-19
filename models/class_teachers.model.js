import pool from "../config/db.js";

const addTeacherToClass = async (classID, teacherID) => {
    try {
        const added = await pool.query(
            "INSERT INTO class_teachers (class_id, teacher_id) VALUES ($1, $2)",
            [classID, teacherID]
        );
        return true;
    } catch (e) {
        console.log("Failed to add teacher to class: " + e);
        return false;
    }
};

export {
    addTeacherToClass
}