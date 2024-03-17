const jwt = require("jsonwebtoken");
const key = process.env.KEY;

module.exports.authenticate = (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) {
    return res.status(401).json({
      verified: false,
      message: "Please login to access this page.",
    });
  }
  jwt.verify(token, key, (err, payload) => {
    if (err) {
      return res.status(401).json({
        verified: false,
        message: "There is an error with your token.",
      });
    } else {
      req.userId = payload.userId;
      next();
    }
  });
};