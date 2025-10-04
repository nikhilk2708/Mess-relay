const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  resolutionDescription: {
    type: String,
    default: "", // Set default value as an empty string
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  hostel: {
    type: String,
    required: true, // Adjust validation as needed
  },
});

module.exports = mongoose.model("Complaint", complaintSchema);
