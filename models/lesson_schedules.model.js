import { parse } from "dotenv";
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

    let currentDate = getNextWeekday(schedule.weekday);
    const time = JSON.parse(schedule.time);
    currentDate.setHours(parseInt(time[0]), parseInt(time[1]));
    let finalDate;

    const exceptions = JSON.parse(schedule.exceptions);

    if (
        new Date().getTime() >
        new Date(new Date().getFullYear(), 5, 30).getTime()
    ) {
        finalDate = new Date(new Date().getFullYear() + 1, 5, 30);
    } else {
        finalDate = new Date(new Date().getFullYear(), 5, 30);
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        while (currentDate.getTime() < finalDate.getTime()) {
            let doNotAdd = false;
            for (const exception of exceptions) {
                const start = new Date(exception[0]);
                start.setHours(0, 0);
                const end = new Date(exception[1]);
                end.setHours(23, 59);
                if (start.getTime() < currentDate.getTime() && currentDate.getTime() < end.getTime()) {
                    doNotAdd = true;
                    break;
                }
            }
            if (!doNotAdd) {
                client.query(
                    "INSERT INTO lessons (class_id, room, created_at, schedule_id, datetime, duration) VALUES ($1, $2, NOW(), $3, $4, $5) ON CONFLICT DO NOTHING",
                    [
                        schedule.class_id,
                        schedule.room,
                        schedule.id,
                        new Date(currentDate),
                        schedule.duration,
                    ]
                );
            }
            currentDate.setDate(currentDate.getDate() + 7);
        }
        await client.query("COMMIT");
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

const getSchedulesForClass = async classId => {
    const schedules = await pool.query('SELECT * FROM lesson_schedules WHERE class_id = $1', [classId]);
    return schedules.rows
}

export { createSchedule, generateLessons, getSchedule, getSchedulesForClass };

// helpers
const getNextWeekday = (weekday) => {
    const today = new Date();
    const todayWeekday = today.getDay();
    const diff = (weekday + 7 - todayWeekday) % 7 || 7;
    const nextWeekday = new Date();
    nextWeekday.setDate(today.getDate() + diff);
    return nextWeekday;
};
