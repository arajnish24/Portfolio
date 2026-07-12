import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Project from '../models/Project.js';
import { mockDbHelper } from '../config/mockDb.js';
import { requireAuth, requireOwner } from '../middlewares/authMiddleware.js';
import { logAnalytics } from './portfolio.js';

const router = express.Router();

// Helper: Verification of portfolio token on write actions
const verifyTokenHeader = (req, res, next) => {
  const { portfolioToken } = req.body;
  
  if (!portfolioToken) {
    return res.status(401).json({ message: 'Portfolio token is required for this write operation' });
  }

  if (portfolioToken !== req.user.portfolioToken) {
    return res.status(403).json({ 
      message: '🔴 TRANSACTION ABORTED: The verification token entered is invalid.' 
    });
  }
  next();
};

// @route   GET /api/project
// @desc    Get all projects (with filtering, sorting, searching)
router.get('/', async (req, res) => {
  const { search, difficulty, sort } = req.query;

  try {
    const useMock = mongoose.connection.readyState !== 1;
    let projects = [];

    if (useMock) {
      projects = mockDbHelper.getCollection('projects');
    } else {
      projects = await Project.find().sort({ isPinned: -1, createdAt: -1 });
    }

    // Filter out hidden projects for visitors
    const isOwnerRequest = false; // Add auth check if needed
    if (!isOwnerRequest) {
      projects = projects.filter(p => !p.isHidden && p.status === 'published');
    }

    // Apply Search
    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.technologies.some(t => t.toLowerCase().includes(q))
      );
    }

    // Apply Difficulty Filter
    if (difficulty && difficulty !== 'All') {
      projects = projects.filter(p => p.difficulty === difficulty);
    }

    // Apply Sorting
    if (sort) {
      if (sort === 'likes') {
        projects.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      } else if (sort === 'views') {
        projects.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else if (sort === 'newest') {
        projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return res.json({ projects });

  } catch (error) {
    console.error('Fetch projects error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/project/:id
// @desc    Get a single project (increments visitor count)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const useMock = mongoose.connection.readyState !== 1;
    if (!useMock && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Project not found' });
    }
    let project;

    if (useMock) {
      const projects = mockDbHelper.getCollection('projects');
      project = projects.find(p => p._id === id);
      if (project) {
        project.views = (project.views || 0) + 1;
        mockDbHelper.saveToCollection('projects', project);
      }
    } else {
      project = await Project.findByIdAndUpdate(
        id, 
        { $inc: { views: 1 } }, 
        { new: true }
      );
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Log Analytics view in background
    await logAnalytics(req, 'project_click', { projectId: id });

    return res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/project
// @desc    Publish a project (Requires Owner + Portfolio Token)
router.post('/', requireAuth, requireOwner, verifyTokenHeader, async (req, res) => {
  const {
    title, description, technologies, github, live, playStore, appStore, 
    images, video, features, duration, status, teamSize, clientName, tags, difficulty, isPinned, isFeatured
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const useMock = mongoose.connection.readyState !== 1;
    const projectData = {
      ownerId: req.user._id,
      title,
      description,
      technologies: technologies || [],
      github: github || '',
      live: live || '',
      playStore: playStore || '',
      appStore: appStore || '',
      images: images || ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'],
      video: video || '',
      features: features || [],
      duration: duration || '',
      status: status || 'published',
      teamSize: teamSize || 1,
      clientName: clientName || 'Personal',
      tags: tags || [],
      difficulty: difficulty || 'Intermediate',
      views: 0,
      likes: 0,
      likedBy: [],
      downloads: 0,
      isPinned: isPinned || false,
      isHidden: false,
      isFeatured: isFeatured || false,
      createdAt: new Date().toISOString()
    };

    let project;
    if (useMock) {
      projectData._id = 'p_' + Math.random().toString(36).substr(2, 9);
      project = mockDbHelper.saveToCollection('projects', projectData);
    } else {
      project = new Project(projectData);
      await project.save();
    }

    // Add dashboard notification
    const notificationText = `Project "${project.title}" published successfully.`;
    if (useMock) {
      mockDbHelper.saveToCollection('notifications', {
        text: notificationText,
        type: 'system',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    } else {
      // Create Mongoose notification
      const Notification = mongoose.model('Notification');
      await new Notification({ text: notificationText, type: 'system' }).save();
    }

    return res.status(201).json({
      message: 'Project published successfully',
      project
    });

  } catch (error) {
    console.error('Publish project error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/project/:id
// @desc    Edit an existing project (Requires Owner + Portfolio Token)
router.put('/:id', requireAuth, requireOwner, verifyTokenHeader, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Prevent token matching manipulation
  delete updateData.portfolioToken;
  delete updateData.ownerId;

  try {
    const useMock = mongoose.connection.readyState !== 1;
    if (!useMock && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Project not found' });
    }
    let project;

    if (useMock) {
      const projects = mockDbHelper.getCollection('projects');
      project = projects.find(p => p._id === id);
    } else {
      project = await Project.findById(id);
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    let updatedProject;
    if (useMock) {
      const merged = { ...project, ...updateData };
      mockDbHelper.saveToCollection('projects', merged);
      updatedProject = merged;
    } else {
      updatedProject = await Project.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    }

    return res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/project/:id
// @desc    Delete a project (Requires Owner)
router.delete('/:id', requireAuth, requireOwner, async (req, res) => {
  const { id } = req.params;

  try {
    const useMock = mongoose.connection.readyState !== 1;
    if (!useMock && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Project not found' });
    }
    let success = false;

    if (useMock) {
      success = mockDbHelper.deleteFromCollection('projects', id);
    } else {
      const deleted = await Project.findByIdAndDelete(id);
      success = !!deleted;
    }

    if (!success) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/project/:id/like
// @desc    Toggle project likes (supports guests via IP and authenticated users)
router.post('/:id/like', async (req, res) => {
  const { id } = req.params;

  // Identify the user/visitor
  let visitorId = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  // Try optional JWT verification if auth header is present
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecretjwtkey_portfoliox_2026'
      );
      if (decoded && decoded.userId) {
        visitorId = decoded.userId;
      }
    } catch (err) {
      // If token is invalid, fallback to IP address
    }
  }

  try {
    const useMock = mongoose.connection.readyState !== 1;
    if (!useMock && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Project not found' });
    }
    let project;

    if (useMock) {
      const projects = mockDbHelper.getCollection('projects');
      project = projects.find(p => p._id === id);
    } else {
      project = await Project.findById(id);
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.likedBy) project.likedBy = [];
    const likedIndex = project.likedBy.indexOf(visitorId);

    let liked = false;
    if (likedIndex > -1) {
      project.likedBy.splice(likedIndex, 1);
      project.likes = Math.max(0, (project.likes || 1) - 1);
    } else {
      project.likedBy.push(visitorId);
      project.likes = (project.likes || 0) + 1;
      liked = true;
    }

    if (useMock) {
      mockDbHelper.saveToCollection('projects', project);
    } else {
      await project.save();
    }

    return res.json({
      likes: project.likes,
      liked
    });

  } catch (error) {
    console.error('Like project error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
