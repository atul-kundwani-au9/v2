
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config');

function authenticate(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next();
  }
}

function verifyToken(token) {
  return jwt.verify(token, secretKey);
}

module.exports = {
  authenticate,
};
