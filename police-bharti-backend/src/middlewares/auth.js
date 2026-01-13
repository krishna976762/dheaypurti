// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Teacher = require('../models/teacher');

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.replace('Bearer ', '').trim();
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    let account = null;

    // ✅ Try fetching from correct model based on role
    if (payload.role === 'owner' || payload.role === 'admin') {
      account = await User.findById(payload.id);
    } else if (payload.role === 'teacher') {
      account = await Teacher.findById(payload.id);
    }

    if (!account)
      return res.status(401).json({ message: 'Invalid token - user not found' });

    if (account.isActive === false)
      return res.status(403).json({ message: 'Account disabled' });

    req.user = {
      id: account._id.toString(),
      role: payload.role,
      ...account.toObject(),
    };

    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ message: 'Authentication failed', error: err.message });
  }
};

// ✅ Role-based restriction
const requireRole = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Insufficient permissions' });
  next();
};

// ✅ Allow owner or self
const requireOwnerOrSelf = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role === 'owner') return next();
  if (req.user.role === 'teacher' && req.user.id === req.params.id) return next();
  return res.status(403).json({ message: 'Forbidden' });
};

module.exports = { auth, requireRole, requireOwnerOrSelf };
