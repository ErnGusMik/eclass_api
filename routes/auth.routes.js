import e from "express";
import verifyFirebaseToken from "../middleware/auth.middleware.js";
import { verifyIfUserExists } from "../models/users.model.js";

const authRouter = e.Router();

authRouter.get("/login", verifyFirebaseToken, (req, res, next) => {
    const user = verifyIfUserExists();
    if (!user) {
        res.status(404).json({
            error: "Not found: User not found. Try /auth/signup",
        });
        return;
    }
    console.log('shti works')
    res.send('info received')
});

// TODO: SWITCH LOGIC TO CONTROLLERS

export default authRouter;
