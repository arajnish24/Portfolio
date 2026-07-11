import mongoose from 'mongoose';

const CertificateSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  organization: { type: String, required: true },
  date: { type: String, default: '' },
  verificationLink: { type: String, default: '' },
  image: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Certificate', CertificateSchema);
