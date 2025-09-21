import e from "express";
import verifyFirebaseToken from "../../middleware/auth.middleware.js";
import { 
    getLessonDetails,
    getLessonsPerDay
} from "../../controllers/student/lessons.controller.js";

const studentRouter = e.Router();

studentRouter.get("/lessons/get", verifyFirebaseToken, getLessonsPerDay);
studentRouter.get("/lessons/details", verifyFirebaseToken, getLessonDetails);

export default studentRouter;