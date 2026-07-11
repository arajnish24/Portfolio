import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // Stores Markdown text
  coverImage: { type: String, default: '' },
  category: { type: String, default: 'Technology' },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Array of IP addresses/visitor tokens to prevent double-likes
  readingTime: { type: String, default: '5 min read' },
  comments: [CommentSchema],
  status: { type: String, enum: ['published', 'draft', 'scheduled'], default: 'published' },
  publishDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Blog', BlogSchema);
