function log(message) {
    console.log(`[${new Date().toTimeString().split(' ')[0]}] ${message}`);
}
export { log };