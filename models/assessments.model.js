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
    const assessment = await pool.query('SELECT * FROM assessments WHERE ')
}

export { createAssessment, checkIfAssessmentExists, getUpcomingAssessments };
