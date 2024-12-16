import { fileTypeFromBuffer } from "file-type";

function log(message) {
    console.log(`[${new Date().toTimeString().split(' ')[0]}] ${message}`);
}

function sendFailedResponse(res, message, status) {
    return res.status(status).json({ message: message, status: 'failed' }).end();
}

async function parseBill(req, res) {
    // Check if files exist
    if (!req.files || Object.keys(req.files).length === 0||req.files.BillCopy==null) {
        sendFailedResponse(res, 'No files uploaded', 400);
        return false;
    }

    // Make sure it's an array if multiple files are uploaded
    const files = Array.isArray(req.files.BillCopy) ? req.files.BillCopy : [req.files.BillCopy];

    for (const file of files) {
        // Ensure that file.buffer is defined
        if (!file.data) {
            sendFailedResponse(res, 'File buffer is undefined', 400);
            return false;
        }

        // Check file type using 'file-type' library
        const fileType = await fileTypeFromBuffer(file.data);
        if (!fileType || fileType.mime !== 'application/pdf') {
            sendFailedResponse(res, 'All files must be PDF', 400);
            return false;
        }
    }

    return true;
}

export { log, sendFailedResponse, parseBill };