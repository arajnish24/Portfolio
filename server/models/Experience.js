import mongoose from 'mongoose';

const ExperienceSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, default: '' },
  joiningDate: { type: String, required: true }, // E.g., 'Jan 2022'
  leavingDate: { type: String, default: 'Present' },
  responsibilities: [{ type: String }],
  achievements: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Experience', ExperienceSchema);
