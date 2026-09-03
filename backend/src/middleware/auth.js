const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || (!header.startsWith('Bearer ') && !header.startsWith('JWT '))) {
    return res.status(401).json({ message: 'Missing auth token' });
  }

  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid auth token' });
  }
};

module.exports = auth;
