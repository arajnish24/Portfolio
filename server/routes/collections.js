import express from 'express';
import mongoose from 'mongoose';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certificate from '../models/Certificate.js';
import Blog from '../models/Blog.js';
import Gallery from '../models/Gallery.js';
import { mockDbHelper } from '../config/mockDb.js';
import { requireAuth, requireOwner } from '../middlewares/authMiddleware.js';

const router = express.Router();

const checkDbMode = () => mongoose.connection.readyState !== 1;

// Helper to auto-create certificate from education certificate upload
const syncEducationCertificate = async (ownerId, degree, college, university, duration, certificate) => {
  if (!certificate) return;

  try {
    const isMock = checkDbMode();
    const org = college || university || 'Institution';
    
    // Extract year from duration if possible, e.g. "2018 - 2022" -> "2022"
    let date = duration || '';
    if (duration && duration.includes('-')) {
      const parts = duration.split('-');
      date = parts[parts.length - 1].trim();
    }

    if (isMock) {
      const certs = mockDbHelper.getCollection('certificates');
      const exists = certs.some(c => c.image === certificate && c.ownerId === ownerId);
      if (!exists) {
        const itemData = {
          _id: 'cert_' + Math.random().toString(36).substr(2, 9),
          ownerId,
          title: `Certificate of ${degree}`,
          organization: org,
          date,
          verificationLink: certificate,
          image: certificate,
          createdAt: new Date().toISOString()
        };
        mockDbHelper.saveToCollection('certificates', itemData);
      }
    } else {
      const exists = await Certificate.findOne({ image: certificate, ownerId });
      if (!exists) {
        const newCert = new Certificate({
          ownerId,
          title: `Certificate of ${degree}`,
          organization: org,
          date,
          verificationLink: certificate,
          image: certificate
        });
        await newCert.save();
      }
    }
  } catch (err) {
    console.error('Error syncing education certificate:', err);
  }
};

// ================= SKILLS ENDPOINTS =================
router.post('/skills', requireAuth, requireOwner, async (req, res) => {
  const { name, category, level } = req.body;
  if (!name) return res.status(400).json({ message: 'Skill name is required' });

  try {
    const isMock = checkDbMode();
    const itemData = { ownerId: req.user._id, name, category, level: level || 80 };
    let saved;

    if (isMock) {
      itemData._id = 'sk_' + Math.random().toString(36).substr(2, 9);
      saved = mockDbHelper.saveToCollection('skills', itemData);
    } else {
      saved = new Skill(itemData);
      await saved.save();
    }
    return res.status(201).json({ message: 'Skill added', skill: saved });
  } catch (err) {
    return res.status(500).json({ message: 'Error adding skill' });
  }
});

router.delete('/skills/:id', requireAuth, requireOwner, async (req, res) => {
  try {
    const isMock = checkDbMode();
    if (isMock) {
      mockDbHelper.deleteFromCollection('skills', req.params.id);
    } else {
      await Skill.findByIdAndDelete(req.params.id);
    }
    return res.json({ message: 'Skill deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting skill' });
  }
});

// ================= EXPERIENCE ENDPOINTS =================
router.post('/experience', requireAuth, requireOwner, async (req, res) => {
  const { company, position, location, joiningDate, leavingDate, responsibilities, achievements } = req.body;
  if (!company || !position || !joiningDate) return res.status(400).json({ message: 'Missing fields' });

  try {
    const isMock = checkDbMode();
    const itemData = { ownerId: req.user._id, company, position, location, joiningDate, leavingDate, responsibilities, achievements };
    let saved;

    if (isMock) {
      itemData._id = 'exp_' + Math.random().toString(36).substr(2, 9);
      saved = mockDbHelper.saveToCollection('experience', itemData);
    } else {
      saved = new Experience(itemData);
      await saved.save();
    }
    return res.status(201).json({ message: 'Experience added', experience: saved });
  } catch (err) {
    return res.status(500).json({ message: 'Error adding experience' });
  }
});

