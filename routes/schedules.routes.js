// everything to do with schedules -- creation, lesson generation, getting, etc.

import e from 'express';
import verifyFirebaseToken from '../middleware/auth.middleware.js';
import { createNewSchedule, getAllSchedules } from '../controllers/schedules.controllers.js';

const scheduleRouter = e.Router();

scheduleRouter.get('/', (req, res, next) => res.send('scheduleRouter'));
scheduleRouter.post('/new', verifyFirebaseToken, createNewSchedule);
scheduleRouter.get('/getForClass', verifyFirebaseToken, getAllSchedules)

export default scheduleRouter;