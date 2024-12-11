function log(message) {
    console.log(`[${new Date().toTimeString().split(' ')[0]}] ${message}`);
}

function sendFailedResponse(res, message, status) {
    return res.status(status).json({ message: message, status: 'failed' }).end();
}
export { log, sendFailedResponse };