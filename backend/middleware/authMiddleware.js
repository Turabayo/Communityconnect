const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.user = decoded;  // Attach decoded token payload (user id) to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
