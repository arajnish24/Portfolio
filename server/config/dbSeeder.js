import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certificate from '../models/Certificate.js';
import Blog from '../models/Blog.js';
import Project from '../models/Project.js';
import Gallery from '../models/Gallery.js';

export const seedMongoDb = async () => {
  try {
    // 1. Seed Owner User
    let owner = await User.findOne({ role: 'Owner' });
    
    if (!owner) {
      console.log('Seeding default Owner to MongoDB...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      owner = new User({
        name: "Anmol Rajnish",
        email: "owner@portfolio.com",
        password: hashedPassword,
        role: "Owner",
        isVerified: true,
        portfolioToken: "PX-8453-9452-ABCD",
        profession: "MERN Stack Developer",
        bio: "Passionate full-stack developer specializing in building secure, scalable, and responsive MERN stack web applications with custom security tokens.",
        profileImage: "/AR.jpg",
        resumeUrl: "/Updated_Resume.pdf",
        location: "New Delhi, India",
        contactDetails: {
          phone: "+91 7766827105",
          whatsapp: "+91 7766827105",
          telegram: "@a_nmolraj1921",
          linkedin: "www.linkedin.com/in/arajnish2408",
          github: "https://github.com/arajnish24"
        },
        seo: {
          title: "Anmol Rajnish | Senior Full Stack Architect Portfolio",
          description: "Explore the secure portfolio and projects of Anmol Rajnish, showcasing MERN stack expertise and DevSecOps engineering.",
          keywords: "React, Node, Express, MongoDB, Security, TailwindCSS, JWT, Portfolios",
          ogImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"
        },
        themeSettings: {
          theme: "dark",
          accentColor: "#3b82f6",
          fontFamily: "Inter",
          layout: "glass",
          animationsEnabled: true
        }
      });
      await owner.save();
    } else {
      console.log('Force updating existing Owner assets path in MongoDB...');
      owner.name = "Anmol Rajnish";
      owner.profileImage = "/AR.jpg";
      owner.resumeUrl = "/Updated_Resume.pdf";
      owner.location = "New Delhi, India";
      owner.contactDetails = {
        phone: "+91 7766827105",
        whatsapp: "+91 7766827105",
        telegram: "@a_nmolraj1921",
        linkedin: "www.linkedin.com/in/arajnish2408",
        github: "https://github.com/arajnish24"
      };
      await owner.save();
    }

    const ownerId = owner._id;

    // 2. Seed Skills
    const skillCount = await Skill.countDocuments({ ownerId });
    if (skillCount === 0) {
      console.log('Seeding skills to MongoDB...');
      const defaultSkills = [
        { ownerId, name: "React.js", category: "Frontend", level: 95 },
        { ownerId, name: "Node.js & Express", category: "Backend", level: 90 },
        { ownerId, name: "MongoDB & Mongoose", category: "Database", level: 88 },
        { ownerId, name: "Docker & Kubernetes", category: "DevOps", level: 82 },
        { ownerId, name: "TypeScript", category: "Programming Languages", level: 85 },
        { ownerId, name: "Tailwind CSS", category: "Tools", level: 95 }
      ];
      await Skill.insertMany(defaultSkills);
    }

    // 3. Seed Experiences
    const expCount = await Experience.countDocuments({ ownerId });
    if (expCount === 0) {
      console.log('Seeding experiences to MongoDB...');
      const defaultExperiences = [
        {
          ownerId,
          company: "Software Services & Solutions",
          position: "Intern",
          location: "Patna, Bihar",
          joiningDate: "01/07/2026",
          leavingDate: "Present",
          responsibilities: ["MERN Stack Developer"]
        }
      ];
      await Experience.insertMany(defaultExperiences);
    }

    // 4. Seed Educations
    const eduCount = await Education.countDocuments({ ownerId });
    if (eduCount === 0) {
      console.log('Seeding educations to MongoDB...');
      const defaultEducations = [
        {
          ownerId,
          degree: "B.Tech (Computer Science & Engineering)",
          college: "Teerthanker Mahaveer University",
          duration: "2023 - 2027",
          cgpa: 7.29
        },
        {
          ownerId,
          degree: "Intermediate",
          college: "High School, Malaur",
          duration: "2021 - 2023"
        },
        {
          ownerId,
          degree: "Matriculation",
          college: "The Divine Public School, Bikramganj, Rohtas",
          completedIn: "2021"
        }
      ];
      await Education.insertMany(defaultEducations);
    }

    // 5. Seed Certificates
    const certCount = await Certificate.countDocuments({ ownerId });
    if (certCount === 0) {
      console.log('Seeding certificates to MongoDB...');
      const defaultCertificates = [
        {
          ownerId,
          title: "Full Stack Web Development( MERN Stack)",
          organization: "Apna College",
          date: "2025"
        }
      ];
      await Certificate.insertMany(defaultCertificates);
    }



    // 7. Seed Projects
    const projectCount = await Project.countDocuments({ ownerId });
    if (projectCount === 0) {
      console.log('Seeding projects to MongoDB...');
      const defaultProjects = [
        {
          ownerId,
          title: "PortfolioX Platform",
          description: "A production-ready secure MERN portfolio system with dual-key token restrictions, resilient database failovers, and embedded recruiter analytics trackers.",
          technologies: ["React", "Express.js", "Node.js", "MongoDB", "Tailwind CSS"],
          github: "https://github.com/arajnish24/portfoliox",
          live: "https://portfoliox-demo.com",
          playStore: "https://play.google.com/store",
          appStore: "https://apple.com/app-store",
          images: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900"],
          video: "",
          features: [
            "Unique Dual-Key portfolio token gates validation check.",
            "Dynamic visitor/recruiter device, OS, and browser analytics logging.",
            "Double-column print layout formats for resume PDF exports.",
            "Resilient MongoDB local JSON file failovers."
          ],
          duration: "3 months",
          status: "published",
          teamSize: 1,
          clientName: "Open Source Community",
          tags: ["Full Stack", "Identity Management", "Security"],
          difficulty: "Advanced",
          views: 129,
          likes: 45,
          codeSnippet: `// Secure write gate validation middleware\nconst verifyTokenHeader = (req, res, next) => {\n  const { portfolioToken } = req.body;\n  if (!portfolioToken) {\n    return res.status(401).json({ message: 'Token required' });\n  }\n  if (portfolioToken !== req.user.portfolioToken) {\n    return res.status(403).json({ message: 'TRANSACTION REJECTED: Invalid Token' });\n  }\n  next();\n};`
        }
      ];
      await Project.insertMany(defaultProjects);
    }

    // 8. Seed Blogs
    const blogCount = await Blog.countDocuments({ ownerId });
    if (blogCount === 0) {
      console.log('Seeding blogs to MongoDB...');
      const defaultBlogs = [
        {
          ownerId,
          title: "Securing MERN Stack Apps in Production",
          slug: "securing-mern-stack",
          category: "Security",
          content: "Security is paramount in web development. In this article, we cover double-key authentication, OTP logic, and headers injection mitigations...",
          readingTime: "4 min read",
          views: 110,
          likes: 18,
          createdAt: new Date()
        }
      ];
      await Blog.insertMany(defaultBlogs);
    }

    // 9. Seed Gallery
    const galleryCount = await Gallery.countDocuments({ ownerId });
    if (galleryCount === 0) {
      console.log('Seeding gallery to MongoDB...');
      const defaultGallery = [
        {
          ownerId,
          title: "Speaking at WebConf 2025",
          type: "image",
          url: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600",
          category: "Events"
        }
      ];
      await Gallery.insertMany(defaultGallery);
    }

    console.log('✔ MongoDB seed complete!');
  } catch (error) {
    console.error('❌ MongoDB seed error:', error);
  }
};
