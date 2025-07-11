const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file



const { connect } = require("mongoose");

const {PORT, CONNECTION_URL, JWT_SECRET,  }  = process.env


//  This module exports the PORT variable from the environment.
module.exports = {
    port: PORT, 
    connectionUrl: CONNECTION_URL,
    jwtSecret: JWT_SECRET
};

