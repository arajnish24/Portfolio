import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  position: { type: String, default: '' },
  company: { type: String, default: '' },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  image: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Testimonial', TestimonialSchema);
