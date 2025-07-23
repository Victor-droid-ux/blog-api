const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const { connect } = require("mongoose");

const {
  PORT,
  CONNECTION_URL,
  JWT_SECRET,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_REGION,
} = process.env;

//  This module exports the PORT variable from the environment.
module.exports = {
  port: PORT,
  connectionUrl: CONNECTION_URL,
  jwtSecret: JWT_SECRET,
  awsAccessKeyId: AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: AWS_SECRET_ACCESS_KEY,
  awsBucketName: AWS_BUCKET_NAME,
  awsRegion: AWS_REGION,
  //  This module exports the PORT variable from the environment.
  //  connect to the database
  //   connectToDatabase: async () => {
  //     try {
  //       await connect(CONNECTION_URL, {
  //         useNewUrlParser: true,
  //         useUnifiedTopology: true,
  //       });
  //       console.log("Connected to MongoDB");
  //     } catch (error) {
  //       console.error("Error connecting to MongoDB:", error);
  //     }
  //   },
};
