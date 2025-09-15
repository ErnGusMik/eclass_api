import e from "express";
import verifyFirebaseToken from "../../middleware/auth.middleware.js";
import { 
    getLessonsPerDay
} from "../../controllers/student/lessons.controller.js";

const studentRouter = e.Router();

studentRouter.get("/lessons/get", verifyFirebaseToken, getLessonsPerDay);

export default studentRouter;