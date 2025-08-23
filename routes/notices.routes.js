// everything with notices -- new, read, uploads

import e from "express";
import verifyFirebaseToken from '../middleware/auth.middleware.js'
import { getLatestNotices, getSpecificNotice } from "../controllers/notices.controller.js";

const noticesRouter = e.Router();

noticesRouter.get('/get', verifyFirebaseToken, getSpecificNotice);
noticesRouter.get('/latest', verifyFirebaseToken, getLatestNotices);

export default noticesRouter;