import { getUploadsForNotice } from "../models/notice_uploads.model.js";
import { getTeacherNotice } from "../models/notices.model.js";
import { getName, verifyIfUserExists } from "../models/users.model.js";

const getSpecificNotice = async (req, res, next) => {
    if (!req.query.id) {
        return res.status(400).json({
            error: "Bad request: Missing query parameters",
        });
    }
    const user = await verifyIfUserExists(req.user.uid);

    if (user.role == "teacher") {
        const notice = await getTeacherNotice(user.id, req.query.id);
        if (!notice) {
            return res.status(404).json({
                error: "Not found: The requested notice was not found in the user's classes",
            });
        }
        const uploads = await getUploadsForNotice(notice.id);

        let authorName = ''
        if (notice.author_id == user.id) {
            authorName = req.user.name
        } else {
            authorName = await getName(notice.author_id);
            if (!authorName) {
                authorName = 'A fellow teacher';
            }
        }
        const noticeToSend = {
            title: notice.title,
            author: authorName,
            content: notice.content,
            tags: notice.tags,
            date: notice.created_at,
            uploads: [],
        }

        for (const file of uploads) {
            noticeToSend.uploads.push({
                name: file.original_name,
                size: file.file_size,
                location: '/uploads/' + file.file_name,
                mimetype: file.mime_type
            })
        }
        
        res.json(noticeToSend);

    }
};

export { getSpecificNotice };
