import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  imageUrl: {
    type: String
  },
  // New business information fields
  businessName: {
    type: String
  },
  businessAddress: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  // Geolocation fields
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;