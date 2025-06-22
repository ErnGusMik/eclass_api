// everything with teachers'dashboard -- getAll, etc.
import e from "express";
import upload from './../../config/multer.js'
import verifyFirebaseToken from "../../middleware/auth.middleware.js";
import { createNotice, getRelevantNotices } from "../../controllers/teacher/teacher.controller.js";

const teacherRouter = e.Router();

teacherRouter.get('/', (req, res) => res.send('teacherRouter'))

teacherRouter.get('/notices/getAll', verifyFirebaseToken, getRelevantNotices)
teacherRouter.post('/notices/create', verifyFirebaseToken, upload.array('files'), createNotice)

export default teacherRouter;