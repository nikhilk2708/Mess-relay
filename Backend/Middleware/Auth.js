
const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel.js'); // Adjust the path to your User model

const authenticateUser = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    token = req.body.token || req.query.token || req.headers['x-access-token'];
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error('Error in authentication:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = { authenticateUser };
