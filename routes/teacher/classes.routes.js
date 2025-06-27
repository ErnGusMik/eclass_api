// everything with classes -- overview, assessments, students, settings, lesson schedule, new class

import e from "express";
import verifyFirebaseToken from '../../middleware/auth.middleware.js'
import { createNewClass, getClass, getClasses } from "../../controllers/teacher/classes.controller.js";

const teacherClassRouter = e.Router();

teacherClassRouter.get('/', (req, res) => res.send('teacherClassRouter'))
teacherClassRouter.post('/new', verifyFirebaseToken, createNewClass);
teacherClassRouter.get('/get/all', verifyFirebaseToken, getClasses);
teacherClassRouter.get('/get', verifyFirebaseToken, getClass)

export default teacherClassRouter;