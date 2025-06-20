import { createClass, getClassData, joinClass } from "../models/classes.model.js";
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
    if (!req.query.role) {
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
                error: "Internal server error",
            });
        }
    } else if (req.query.role == "student") {
        if (!req.body.classes || req.body.classses.length < 1) {
            return res.status(400).json({
                error: "Bad request: Missing request body for role 'student'",
            });
        }
        for (let i = 0; i < req.body.classes.length; i++) {
            const classJoined = await joinClass(req.body.classes[i], userID);
            if (classJoined == false) {
                return res.status(400).json({
                    error: "Bad request: The class with class code " + req.body.classes[i] + " doesn't exist"
                })
            }
        }
        res.sendStatus(201);
    } else {
        res.status(400).json({
            error: "Bad request: Invalid query parameter",
        });
    }
};

const getClass = async (req, res, next) => {
    if (!req.query.code || req.query.code.length != 6) {
        return res.status(400).json({
            error: "Bad request: Missing or invalid query parameters"
        })
    }
    const classData = await getClassData(req.query.code);
    if (!classData) {
        return res.status(404).json({
            error: `Not found: The class with class code ${req.query.code} was not found`
        })
    }
    return res.json({
        name: classData.class.name,
        teachers: classData.teachers.map(teacher => {
            const nameArr =  teacher.display_name.split(" ");
            return nameArr.map(name => {
                if (name == nameArr[nameArr.length -1]) return name;
                return name.substring(0, 1) + '.'
            }).join(" ");
        })
    })
}

export { login, signup, getClass };
