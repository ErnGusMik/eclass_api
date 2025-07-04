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

const getClassTeachers = async (classID) => {
    const teachers = await pool.query(
        "SELECT u.* FROM users u JOIN class_teachers ct ON u.id = ct.teacher_id WHERE ct.class_id = $1",
        [classID]
    );
    if (teachers.rowCount == 0) return false;
    return teachers;
};

const verifyClassTeacher = async (classID, teacherID) => {
    const query = await pool.query('SELECT * FROM class_teachers WHERE class_id = $1 AND teacher_id = $2', [classID, teacherID]);
    if (query.rowCount == 0) {
        return false
    };
    return true;
}

export { addTeacherToClass, getClassTeachers, verifyClassTeacher };
