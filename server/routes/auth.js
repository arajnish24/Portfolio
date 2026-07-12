import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { mockDbHelper } from '../config/mockDb.js';
import { requireAuth, requireOwner } from '../middlewares/authMiddleware.js';
import { sendEmail } from '../config/mailer.js';

const router = express.Router();

// Helper: Generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'supersecretjwtkey_portfoliox_2026',
    { expiresIn: '30d' }
  );
};

// Helper: Generate Portfolio Verification Token
const generatePortfolioToken = () => {
  const segment1 = Math.floor(1000 + Math.random() * 9000);
  const segment2 = Math.floor(1000 + Math.random() * 9000);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let segment3 = '';
  for (let i = 0; i < 4; i++) {
    segment3 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PX-${segment1}-${segment2}-${segment3}`;
};

// Helper: Generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route   POST /api/auth/signup
// @desc    Register a new user (Owner/Visitor)
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const useMock = mongoose.connection.readyState !== 1;
    let existingUser;

    if (useMock) {
      existingUser = mockDbHelper.getCollection('users').find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set roles: first registered user becomes Owner if no Owner exists, or respect role request
    let selectedRole = role || 'Visitor';
    if (useMock) {
      const allUsers = mockDbHelper.getCollection('users');
      const hasOwner = allUsers.some(u => u.role === 'Owner');
      if (!hasOwner) selectedRole = 'Owner';
    } else {
      const ownerCount = await User.countDocuments({ role: 'Owner' });
      if (ownerCount === 0) selectedRole = 'Owner';
    }

    const verificationOTP = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Encrypted or clear portfolio token generated for Owner
    let portfolioToken = '';
    if (selectedRole === 'Owner') {
      portfolioToken = generatePortfolioToken();
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: selectedRole,
      isVerified: false,
      emailVerifyOTP: verificationOTP,
      emailVerifyOTPExpires: otpExpires,
      portfolioToken,
      profession: selectedRole === 'Owner' ? 'Lead MERN Developer' : '',
      bio: '',
      profileImage: '',
      themeSettings: {
        theme: 'dark',
        accentColor: '#3b82f6',
        fontFamily: 'Inter',
        layout: 'glass',
        animationsEnabled: true
      }
    };

    let user;
    if (useMock) {
      userData._id = 'u_' + Math.random().toString(36).substr(2, 9);
      user = mockDbHelper.saveToCollection('users', userData);
      mockDbHelper.saveOtp(email.toLowerCase(), verificationOTP, otpExpires.getTime());
    } else {
      user = new User(userData);
      await user.save();
      mockDbHelper.saveOtp(email.toLowerCase(), verificationOTP, otpExpires.getTime());
    }



    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Registration successful. Verification OTP sent.',
      token,
      mockOtp: verificationOTP, // For easy local evaluation
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        portfolioToken: user.portfolioToken
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Log in user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const useMock = mongoose.connection.readyState !== 1;
    let user;

    if (useMock) {
      user = mockDbHelper.getCollection('users').find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        portfolioToken: user.portfolioToken,
        themeSettings: user.themeSettings || { theme: 'dark', accentColor: '#3b82f6' }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email address using 6-digit OTP
router.post('/verify-email', requireAuth, async (req, res) => {
  const { otp } = req.body;
  const email = req.user.email.toLowerCase();

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  try {
    const isValid = mockDbHelper.verifyOtp(email, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const useMock = mongoose.connection.readyState !== 1;
    let updatedUser;

    if (useMock) {
      const users = mockDbHelper.getCollection('users');
      const user = users.find(u => u._id === req.user._id);
      if (user) {
        user.isVerified = true;
        mockDbHelper.saveToCollection('users', user);
        updatedUser = user;
      }
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { isVerified: true },
        { new: true }
      ).select('-password');
    }

    return res.json({
      message: 'Email verified successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        portfolioToken: updatedUser.portfolioToken
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/regenerate-token
// @desc    Regenerate portfolio verification token (Requires Owner + password verification)
router.post('/regenerate-token', requireAuth, requireOwner, async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password verification required to regenerate token' });
  }

  try {
    const isMatch = await bcrypt.compare(password, req.user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password. Verification failed.' });
    }

    // Generate token
    const newToken = generatePortfolioToken();

    const useMock = mongoose.connection.readyState !== 1;
    let updatedUser;

    if (useMock) {
      const users = mockDbHelper.getCollection('users');
      const user = users.find(u => u._id === req.user._id);
      if (user) {
        user.portfolioToken = newToken;
        mockDbHelper.saveToCollection('users', user);
        updatedUser = user;
      }
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { portfolioToken: newToken },
        { new: true }
      ).select('-password');
    }

    return res.json({
      message: 'Portfolio verification token regenerated successfully',
      portfolioToken: updatedUser.portfolioToken
    });

  } catch (error) {
    console.error('Regenerate token error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request forgot password OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const useMock = mongoose.connection.readyState !== 1;
    let user;

    if (useMock) {
      user = mockDbHelper.getCollection('users').find(u => u.email.toLowerCase() === email.toLowerCase());
    } else {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    mockDbHelper.saveOtp(email.toLowerCase(), otp, expires.getTime());


    // Dispatch live email to admin/owner
    const mailResult = await sendEmail({
      to: user.email.toLowerCase().trim(),
      fromName: 'PortfolioX Security',
      subject: '[PortfolioX] Password Reset Verification Code',
      html: `
        <div style="font-family: sans-serif; padding: 25px; color: #333; max-width: 500px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #eff6ff; padding-bottom: 12px; margin-top: 0; font-weight: 800;">Password Reset Request</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.5;">You requested a password reset for your PortfolioX administrator dashboard. Please use the following 6-digit verification code to reset your password:</p>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #1e293b; font-family: monospace;">${otp}</span>
          </div>
          <p style="font-size: 12px; color: #64748b; line-height: 1.5;">This verification code is valid for <strong>10 minutes</strong>. If you did not make this request, please secure your credentials immediately.</p>
          <p style="font-size: 10px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 12px;">This is an automated security notification from your PortfolioX secure platform.</p>
        </div>
      `
    });

    if (mailResult && mailResult.success === false) {
      return res.status(500).json({
        message: `Failed to send password reset email: ${mailResult.error}`
      });
    }

    return res.json({
      message: 'Password reset OTP sent to email',
      mockOtp: otp // Developer helper
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  try {
    const isValid = mockDbHelper.verifyOtp(email.toLowerCase(), otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const useMock = mongoose.connection.readyState !== 1;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (useMock) {
      const users = mockDbHelper.getCollection('users');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        user.password = hashedPassword;
        mockDbHelper.saveToCollection('users', user);
      }
    } else {
      await User.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashedPassword });
    }

    return res.json({ message: 'Password reset successfully. You can now login.' });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/send-project-otp
// @desc    Generate and send dynamic project creation OTP to admin's email
router.post('/send-project-otp', requireAuth, requireOwner, async (req, res) => {
  try {
    const email = req.user.email.toLowerCase();
    const otp = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save project OTP using namespace key
    mockDbHelper.saveOtp(`project_${email}`, otp, expires.getTime());


    // Send email
    const mailResult = await sendEmail({
      to: req.user.email.toLowerCase().trim(),
      fromName: 'PortfolioX Security',
      subject: '[PortfolioX] Project Upload Authorization Credentials',
      html: `
        <div style="font-family: sans-serif; padding: 25px; color: #333; max-width: 500px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #eff6ff; padding-bottom: 12px; margin-top: 0; font-weight: 800;">Project Authorization Required</h2>
          <p style="font-size: 14px; color: #475569; line-height: 1.5;">You are attempting to publish or modify a project in your portfolio. Please use the following credentials to complete this transaction:</p>
          
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 12px; margin: 20px 0; background-color: #f8fafc;">
            <tr>
              <td style="padding: 12px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Portfolio Token (Static)</td>
              <td style="padding: 12px; font-size: 13px; font-weight: bold; color: #0f172a; font-family: monospace; text-align: right; border-bottom: 1px solid #e2e8f0;">${req.user.portfolioToken}</td>
            </tr>
            <tr>
              <td style="padding: 12px; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Verification Code (OTP)</td>
              <td style="padding: 12px; font-size: 18px; font-weight: 800; color: #3b82f6; font-family: monospace; text-align: right;">${otp}</td>
            </tr>
          </table>

          <p style="font-size: 12px; color: #64748b; line-height: 1.5;">These codes are valid for <strong>10 minutes</strong>. If you did not initiate this project update, please ignore this email.</p>
          <p style="font-size: 10px; color: #94a3b8; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 12px;">This is an automated security notification from your Portfolio secure platform.</p>
        </div>
      `
    });

    if (mailResult && mailResult.success === false) {
      return res.status(500).json({
        message: `Failed to send verification OTP email: ${mailResult.error}`
      });
    }

    return res.json({
      message: 'Project verification OTP sent to email',
      mockOtp: otp // Developer helper
    });

  } catch (error) {
    console.error('Send project OTP error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/verify-project-token
// @desc    Verifies portfolio token + email OTP (Used before project form opens)
router.post('/verify-project-token', requireAuth, requireOwner, (req, res) => {
  const { token, emailOtp } = req.body;
  
  if (!token) {
    return res.status(400).json({ message: 'Portfolio Verification Token is required' });
  }
  if (!emailOtp) {
    return res.status(400).json({ message: 'Email Verification OTP is required' });
  }

  if (token !== req.user.portfolioToken) {
    return res.status(401).json({ 
      message: '🔴 TOKEN VERIFICATION REJECTED: Invalid Portfolio Token. You are not authorized to edit projects.' 
    });
  }

  // Verify dynamic OTP
  const email = req.user.email.toLowerCase();
  const isOtpValid = mockDbHelper.verifyOtp(`project_${email}`, emailOtp);
  if (!isOtpValid) {
    return res.status(401).json({
      message: '🔴 OTP VERIFICATION REJECTED: Invalid or expired email OTP. Please try again.'
    });
  }

  return res.json({ 
    message: '✔ TOKEN & OTP VERIFICATION APPROVED: Authorized successfully.', 
    verified: true 
  });
});

export default router;
