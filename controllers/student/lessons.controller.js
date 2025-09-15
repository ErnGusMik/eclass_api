import { getStudentLessons } from "../../models/lessons.model.js";
import { verifyIfUserExists } from "../../models/users.model.js";

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

export {
    getLessonsPerDay
}