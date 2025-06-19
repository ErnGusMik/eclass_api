import pool from "../config/db.js";
import { addTeacherToClass } from "./class_teachers.model.js";

const createClass = async (name, grade, teacherID) => {
    let id = null;
    let iterations = 0;
    while (id == null || iterations <= 10) {
        let code = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
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
        iterations++
    }

    if (id==null) {
        return 500;
    }
    console.log(teacherID)
    const teacherAdded = await addTeacherToClass(id, teacherID);

    if (teacherAdded) {
        return 201;
    } else {
        return 400;
    }
};


export {
    createClass
}