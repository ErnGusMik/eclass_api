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
        a.id AS assessment_id
        a.topic,
        a.sys,
        a.lesson_id
        l.datetime
        l.duration
        l.class_id
        l.id AS lesson_id
    FROM assessments a
    JOIN lessons l ON a.lesson_id = l.id
    WHERE l.datetime::timestamp > NOW() AND l.class_id = $1
    ORDER BY l.datetime::timestamp ASC;`,
    [classId]
    );
    return query.rows;
};

export { createAssessment, checkIfAssessmentExists, getUpcomingAssessments };
