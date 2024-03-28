const jwt = require('jsonwebtoken');
const key = process.env.KEY;

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');


  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const tokenWithoutBearer = token.split(' ')[1];
    const decoded = jwt.verify(tokenWithoutBearer, key);

    req.user = { id: decoded.id }; 
    console.log(req.user);
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;