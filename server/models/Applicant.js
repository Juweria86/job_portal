const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  year: String
});

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  duration: String,
  description: String
});

const applicantSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  linkedIn: { type: String },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [String],
  coverLetter: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Applicant', applicantSchema);
