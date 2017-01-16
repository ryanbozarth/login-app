const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    moto: {
        type: String
    },
    level: {
        type: String
    },
    location: {
        type: String
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
