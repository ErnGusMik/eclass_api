// everything with classes -- overview, assessments, students, settings, lesson schedule, new class

import e from "express";

const teacherClassRouter = e.Router();

teacherClassRouter.get('/', (req, res) => res.send('teacherClassRouter'))


export default teacherClassRouter;