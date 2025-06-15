const mongoose = require("mongoose");
const {connectionUrl} = require("../config/kyes");


const connectToMongoDB = async () => {
    try {
        await mongoose.connect(connectionUrl)
        console.log('Connected to MongoDB');
    }catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Re-throw the error to be handled by the caller
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = connectToMongoDB;