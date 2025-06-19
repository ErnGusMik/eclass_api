import { createClass } from "../models/classes.model.js";
import { createUser, verifyIfUserExists } from "../models/users.model.js";

const login = async (req, res, next) => {
    const user = await verifyIfUserExists();
    console.log(user);
    if (!user) {
        res.status(404).json({
            error: "Not found: User not found. Try /auth/signup",
        });
        return;
    }
    console.log("shti works");
    res.send("info received");
};

const signup = async (req, res, next) => {
    if (
        !req.query.role
    ) {
        res.status(400).json({
            error: "Bad request: Missing query parameters",
        });
        return;
    }
    const userID = await createUser(
        req.user.email,
        req.user.name,
        req.user.photoUrl,
        req.user.uid,
        req.query.role
    );
    if (req.query.role == "teacher") {
        if (!req.body.className || !req.body.classGrade) {
            res.status(400).json({
                error: "Bad request: Missing request body for role 'teacher'",
            });
            return;
        }
        const classCreationStatus = await createClass(
            req.body.className,
            req.body.classGrade,
            userID
        );
        console.log(classCreationStatus);
        if (classCreationStatus == 500) {
            res.status(500).json({
                error: "Internal server error: Class code generation failed",
            });
            return;
        } else if (classCreationStatus == 400) {
            res.status(400).json({
                error: "Bad request: User does not exist or does not have required role",
            });
        } else if (classCreationStatus == 201) {
            res.sendStatus(201);
        } else {
            res.status(500).json({
                error: "Internal server error"
            })
        }
    }
};

export { login, signup };
