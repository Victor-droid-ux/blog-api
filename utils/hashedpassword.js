const bcrypt = require("bcryptjs")

const hashpassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(15, (err, salt) => {
            if (err) return reject(err);

            bcrypt.hash(password, salt, (err, hashed) => {
                if (err) return reject(err);

                resolve(hashed);
            })
        })
    })
} 
module.exports = hashpassword