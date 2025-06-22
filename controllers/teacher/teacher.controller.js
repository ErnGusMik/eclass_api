import { uploadWithNotice } from "../../models/notice_uploads.model.js";
import { postNotice } from "../../models/notices.model.js";
import { verifyIfUserExists } from "../../models/users.model.js";

const createNotice = async (req, res, next) => {
    if (!req.body || !req.body.title || !req.body.content || !req.body.tags) {
        res.status(400).json({
            error: "Bad request: Missing request body",
        });
        return;
    }
    const user = await verifyIfUserExists(req.user.uid);
    if (!user) {
        return res.status(401).json({
            error: "Unauthorized: This user was not found",
        });
    } else if (user.role != "teacher") {
        return res.status(403).json({
            error:
                "Forbidden: Users with the role " +
                user.role +
                " may not access this endpoint.",
        });
    }

    const noticeId = await postNotice(
        req.body.title,
        user.id,
        req.body.content,
        req.body.tags
    );

    if (!noticeId)
        return res.status(500).json({
            error: "Internal server error: Notice creation failed",
        });

    if (!req.files || req.files.length == 0) {
        return res.status(201).json({
            message: "Notice created with 0 uploaded files",
        });
    }

    // files
    try {
        for (const file of req.files) {
            const { originalname, filename, mimetype, size } = file;
            await uploadWithNotice(originalname, filename, size, mimetype, noticeId);
        }
        return res.status(201).json({
            message: 'Notice created and files uploaded'
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            error: 'Internal server error: File upload failed'
        })
    }
};

const getRelevantNotices = async (req, res, next) => {

};

export { createNotice, getRelevantNotices };
