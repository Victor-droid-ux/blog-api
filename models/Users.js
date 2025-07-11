const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
    },

    verificationCode: String,
    forgotPasswordCode: String,
    isVerified: {
        type: Boolean,
        default: false
    }


}, { timestamps: true }); // <-- Pass as second argument

// Add instance method to compare passwords
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};


// generateAuthToken
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: '7d' }
  );
  return token;
};

module.exports = mongoose.model('User', userSchema);