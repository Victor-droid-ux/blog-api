const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const { connect } = require("mongoose");

const {
  PORT,
  CONNECTION_URL,
  JWT_SECRET,
  SENDER_EMAIL,
  EMAIL_PASSWORD,
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
  senderEmail: SENDER_EMAIL,
  emailPassword: EMAIL_PASSWORD,
  awsAccessKeyId: AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: AWS_SECRET_ACCESS_KEY,
  awsBucketName: AWS_BUCKET_NAME,
  awsRegion: AWS_REGION,
 
};
