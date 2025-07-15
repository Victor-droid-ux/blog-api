const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

const connectToMongoDB = require('./init/mongodb');
const { authRoute, CategoryRoute } = require("./routes");
const { errorHandler } = require("./middlewares");
const notfound = require("./controllers/notfound");

const app = express();

// Connect to MongoDB
connectToMongoDB()
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  });

app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(morgan("dev"));

// Register routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/categories", CategoryRoute); // ✅ lowercase plural

// Not found route
app.use(/.*/, notfound);

// Global error handler
app.use(errorHandler);

module.exports = app;
