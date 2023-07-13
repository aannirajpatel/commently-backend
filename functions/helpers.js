const crypto = require("crypto");
const hashed = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex');
}

module.exports = { hashed };