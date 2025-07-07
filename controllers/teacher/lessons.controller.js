import { verifyClassTeacher } from "../../models/class_teachers.model.js";
import {
    createHomework,
    getHomework,
    updateHomeworkData,
} from "../../models/homework.model.js";
import {
    getAllLessons,
    getLessonClass,
    getLessonsInDay,
    updateNotes,
    updateTopic,
} from "../../models/lessons.model.js";
import { verifyIfUserExists } from "../../models/users.model.js";
import { checkIfAssessmentExists, createAssessment, getUpcomingAssessments } from "../../models/assessments.model.js";

const getDayLessons = async (req, res, next) => {
    if (!req.query || !req.query.date || !req.query.classId) {
        return res.status(400).json({
            error: "Bad request: Missing query parameters",
        });
    }

    const verifiedRole = await verifyIfUserExists(req.user.uid);

    if (verifiedRole.role != "teacher") {
        return res.status(403).json({
            error: "Forbidden: Users with this role may not access this endpoint",
        });
    }

    const verifiedTeacher = await verifyClassTeacher(
        req.query.classId,
        verifiedRole.id
    );

    if (!verifiedTeacher) {
        return res.status(403).json({
            error: "Forbidden: This user is not affiliated to this class",
        });
    }

    const lessons = await getLessonsInDay(req.query.date, req.query.classId);
    const readyToSend = [];
    for (const lesson of lessons) {
        const homeworkDue = await getHomework("due", lesson.id);
        const homeworkAssigned = await getHomework("assigned", lesson.id);
        readyToSend.push({
            id: lesson.id,
            class_id: lesson.class_id,
            room: lesson.room,
            notes: lesson.notes,
            topic: lesson.topic,
            is_cancelled: lesson.is_cancelled,
            schedule_id: lesson.schedule_id,
            datetime: lesson.datetime,
            duration: lesson.duration,
            hw_due: homeworkDue,
            hw_assigned: homeworkAssigned,
        });
    }

    res.json({
        lessons: readyToSend,
    });
};

const updateLesson = async (req, res, next) => {
    if (!req.body || !req.body.content || !req.body.lessonId) {
        return res.status(400).json({
            error: "Bad request: Missing request body",
        });
    }

    if (!req.query || !req.query.field) {
        return res.status(400).json({
            error: "Bad request: Missing query parameters",
        });
    }

    const classId = await getLessonClass(parseInt(req.body.lessonId));

    if (!classId) {
        return res.status(404).json({
            error: "Not found: The lesson with the specified class ID could not be found",
        });
    }

    const user = await verifyIfUserExists(req.user.uid);

    if (!user) {
        return res.status(404).json({
            error: "Not found: User not found",
        });
    }

    const verifiedTeacher = await verifyClassTeacher(classId, user.id);

    if (!verifiedTeacher) {
        return res.status(403).json({
            error: "Forbidden: The user may not access this resource",
        });
    }

    if (req.query.field == "notes") {
        const updated = await updateNotes(req.body.lessonId, req.body.content);
        if (updated) {
            return res.sendStatus(204);
        }
        return res.status(500).json({
            error: "Internal server error",
        });
    } else if (req.query.field == "topic") {
        const updated = await updateTopic(req.body.lessonId, req.body.content);
        if (updated) {
            return res.sendStatus(204);
        }
        return res.status(500).json({
            error: "Internal server error",
        });
    } else if (req.query.field == "hw_due") {
        const homework = await getHomework("due", req.body.lessonId);
        if (!homework) {
            if (!req.body.hw_assigned_id)
                return res.status(400).json({
                    error: "Bad request: For new instances of HW due, a hw_assigned_id is required in the request body",
                });
            const createdHW = await createHomework(
                req.body.lessonId,
                parseInt(req.body.hw_assigned_id),
                req.body.content
            );
            if (!createdHW) {
                return res.status(500).json({
                    error: "Internal server error: Homework creation failed",
                });
            }
            return res.sendStatus(201);
        } else {
            const updated = await updateHomeworkData(
                homework.id,
                req.body.content
            );
            if (updated) {
                res.sendStatus(204);
            } else {
                res.status(500).json({
                    error: "Internal server error: Homework updating failed",
                });
            }
        }
    } else if (req.query.field == "hw_assigned") {
        const homework = await getHomework("assigned", req.body.lessonId);
        if (!homework) {
            if (!req.body.hw_due_id)
                return res.status(400).json({
                    error: "Bad request: For new instances of HW assigned, a hw_due_id is required in the request body",
                });
            const createdHW = await createHomework(
                req.body.hw_due_id,
                req.body.lessonId,
                req.body.content
            );
            if (!createdHW) {
                return res.status(500).json({
                    error: "Internal server error: Homework creation failed",
                });
            }
            return res.sendStatus(201);
        } else {
            const updated = await updateHomeworkData(
                homework.id,
                req.body.content
            );
            if (updated) {
                res.sendStatus(204);
            } else {
                res.status(500).json({
                    error: "Internal server error: Homework updating failed",
                });
            }
        }
    } else if (req.query.field == "assessment") {
    } else {
        return res.status(400).json({
            error: "Bad request: Invalid query parameter",
        });
    }
};

const getAllTimes = async (req, res, next) => {
    if (!req.query || !req.query.classId) {
        return res.status(400).json({
            error: "Bad request: Missing query parameters.",
        });
    }

    const user = await verifyIfUserExists(req.user.uid);
    if (!user)
        return res.status(404).json({
            error: "Not found: User not found.",
        });
    const classTeacher = await verifyClassTeacher(req.query.classId, user.id);
    if (!classTeacher)
        return res.status(403).json({
            error: "Forbidden: This user may not access this class.",
        });

    const lessons = await getAllLessons(req.query.classId);
    res.json({
        lessons: lessons,
    });
};

const createNewAssessment = async (req, res, next) => {
    if (!req.body || !req.body.lessonId || !req.body.topic || !req.body.sys) {
        return res.status(400).json({
            error: "Bad request: Missing request body",
        });
    }

    if (req.body.sys != "graded" && req.body.sys != "practice") {
        res.status(400).json({
            error: "Bad request: Invalid grading system",
        });
    }

    const classId = await getLessonClass(parseInt(req.body.lessonId));

    if (!classId) {
        return res.status(404).json({
            error: "Not found: The lesson with the specified class ID could not be found",
        });
    }

    const user = await verifyIfUserExists(req.user.uid);

    if (!user) {
        return res.status(404).json({
            error: "Not found: User not found",
        });
    }

    const verifiedTeacher = await verifyClassTeacher(classId, user.id);

    if (!verifiedTeacher) {
        return res.status(403).json({
            error: "Forbidden: The user may not access this resource",
        });
    }

    const assessmentExists = await checkIfAssessmentExists(req.body.lessonId);

    if (assessmentExists) {
        return res.status(409).json({
            error: 'Conflict: An assessment already exists for this lesson'
        })
    }

    const assessmentId = await createAssessment(
        parseInt(req.body.lessonId),
        req.body.topic,
        req.body.sys
    );

    if (!assessmentId) {
        return res.status(500).json({
            error: 'Internal server error: Assessment creation failed'
        })
    }

    res.status(201).json({
        assessmentId: assessmentId
    })
};

// TODO: you left here. use getUpcomingAssessments and create and endpoint for that now.

export { getDayLessons, updateLesson, getAllTimes, createNewAssessment };
