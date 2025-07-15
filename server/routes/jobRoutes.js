const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminOnly');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');

router.post('/', authMiddleware, adminOnly, createJob);
router.get('/',  getJobs);
router.get('/:id', getJob);
router.put('/:id', authMiddleware, adminOnly, updateJob);
router.delete('/:id', authMiddleware, adminOnly, deleteJob);

module.exports = router;