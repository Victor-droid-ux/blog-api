const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file



const { connect } = require("mongoose");

const PORT  = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;

//  This module exports the PORT variable from the environment.
module.exports = {port: PORT, connectionUrl: CONNECTION_URL};

