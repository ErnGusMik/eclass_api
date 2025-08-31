import { response } from "express";
import pool from "../config/db.js";

const createAssessment = async (lessonId, topic, sys) => {
    const query = await pool.query(
        "INSERT INTO assessments (lesson_id, topic, sys, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
        [lessonId, topic, sys]
    );
    if (query.rowCount == 1) {
        return query.rows[0].id;
    }
    return false;
};

const checkIfAssessmentExists = async (lessonId) => {
    const query = await pool.query(
        "SELECT * FROM assessments WHERE lesson_id = $1",
        [lessonId]
    );
    if (response.rowCount > 0) {
        return query.rows;
    }
    return false;
};

const checkIfAssessmentExistsByID = async (id) => {
    const query = await pool.query("SELECT * FROM assessments WHERE id = $1", [
        id,
    ]);
    if (query.rowCount > 0) {
        return query.rows;
    }
    return false;
};

const doubleCheckIfAssessmentExists = async (id, lessonId) => {
    const query = await pool.query("SELECT * FROM assessments WHERE id = $1 AND lesson_id = $2", [
        id,
        lessonId
    ]);
    if (query.rowCount > 0) {
        return query.rows;
    }
    return false;
};

const getUpcomingAssessments = async (classId) => {
    const query = await pool.query(
        `SELECT
        assessments.id AS assessment_id,
        assessments.topic,
        assessments.sys,
        assessments.lesson_id,
        lessons.datetime,
        lessons.duration,
        lessons.class_id,
        lessons.id AS lesson_id
    FROM assessments
    JOIN lessons ON assessments.lesson_id = lessons.id
    WHERE lessons.datetime::timestamp > NOW() AND lessons.class_id = $1
    ORDER BY lessons.datetime::timestamp ASC;`,
        [classId]
    );
    return query.rows;
};

const getAssessment = async (lessonId) => {
    const assessment = await pool.query(
        "SELECT * FROM assessments WHERE lesson_id = $1",
        [lessonId]
    );
    if (assessment.rowCount == 1) {
        return assessment.rows[0];
    }
    return false;
};

const updateAssessmentTopic = async (lessonId, content) => {
    const query = await pool.query(
        "UPDATE assessments SET topic = $1 WHERE lesson_id = $2 RETURNING id",
        [content, lessonId]
    );
    if (query.rowCount == 1) return true;
    return false;
};

const deleteAssessment = async (lessonId) => {
    await pool.query("DELETE FROM assessments WHERE lesson_id = $1", [
        lessonId,
    ]);
    return;
};

const editAssessment = async (id, lessonId, topic, sys) => {
    const fields = [];
    const values = [];
    let index = 1;

    if (lessonId != null) {
        fields.push(`lesson_id = $${index++}`);
        values.push(lessonId);
    }
    if (topic != null) {
        fields.push(`topic = $${index++}`);
        values.push(topic);
    }
    if (sys != null) {
        fields.push(`sys = $${index++}`);
        values.push(sys);
    }

    values.push(id);
    const queryStr = `UPDATE assessments SET ${fields.join(", ")} WHERE id = $${index} RETURNING id`;
    
    const query = await pool.query(queryStr, values);
    if (query.rowCount == 1) {
        return query.rows[0].id;
    } else return false;
};

const editAssessmentSystem = async (lessonId, sys) => {
    const query = await pool.query(
        "UPDATE assessments SET sys = $1 WHERE lesson_id = $2 RETURNING id",
        [sys, lessonId]
    );
    if (query.rowCount == 1) return true;
    return false;
};

export {
    createAssessment,
    checkIfAssessmentExists,
    checkIfAssessmentExistsByID,
    getUpcomingAssessments,
    getAssessment,
    updateAssessmentTopic,
    deleteAssessment,
    editAssessment,
    editAssessmentSystem,
    doubleCheckIfAssessmentExists
};