router.delete('/experience/:id', requireAuth, requireOwner, async (req, res) => {
  try {
    const isMock = checkDbMode();
    if (isMock) {
      mockDbHelper.deleteFromCollection('experience', req.params.id);
    } else {
      await Experience.findByIdAndDelete(req.params.id);
    }
    return res.json({ message: 'Experience record deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting experience' });
  }
});

router.post('/education', requireAuth, requireOwner, async (req, res) => {
  const { degree, college, university, percentage, cgpa, duration, certificate } = req.body;
  if (!degree || !college) return res.status(400).json({ message: 'Missing fields' });

  try {
    const isMock = checkDbMode();
    const itemData = { ownerId: req.user._id, degree, college, university, percentage, cgpa, duration, certificate };
    let saved;

    if (isMock) {
      itemData._id = 'edu_' + Math.random().toString(36).substr(2, 9);
      saved = mockDbHelper.saveToCollection('education', itemData);
    } else {
      saved = new Education(itemData);
      await saved.save();
    }

    if (certificate) {
      await syncEducationCertificate(req.user._id.toString(), degree, college, university, duration, certificate);
    }

    return res.status(201).json({ message: 'Education added', education: saved });
  } catch (err) {
    return res.status(500).json({ message: 'Error adding education' });
  }
});

router.delete('/education/:id', requireAuth, requireOwner, async (req, res) => {
  try {
    const isMock = checkDbMode();
    if (isMock) {
      mockDbHelper.deleteFromCollection('education', req.params.id);
    } else {
      await Education.findByIdAndDelete(req.params.id);
    }
    return res.json({ message: 'Education record deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting education' });
  }
});

// ================= CERTIFICATES ENDPOINTS =================
router.get('/certificates/:id', async (req, res) => {
  try {
    const isMock = checkDbMode();
    let certificate;
    if (isMock) {
      const items = mockDbHelper.getCollection('certificates');
      certificate = items.find(x => x._id === req.params.id);
    } else {
      certificate = await Certificate.findById(req.params.id);
    }
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    return res.json({ certificate });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching certificate' });
  }
});

router.post('/certificates', requireAuth, requireOwner, async (req, res) => {
  const { title, organization, date, verificationLink, image } = req.body;
  if (!title || !organization) return res.status(400).json({ message: 'Missing fields' });

  try {
    const isMock = checkDbMode();
    const itemData = { ownerId: req.user._id, title, organization, date, verificationLink, image };
    let saved;

    if (isMock) {
      itemData._id = 'cert_' + Math.random().toString(36).substr(2, 9);
      saved = mockDbHelper.saveToCollection('certificates', itemData);
    } else {
      saved = new Certificate(itemData);
      await saved.save();
    }
    return res.status(201).json({ message: 'Certificate added', certificate: saved });
  } catch (err) {
    return res.status(500).json({ message: 'Error adding certificate' });
  }
});

router.delete('/certificates/:id', requireAuth, requireOwner, async (req, res) => {
  try {
    const isMock = checkDbMode();
    if (isMock) {
      mockDbHelper.deleteFromCollection('certificates', req.params.id);
    } else {
      await Certificate.findByIdAndDelete(req.params.id);
    }
    return res.json({ message: 'Certificate deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting certificate' });
  }
});

