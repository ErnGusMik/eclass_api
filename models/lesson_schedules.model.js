import pool from "../config/db.js";

const createSchedule = async (
    classId,
    weekday,
    time,
    name,
    exceptions,
    duration,
    room
) => {
    const scheduleId = await pool.query(
        "INSERT INTO lesson_schedules (class_id, weekday, time, name, exceptions, duration, room) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [classId, weekday, time, name, exceptions, duration, room]
    );
    if (scheduleId.rowCount == 1) {
        return scheduleId.rows[0];
    }
    return false;
};

const getSchedule = async (scheduleId) => {
    const schedule = await pool.query(
        "SELECT * FROM lesson_schedules WHERE id = $1",
        [scheduleId]
    );
    if (schedule.rowCount != 1) {
        return false;
    }
    return schedule.rows[0];
};

const generateLessons = async (scheduleId) => {
    const schedule = await getSchedule(scheduleId);

    const currentTime = new Date(schedule.time);
    let currentDate = getNextWeekday(schedule.weekday);
    currentDate.setHours(currentTime.getHours(), currentTime.getMinutes());
    let finalDate;

    if (Date.now() > Date(Date.now().getFullYear(), 6, 30)) {
        finalDate = Date(Date.now().getFullYear() + 1, 6, 30);
    } else {
        finalDate = Date(Date.now().getFullYear(), 6, 30);
    }

    try {
        const client = await pool.connect();
        await client.query("BEGIN");

        while (currentDate < finalDate) {
            client.query(
                "INSERT INTO lessons (class_id, room, created_at, schedule_id, datetime, duration) VALUES ($1, $2, NOW(), $3, $4, $5) ON CONFLICT DO NOTHING",
                [
                    schedule.class_id,
                    schedule.room,
                    schedule.id,
                    currentDate,
                    schedule.duration,
                ]
            );
            currentDate = Date(currentDate.getTime() + 1000 * 60 * 60 * 24 * 7); // adds a week
        }
        client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        console.log(e);
        client.release();
        return false;
    } finally {
        client.release();
        return true;
    }
};

export { createSchedule, generateLessons, getSchedule };


// helpers
const getNextWeekday = (weekday) => {
    const today = new Date();
    const todayWeekday = today.getDate();
    const diff = (weekday + 7 - todayWeekday) % 7 || 7;
    const nextWeekday = new Date(today);
    nextWeekday.setDate(today.getDate() + diff);
    return nextWeekday;
}