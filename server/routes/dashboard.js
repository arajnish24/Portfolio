import express from "express";
import mongoose from "mongoose";
import Analytics from "../models/Analytics.js";
import Notification from "../models/Notification.js";
import Project from "../models/Project.js";
import { mockDbHelper } from "../config/mockDb.js";
import { requireAuth, requireOwner } from "../middlewares/authMiddleware.js";

const router = express.Router();
const checkDbMode = () => mongoose.connection.readyState !== 1;

// @route   GET /api/dashboard/analytics
// @desc    Get dashboard metrics & charts logs (Owner)
router.get("/analytics", requireAuth, requireOwner, async (req, res) => {
  try {
    const isMock = checkDbMode();
    let logs = [];
    let projects = [];

    if (isMock) {
      logs = mockDbHelper.getCollection("analytics");
      projects = mockDbHelper.getCollection("projects");
    } else {
      logs = await Analytics.find();
      projects = await Project.find();
    }

    // Calculations
    const profileViews = logs.filter(
      (l) => l.actionType === "profile_view",
    ).length;
    const resumeDownloads = logs.filter(
      (l) => l.actionType === "resume_download",
    ).length;
    const projectClicks = logs.filter(
      (l) => l.actionType === "project_click",
    ).length;
    const totalLikes = projects.reduce(
      (acc, curr) => acc + (curr.likes || 0),
      0,
    );

    // Grouping helper
    const getGroupCounts = (field) => {
      const counts = {};
      logs.forEach((l) => {
        const val = l[field] || "Unknown";
        counts[val] = (counts[val] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    };

    const deviceStats = getGroupCounts("device");
    const browserStats = getGroupCounts("browser");
    const osStats = getGroupCounts("os");
    const countryStats = getGroupCounts("country");

    // Monthly visitor metrics (Mock/aggregated representation)
    const monthlyTraffic = [
      { name: "Jan", visitors: 120 },
      { name: "Feb", visitors: 150 },
      { name: "Mar", visitors: 190 },
      { name: "Apr", visitors: 220 },
      { name: "May", visitors: 310 },
      { name: "Jun", visitors: profileViews || 380 },
    ];

    return res.json({
      metrics: {
        profileViews,
        resumeDownloads,
        projectClicks,
        totalLikes,
        projectsCount: projects.length,
      },
      charts: {
        devices: deviceStats,
        browsers: browserStats,
        os: osStats,
        countries: countryStats,
        traffic: monthlyTraffic,
      },
    });
  } catch (error) {
    console.error("Fetch dashboard analytics error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/dashboard/notifications
// @desc    Get dashboard real-time notifications
router.get("/notifications", requireAuth, requireOwner, async (req, res) => {
  try {
    const isMock = checkDbMode();
    let notifications = [];

    if (isMock) {
      notifications = mockDbHelper.getCollection("notifications");
    } else {
      notifications = await Notification.find().sort({ createdAt: -1 });
    }

    return res.json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/dashboard/notifications/read
// @desc    Mark notifications as read
router.put(
  "/notifications/read",
  requireAuth,
  requireOwner,
  async (req, res) => {
    try {
      const isMock = checkDbMode();

      if (isMock) {
        const notifications = mockDbHelper.getCollection("notifications");
        notifications.forEach((n) => {
          n.isRead = true;
        });
        mockDbHelper.writeDb({ ...mockDbHelper.readDb(), notifications });
      } else {
        await Notification.updateMany(
          { isRead: false },
          { $set: { isRead: true } },
        );
      }

      return res.json({ message: "Notifications cleared" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
);

export default router;
