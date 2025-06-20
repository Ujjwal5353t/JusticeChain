const mongoose = require('mongoose');

const CitizenSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Citizen', CitizenSchema);
