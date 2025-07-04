import { verifyClassTeacher } from "../../models/class_teachers.model.js";
import { getLessonsInDay } from "../../models/lessons.model.js"
import { verifyIfUserExists } from "../../models/users.model.js"

const getDayLessons = async (req, res, next) => {
    if (!req.query || !req.query.date || !req.query.classId) {
        return res.status(400).json({
            error: 'Bad request: Missing query parameters'
        })
    }

    const verifiedRole = await verifyIfUserExists(req.user.uid);

    if (verifiedRole.role != 'teacher') {
        return res.status(403).json({
            error: "Forbidden: Users with this role may not access this endpoint"
        })
    }

    const verifiedTeacher = await verifyClassTeacher(req.query.classId, verifiedRole.id);

    if (!verifiedTeacher) {
        return res.status(403).json({
            error: 'Forbidden: This user is not affiliated to this class'
        })
    }

    const lessons = await getLessonsInDay(req.query.date, req.query.classId);

    res.json({
        lessons: lessons,
    })
}

export {
    getDayLessons
}