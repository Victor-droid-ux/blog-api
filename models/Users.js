const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: Number,
        default: 3 // Default role set to 3 (user)
    }
}, { timestamps: true }); // <-- Pass as second argument

module.exports = mongoose.model('User', userSchema);