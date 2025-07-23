const isAdmin = (req, res, next) => {
  try {
    if (req.user && (req.user.role === 1 || req.user.role === 2)) return next();
    else return res.status(401).json({ message: "Not authorized" });
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;
