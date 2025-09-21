import { getAssessment } from "../../models/assessments.model.js";
import { getHomework } from "../../models/homework.model.js";
import { getStudentLessons } from "../../models/lessons.model.js";
import { verifyIfUserExists } from "../../models/users.model.js";
import { getScore } from "../../models/scores.model.js";
import { getStudentAttendance } from "../../models/attendance.model.js";



const getLessonsPerDay = async (req, res, next) => {
    if (!req.query || !req.query.date) {
        return res.status(400).json({
            error: "Bad request: Missing query parameters",
        });
    }

    const user = await verifyIfUserExists(req.user.uid);
    if (!user) {
        return res.status(404).json({
            error: "Not found: User not found",
        });
    }

    const lessons = await getStudentLessons(user.id, req.query.date);
    if (!lessons) {
        return res.status(404).json({
            error: "Not found: No lessons found for the specified date and class",
        });
    }

    res.json({
        lessons: lessons,
    });
}

const getLessonDetails = async (req, res, next) => {
    if (!req.query || !req.query.lessonId) {
        return res.status(400).json({
            error: "Bad request: Missing query parameters",
        });
    }

    const user = await verifyIfUserExists(req.user.uid);
    if (!user) {
        return res.status(404).json({
            error: "Not found: User not found",
        });
    }

    let attendance = await getStudentAttendance(user.id, req.query.lessonId);
    if (!attendance) {
        attendance = '-';
    }

    const hwDue = await getHomework('due', req.query.lessonId);
    const hwAssigned = await getHomework('assigned', req.query.lessonId);

    let assessment = await getAssessment(req.query.lessonId);
    let score = null;
    if (!assessment) {
        assessment = null;
    } else {
        score = await getScore(user.id, assessment.id);
    }

    res.json({
        attendance: attendance,
        homework_due: hwDue ? hwDue : null,
        homework_assigned: hwAssigned ? hwAssigned : null,
        assessment: assessment,
        score: score
    });
}

export {
    getLessonsPerDay,
    getLessonDetails
}