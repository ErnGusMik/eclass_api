import { createSchedule, generateLessons } from "../../models/lesson_schedules.model.js";

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

export { createNewSchedule };
