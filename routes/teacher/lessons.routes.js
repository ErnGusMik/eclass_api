// everything with lessons -- assignments, topics, hw, cancellations, attendance, teacher uploads, get student uploads

import e from "express";
import verifyFirebaseToken from './../../middleware/auth.middleware.js'
import { createNewAssessment, deleteLessonAssessment, getAllTimes, getAllUpcomingAssessments, getAttendance, getDayLessons, updateAssessmentSystem, updateAttendance, updateLesson, updateLessonAssessment } from "../../controllers/teacher/lessons.controller.js";

const teacherLessonRouter = e.Router();

teacherLessonRouter.get('/', (req, res) => res.send('teacherLessonRouter'))
teacherLessonRouter.get('/get/date', verifyFirebaseToken, getDayLessons)
teacherLessonRouter.put('/update', verifyFirebaseToken, updateLesson)
teacherLessonRouter.get('/get/all', verifyFirebaseToken, getAllTimes)
teacherLessonRouter.post('/assessment/create', verifyFirebaseToken, createNewAssessment)
teacherLessonRouter.get('/assessment/getUpcoming', verifyFirebaseToken, getAllUpcomingAssessments)
teacherLessonRouter.delete('/assessment/delete', verifyFirebaseToken, deleteLessonAssessment)
teacherLessonRouter.put('/assessment/update', verifyFirebaseToken, updateLessonAssessment)
teacherLessonRouter.put('/assessment/update/system', verifyFirebaseToken, updateAssessmentSystem)
teacherLessonRouter.get('/attendance/get', verifyFirebaseToken, getAttendance)
teacherLessonRouter.put('/attendance/update', verifyFirebaseToken, updateAttendance)

export default teacherLessonRouter;