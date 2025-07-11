const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
require ('dotenv').config();

const connectToMongoDB = require('./init/mongodb');
const { authRoute } = require("./routes");
const { errorHandler } = require("./middlewares");
const notfound = require("./controllers/notfound");

const app = express();

// Connect to MongoDB
connectToMongoDB()
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit the process if connection fails
  });

app.use(express.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(morgan("dev"));

// Register your routes
app.use("/api/v1/auth", authRoute);

// Error handler middleware (should be after routes)
app.use(errorHandler);

// Not found route (should be last)
app.use(/.*/, notfound);

module.exports = app;