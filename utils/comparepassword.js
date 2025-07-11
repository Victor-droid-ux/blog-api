const bcrypt = require('bcryptjs');


const comparePassword = async function (password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        throw new Error("Error comparing password");
    }
};

module.exports = comparePassword;
// This function compares a plain text password with a hashed password