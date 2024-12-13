const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    actionType: { type: String, required: true }, 
    targetRole: { type: String, default: null },
    oldNickname: { type: String, default: null },
    newNickname: { type: String, default: null },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Action', actionSchema);
