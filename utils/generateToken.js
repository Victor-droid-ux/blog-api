const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/kyes'); // Adjust the path as necessary


const generateToken = (user) => {
    const token = jwt.sign({ 
        _id: user._id,
        username: user.username,
        email: user.email, 
        role: user.role },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
    );

    return token;
};

module.exports = generateToken;
    

