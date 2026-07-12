import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockDbHelper } from '../config/mockDb.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'supersecretjwtkey_portfolio_2026'
    );

    const useMock = mongoose.connection.readyState !== 1;
    let user;

    if (useMock) {
      const users = mockDbHelper.getCollection('users');
      user = users.find(u => u._id === decoded.userId);
    } else {
      user = await User.findById(decoded.userId).select('-password');
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found or authorization failed' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Request not authorized' });
  }
};

export const requireOwner = (req, res, next) => {
  if (!req.user || req.user.role !== 'Owner') {
    return res.status(403).json({
      message: 'Access Denied: Only the portfolio owner can perform this action'
    });
  }
  next();
};
