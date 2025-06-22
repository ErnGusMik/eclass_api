import pool from "../config/db.js";

const uploadWithNotice = async (
    originalName,
    filename,
    size,
    mimetype,
    noticeId
) => {
    const fileId = await pool.query(
        "INSERT INTO notice_uploads (notice_id, file_name, file_size, original_name, mime_type, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id",
        [noticeId, filename, size, originalName, mimetype]
    );
    return fileId.rows[0].id;
};
