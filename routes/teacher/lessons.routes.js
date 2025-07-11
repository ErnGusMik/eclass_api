// everything with lessons -- assignments, topics, hw, cancellations, attendance, teacher uploads, get student uploads

import e from "express";
import verifyFirebaseToken from './../../middleware/auth.middleware.js'
import { createNewAssessment, getAllTimes, getAllUpcomingAssessments, getDayLessons, updateLesson } from "../../controllers/teacher/lessons.controller.js";

const teacherLessonRouter = e.Router();

teacherLessonRouter.get('/', (req, res) => res.send('teacherLessonRouter'))
teacherLessonRouter.get('/get/date', verifyFirebaseToken, getDayLessons)
teacherLessonRouter.put('/update', verifyFirebaseToken, updateLesson)
teacherLessonRouter.get('/get/all', verifyFirebaseToken, getAllTimes)
teacherLessonRouter.post('/assessment/create', verifyFirebaseToken, createNewAssessment)
teacherLessonRouter.get('/assessment/getUpcoming', verifyFirebaseToken, getAllUpcomingAssessments)

export default teacherLessonRouter;