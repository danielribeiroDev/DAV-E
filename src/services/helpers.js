
///:: service helpers
function formatToolName(str) {
    return str.replace(/[^a-zA-Z0-9_-]/g, '');
}

export {
    formatToolName
}