// Edit Certificate
router.put('/certificates/:id', requireAuth, requireOwner, async (req, res) => {
  const { title, organization, date, verificationLink, image } = req.body;
  try {
    const isMock = checkDbMode();
    const updateData = { title, organization, date, verificationLink, image };
    let updated;
    if (isMock) {
      const items = mockDbHelper.getCollection('certificates');
      const itemIdx = items.findIndex(x => x._id === req.params.id);
      if (itemIdx !== -1) {
        items[itemIdx] = { ...items[itemIdx], ...updateData };
        const db = mockDbHelper.readDb();
        db.certificates = items;
        mockDbHelper.writeDb(db);
        updated = items[itemIdx];
      }
    } else {
      updated = await Certificate.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    }
    if (!updated) return res.status(404).json({ message: 'Certificate not found' });
    return res.json({ message: 'Certificate updated', certificate: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating certificate' });
  }
});

// ================= GALLERY ENDPOINTS =================
router.post('/gallery', requireAuth, requireOwner, async (req, res) => {
  const { title, type, url, category, description } = req.body;
  if (!url) return res.status(400).json({ message: 'Media URL is required' });

  try {
    const isMock = checkDbMode();
    const itemData = { ownerId: req.user._id, title, type: type || 'image', url, category, description };
    let saved;

    if (isMock) {
      itemData._id = 'g_' + Math.random().toString(36).substr(2, 9);
      saved = mockDbHelper.saveToCollection('gallery', itemData);
    } else {
      saved = new Gallery(itemData);
      await saved.save();
    }
    return res.status(201).json({ message: 'Gallery item added', galleryItem: saved });
  } catch (err) {
    return res.status(500).json({ message: 'Error adding gallery item' });
  }
});

router.delete('/gallery/:id', requireAuth, requireOwner, async (req, res) => {
  try {
    const isMock = checkDbMode();
    if (isMock) {
      mockDbHelper.deleteFromCollection('gallery', req.params.id);
    } else {
      await Gallery.findByIdAndDelete(req.params.id);
    }
    return res.json({ message: 'Gallery item deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting gallery item' });
  }
});

// ================= BLOG ENDPOINTS =================
router.get('/blogs', async (req, res) => {
  try {
    const isMock = checkDbMode();
    let blogs = [];
    if (isMock) {
      blogs = mockDbHelper.getCollection('blogs');
    } else {
      blogs = await Blog.find().sort({ publishDate: -1 });
    }
    return res.json({ blogs });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching blogs' });
  }
});

router.get('/blogs/:slug', async (req, res) => {
  try {
    const isMock = checkDbMode();
    let blog;
    if (isMock) {
      const blogs = mockDbHelper.getCollection('blogs');
      blog = blogs.find(b => b.slug === req.params.slug);
      if (blog) {
        blog.views = (blog.views || 0) + 1;
        mockDbHelper.saveToCollection('blogs', blog);
      }
    } else {
      blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true });
    }

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    return res.json({ blog });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching blog details' });
  }
});

router.post('/blogs', requireAuth, requireOwner, async (req, res) => {
  const { title, slug, content, coverImage, category, tags, status } = req.body;
  if (!title || !slug || !content) return res.status(400).json({ message: 'Missing fields' });

  try {
    const isMock = checkDbMode();
    const itemData = { 
      ownerId: req.user._id, 
      title, 
      slug, 
      content, 
      coverImage, 
      category: category || 'Technology', 
      tags: tags || [], 
      status: status || 'published', 
      views: 0, 
      likes: 0,
      readingTime: `${Math.max(1, Math.round(content.split(' ').length / 200))} min read`,
      comments: []
    };
    let saved;

    if (isMock) {
      itemData._id = 'b_' + Math.random().toString(36).substr(2, 9);
      saved = mockDbHelper.saveToCollection('blogs', itemData);
    } else {
      saved = new Blog(itemData);
      await saved.save();
    }
    return res.status(201).json({ message: 'Blog posted successfully', blog: saved });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating blog post' });
  }
});

router.delete('/blogs/:id', requireAuth, requireOwner, async (req, res) => {
  try {
    const isMock = checkDbMode();
    if (isMock) {
      mockDbHelper.deleteFromCollection('blogs', req.params.id);
    } else {
      await Blog.findByIdAndDelete(req.params.id);
    }
    return res.json({ message: 'Blog post deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting blog' });
  }
});

router.post('/blogs/:id/comment', async (req, res) => {
  const { name, email, content } = req.body;
  if (!name || !email || !content) return res.status(400).json({ message: 'All comment fields are required' });

  try {
    const isMock = checkDbMode();
    let blog;

    if (isMock) {
      const blogs = mockDbHelper.getCollection('blogs');
      blog = blogs.find(b => b._id === req.params.id);
      if (blog) {
        if (!blog.comments) blog.comments = [];
        const newComment = { _id: 'c_' + Math.random().toString(36).substr(2, 9), name, email, content, createdAt: new Date().toISOString() };
        blog.comments.push(newComment);
        mockDbHelper.saveToCollection('blogs', blog);
      }
    } else {
      blog = await Blog.findById(req.params.id);
      if (blog) {
        blog.comments.push({ name, email, content });
        await blog.save();
      }
    }

    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
    return res.status(201).json({ message: 'Comment added successfully', comments: blog.comments });
  } catch (err) {
    return res.status(500).json({ message: 'Error adding comment' });
  }
});

