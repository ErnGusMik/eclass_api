import { uploadWithNotice } from "../../models/notice_uploads.model.js";
import { getNoticesForTeacher, postNotice } from "../../models/notices.model.js";
import { getName, verifyIfUserExists } from "../../models/users.model.js";

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
 // TODO: you left here... do this now!
    const user = await verifyIfUserExists(req.user.uid);
    const notices = await getNoticesForTeacher(user.id);

    const noticesToSend = [];

    for (const notice of notices) {
        const authorName = await getName(notice.author_id);
        if (!authorName) {
            res.status(500).json({
                error: "Internal server error: Could not get authors"
            })
        }
        noticesToSend.push({
            title: notice.title,
            author: authorName,
            content: notice.content,
            tags: JSON.parse(notice.tags),
            createdAt: notice.created_at,
            id: notice.id,
        })
    }
    return res.json({
        notices: noticesToSend
    })
};



export { createNotice, getRelevantNotices };
