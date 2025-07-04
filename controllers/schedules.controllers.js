import { createSchedule, generateLessons, getSchedulesForClass } from "../models/lesson_schedules.model.js";
import { verifyIfUserExists } from "../models/users.model.js";

const createNewSchedule = async (req, res, next) => {
    if (
        !req.body ||
        !req.body.classId ||
        !req.body.weekday ||
        !req.body.time ||
        !req.body.name ||
        !req.body.exceptions ||
        !req.body.duration ||
        !req.body.room
    ) {
        return res.status(400).json({
            error: "Bad request: Missing request body parameters.",
        });
    }

    const user = await verifyIfUserExists(req.user.uid);
    if (user.role != 'teacher') return res.status(403).json({
        error: "Forbidden: Users with the role" + user.role + ' may not access this endpoint'
    })

    const schedule = await createSchedule(
        req.body.classId,
        req.body.weekday,
        req.body.time,
        req.body.name,
        req.body.exceptions,
        req.body.duration,
        req.body.room,
    );

    if (!schedule) {
        return res.status(500).json({
            error: 'Internal server error: Schedule creation failed'
        });
    }

    if (req.query.generate == 'true') {
        const generated = await generateLessons(schedule.id);
        if (!generated) {
            return res.status(500).json({
                error: 'Internal server error: Lesson generation failed'
            })
        }
    }
    res.sendStatus(201);
};

const getAllSchedules = async (req, res, next) => {
    if (!req.query || !req.query.id) {
        return res.status(400).json({
            error: 'Bad request: Missing query parameters'
        })
    }

    const schedules = await getSchedulesForClass(req.query.id);

    return res.json({
        schedules: schedules
    })
}

export { createNewSchedule, getAllSchedules };
