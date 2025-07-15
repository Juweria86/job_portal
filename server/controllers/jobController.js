const JobPost = require('../models/JobPost');

exports.createJob = async (req, res) => {
  try {
    const job = new JobPost(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    res.json(job);
  } catch (err) {
    res.status(404).json({ error: 'Job not found' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await JobPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    await JobPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(404).json({ error: 'Job not found' });
  }
};
