// roleMiddleware.js

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      // Assuming that the user is authenticated and their role is attached to req.user
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient permissions' });
      }
      next();
    };
  };
  
  module.exports = roleMiddleware;
  