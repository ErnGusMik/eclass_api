import e from "express";
import verifyFirebaseToken from "../middleware/auth.middleware.js";
import { login, signup } from "../controllers/auth.controllers.js";

const authRouter = e.Router();

authRouter.get("/login", verifyFirebaseToken, login);
authRouter.post('/signup', verifyFirebaseToken, signup)


export default authRouter;
