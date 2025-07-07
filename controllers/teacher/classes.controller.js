import { getClassTeachers } from "../../models/class_teachers.model.js";
import { createClass, getAllClasses, getClassData, getClassFromId } from "../../models/classes.model.js";
import { verifyIfUserExists, verifyRole } from "../../models/users.model.js"

const createNewClass = async (req, res, next) => {
    if (!req.body || !req.body.name || !req.body.grade) {
        return res.status(400).json({
            error: 'Bad request: Missing request body'
        })
    }

    const user = await verifyIfUserExists(req.user.uid);
    if (!user) {
        return res.status(404).json({
            error: 'Not found: User not found'
        })
    }

    if (user.role != 'teacher') {
        return res.status(403).json({
            error: 'Forbidden: Users with the role ' + user.role + ' may not access this endpoint.'
        })
    }

    const classStatus = await createClass(req.body.name, req.body.grade, user.id);

    switch (classStatus) {
        case 400:
            return res.status(400).json({
                error: 'Bad request: User does not exist or does not have required role'
            })
        case 201:
            return res.sendStatus(201);
        default:
            return res.status(500).json({
                error: 'Internal server error: Class creation failed'
            })
    }
}

const getClasses = async (req, res, next) => {
    const user = await verifyIfUserExists(req.user.uid);
    if (!user) {
        return res.status(404).json({
            error: 'Not found: User not found'
        })
    }
    const classes = await getAllClasses(user.id);

    return res.json(classes.map(course => {
        return {
            name: course.name,
            grade: course.grade,
            id: course.id
        }
    }))
}

const getClass = async (req, res, next) => {
    const user = await verifyIfUserExists(req.user.uid);
    if (!user) return res.status(404).json({
        error: 'Not found: User not found'
    });

    if (!req.query || !req.query.id) return res.status(400).json({
        error: 'Bad request: Invalid query parameters'
    })

    const classTeachers = await getClassTeachers(req.query.id);
    if (classTeachers.rows.find((elem) => elem.id == user.id) == undefined) {
        return res.status(403).json({
            error: 'Forbidden: The user cannot access the requested class'
        })
    };

    const classData = await getClassFromId(req.query.id);
    res.json(classData[0])
}



export {
    createNewClass,
    getClasses,
    getClass
}