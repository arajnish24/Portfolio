import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certificate from '../models/Certificate.js';
import Blog from '../models/Blog.js';
import Gallery from '../models/Gallery.js';
import Analytics from '../models/Analytics.js';
import Project from '../models/Project.js';
import { mockDbHelper } from '../config/mockDb.js';
import { requireAuth, requireOwner } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|svg|pdf|doc|docx/i;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetypes = /jpeg|jpg|png|gif|webp|svg|pdf|msword|wordprocessingml/i;
    const mimetype = mimetypes.test(file.mimetype);
    if (mimetype || extname) {
      return cb(null, true);
    }
    cb(new Error('Supported formats: jpg, jpeg, png, gif, webp, svg, pdf, doc, docx'));
  }
});

// @route   POST /api/portfolio/upload
// @desc    Upload project screenshot or profile avatar
router.post('/upload', requireAuth, requireOwner, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({
      message: 'File uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ message: 'Server error during upload' });
  }
});

// Helper: Log visitor analytics in background
export const logAnalytics = async (req, actionType, details = {}) => {
  try {
    const useMock = mongoose.connection.readyState !== 1;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const browser = req.headers['user-agent']?.includes('Firefox') ? 'Firefox' : 'Chrome';
    const os = req.headers['user-agent']?.includes('Macintosh') ? 'MacOS' : 'Windows';
    const device = req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop';
    
    const analyticsData = {
      ip,
      country: 'United States', // Stub country for local validation
      device,
      browser,
      os,
      actionType,
      timestamp: new Date().toISOString(),
      ...details
    };

    if (useMock) {
      mockDbHelper.saveToCollection('analytics', analyticsData);
    } else {
      const log = new Analytics(analyticsData);
      await log.save();
    }
  } catch (error) {
    console.error('Analytics log failure:', error);
  }
};

// @route   GET /api/portfolio/owner
// @desc    Get owner's public portfolio data (All sections)
router.get('/owner', async (req, res) => {
  try {
    const useMock = mongoose.connection.readyState !== 1;
    let owner;
    let skills = [], experiences = [], educations = [], certificates = [], blogs = [], gallery = [], projects = [];

    if (useMock) {
      const users = mockDbHelper.getCollection('users');
      owner = users.find(u => u.role === 'Owner');
      
      if (owner) {
        // Increment visitor counter
        owner.visitorCount = (owner.visitorCount || 0) + 1;
        mockDbHelper.saveToCollection('users', owner);

        const filterOwnerItems = (col) => mockDbHelper.getCollection(col).filter(x => x.ownerId === owner._id);
        skills = filterOwnerItems('skills');
        experiences = filterOwnerItems('experience');
        educations = filterOwnerItems('education');
        certificates = filterOwnerItems('certificates');
        blogs = filterOwnerItems('blogs').filter(b => b.status === 'published');
        gallery = filterOwnerItems('gallery');
        projects = filterOwnerItems('projects');
      }
    } else {
      owner = await User.findOne({ role: 'Owner' }).select('-password');
      if (owner) {
        const query = { ownerId: owner._id };
        skills = await Skill.find(query);
        experiences = await Experience.find(query);
        educations = await Education.find(query);
        certificates = await Certificate.find(query);
        blogs = await Blog.find({ ...query, status: 'published' });
        gallery = await Gallery.find(query);
        projects = await Project.find(query);
      }
    }

    if (!owner) {
      return res.status(404).json({ message: 'Portfolio owner not found' });
    }

    // Log Analytics view in background
    await logAnalytics(req, 'profile_view');

    return res.json({
      owner,
      skills,
      experiences,
      educations,
      certificates,
      blogs,
      gallery,
      projects
    });

  } catch (error) {
    console.error('Fetch public portfolio error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/portfolio/profile
// @desc    Update owner's profile info
router.put('/profile', requireAuth, requireOwner, async (req, res) => {
  const updateData = req.body;
  delete updateData.portfolioToken; // Avoid manual token change

  try {
    const useMock = mongoose.connection.readyState !== 1;
    let updatedUser;

    if (useMock) {
      const users = mockDbHelper.getCollection('users');
      const user = users.find(u => u._id === req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      Object.assign(user, updateData);
      mockDbHelper.saveToCollection('users', user);
      updatedUser = user;
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true }
      ).select('-password');
    }

    return res.json({
      message: 'Portfolio details updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/portfolio/appearance
// @desc    Update owner's appearance settings (theme, font, accent, layout)
router.put('/appearance', requireAuth, requireOwner, async (req, res) => {
  const { theme, accentColor, fontFamily, layout, animationsEnabled } = req.body;

  try {
    const useMock = mongoose.connection.readyState !== 1;
    const settings = { theme, accentColor, fontFamily, layout, animationsEnabled };
    let updatedUser;

    if (useMock) {
      const users = mockDbHelper.getCollection('users');
      const user = users.find(u => u._id === req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.themeSettings = { ...(user.themeSettings || {}), ...settings };
      mockDbHelper.saveToCollection('users', user);
      updatedUser = user;
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { themeSettings: settings } },
        { new: true }
      ).select('-password');
    }

    return res.json({
      message: 'Appearance configurations synced successfully',
      themeSettings: updatedUser.themeSettings
    });

  } catch (error) {
    console.error('Update appearance error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/portfolio/track-download
// @desc    Log a resume download event
router.post('/track-download', async (req, res) => {
  try {
    await logAnalytics(req, 'resume_download');
    return res.json({ message: 'Download tracked successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error tracking event' });
  }
});

export default router;