// ================= EDIT / UPDATE ENDPOINTS =================

// Edit Skill
router.put('/skills/:id', requireAuth, requireOwner, async (req, res) => {
  const { name, category, level } = req.body;
  try {
    const isMock = checkDbMode();
    const updateData = { name, category, level: Number(level) || 80 };
    let updated;
    if (isMock) {
      const items = mockDbHelper.getCollection('skills');
      const itemIdx = items.findIndex(x => x._id === req.params.id);
      if (itemIdx !== -1) {
        items[itemIdx] = { ...items[itemIdx], ...updateData };
        const db = mockDbHelper.readDb();
        db.skills = items;
        mockDbHelper.writeDb(db);
        updated = items[itemIdx];
      }
    } else {
      updated = await Skill.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    }
    if (!updated) return res.status(404).json({ message: 'Skill not found' });
    return res.json({ message: 'Skill updated', skill: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating skill' });
  }
});

// Edit Experience
router.put('/experience/:id', requireAuth, requireOwner, async (req, res) => {
  const { company, position, location, joiningDate, leavingDate, responsibilities, achievements } = req.body;
  try {
    const isMock = checkDbMode();
    const updateData = { company, position, location, joiningDate, leavingDate, responsibilities, achievements };
    let updated;
    if (isMock) {
      const items = mockDbHelper.getCollection('experience');
      const itemIdx = items.findIndex(x => x._id === req.params.id);
      if (itemIdx !== -1) {
        items[itemIdx] = { ...items[itemIdx], ...updateData };
        const db = mockDbHelper.readDb();
        db.experience = items;
        mockDbHelper.writeDb(db);
        updated = items[itemIdx];
      }
    } else {
      updated = await Experience.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    }
    if (!updated) return res.status(404).json({ message: 'Experience record not found' });
    return res.json({ message: 'Experience record updated', experience: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating experience' });
  }
});

// Edit Education
router.put('/education/:id', requireAuth, requireOwner, async (req, res) => {
  const { degree, college, university, percentage, cgpa, duration, certificate } = req.body;
  try {
    const isMock = checkDbMode();
    const updateData = { degree, college, university, percentage, cgpa, duration, certificate };
    let updated;
    if (isMock) {
      const items = mockDbHelper.getCollection('education');
      const itemIdx = items.findIndex(x => x._id === req.params.id);
      if (itemIdx !== -1) {
        items[itemIdx] = { ...items[itemIdx], ...updateData };
        const db = mockDbHelper.readDb();
        db.education = items;
        mockDbHelper.writeDb(db);
        updated = items[itemIdx];
      }
    } else {
      updated = await Education.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    }
    if (!updated) return res.status(404).json({ message: 'Education record not found' });
    
    if (certificate) {
      await syncEducationCertificate(req.user._id.toString(), degree, college, university, duration, certificate);
    }

    return res.json({ message: 'Education record updated', education: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating education' });
  }
});

// Edit Gallery
router.put('/gallery/:id', requireAuth, requireOwner, async (req, res) => {
  const { title, type, url, category, description } = req.body;
  try {
    const isMock = checkDbMode();
    const updateData = { title, type, url, category, description };
    let updated;
    if (isMock) {
      const items = mockDbHelper.getCollection('gallery');
      const itemIdx = items.findIndex(x => x._id === req.params.id);
      if (itemIdx !== -1) {
        items[itemIdx] = { ...items[itemIdx], ...updateData };
        const db = mockDbHelper.readDb();
        db.gallery = items;
        mockDbHelper.writeDb(db);
        updated = items[itemIdx];
      }
    } else {
      updated = await Gallery.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    }
    if (!updated) return res.status(404).json({ message: 'Gallery item not found' });
    return res.json({ message: 'Gallery item updated', galleryItem: updated });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating gallery item' });
  }
});

export default router;
