import { fileTypeFromBuffer } from "file-type";

function log(message) {
    console.log(`[${new Date().toTimeString().split(' ')[0]}] ${message}`);
}

function sendFailedResponse(res, message, status) {
    return res.status(status).json({ message: message, status: 'failed' }).end();
}

async function parseBill(req){
    const BillCopy = req.files?.BillCopy[0];
    if (!BillCopy || !BillCopy.data) {
        sendFailedResponse(res, 'Bill copy not found', 400);
        return false;
    }
    const buffer = BillCopy.data;

    // Use the file-type library to get the actual file type
    const type = await fileTypeFromBuffer(buffer);

    if (!type || type.mime !== 'application/pdf') {
        sendFailedResponse(res, 'Invalid file type', 400);
        return false;
    }

    return true;
}
export { log, sendFailedResponse, parseBill };