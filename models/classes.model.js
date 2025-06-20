import pool from "../config/db.js";
import { addTeacherToClass, getClassTeachers } from "./class_teachers.model.js";

const createClass = async (name, grade, teacherID) => {
    let id = null;
    let iterations = 0;
    while (id == null || iterations <= 10) {
        let code = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const length = 6;
        for (let i = 0; i < length; i++) {
            code += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        let classID = null;
        try {
            classID = await pool.query(
                "INSERT INTO classes (name, grade, code, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
                [name, grade, code]
            );
        } catch (e) {
            console.log("Class creation failed: " + e);
        }
        if (classID.rows[0].id) {
            id = classID.rows[0].id;
            break;
        }
        iterations++;
    }

    if (id == null) {
        return 500;
    }
    console.log(teacherID);
    const teacherAdded = await addTeacherToClass(id, teacherID);

    if (teacherAdded) {
        return 201;
    } else {
        return 400;
    }
};

const joinClass = async (classCode, studentID) => {
    const res = await pool.query(
        `WITH found_class AS (
            SELECT id FROM classes WHERE code = $1
        )
        INSERT INTO class_students (student_id, class_id)
        SELECT $2, id FROM found_class
        RETURNING class_id;`,
        [studentID, classCode]
    );
    if (res.rowCount == 0) {
        return false
    }
    return true;
};

const getClassData = async (classCode) => {
    const res = await pool.query('SELECT * FROM classes WHERE code = $1', [classCode]);
    if (res.rowCount == 1) {
        const teachers = await getClassTeachers(res.rows[0].id);
        if (!teachers) return false;
        return {
            class: res.rows[0],
            teachers: teachers.rows
        }
    }
    return false;
}

export { createClass, joinClass, getClassData };
