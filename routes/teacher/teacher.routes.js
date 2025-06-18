// everything with teachers'dashboard -- getAll, etc.
import e from "express";

const teacherRouter = e.Router();

teacherRouter.get('/', (req, res) => res.send('teacherRouter'))


export default teacherRouter;