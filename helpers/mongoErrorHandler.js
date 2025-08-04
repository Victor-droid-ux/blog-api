// helpers/mongoErrorHandler.js

module.exports = (err, res) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    return res.status(400).json({
      status: false,
      code: 400,
      message: `The ${field} "${value}" is already in use. Try something else.`,
    });
  }

  return res.status(500).json({
    status: false,
    code: 500,
    message: "Internal Server Error",
    error: err.message,
  });
};
