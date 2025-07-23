const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/kyes");

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        code: 401,
        status: false,
        message: "Unauthorized: Token is missing or invalid format"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);

    req.user = {
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    };

    return next(); // recommended
  } catch (error) {
    const isExpired = error.name === "TokenExpiredError";

    return res.status(401).json({
      code: 401,
      status: false,
      message: isExpired ? "Token expired" : "Unauthorized: Invalid token",
      error: error.message
    });
  }
};

module.exports = isAuth;
