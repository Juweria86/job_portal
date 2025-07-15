const Applicant = require('../models/Applicant');

exports.submitApplication = async (req, res) => {
  try {
    const applicant = new Applicant(req.body);
    await applicant.save();
    res.status(201).json(applicant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getApplicantsByJob = async (req, res) => {
  try {
    const applicants = await Applicant.find({ jobId: req.params.jobId });
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);
    res.json(applicant);
  } catch (err) {
    res.status(404).json({ error: 'Applicant not found' });
  }
};