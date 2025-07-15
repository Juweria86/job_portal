const router = require('express').Router();
const {
  submitApplication,
  getApplicantsByJob,
  getApplicant
} = require('../controllers/applicantController');

router.post('/', submitApplication);
router.get('/job/:jobId', getApplicantsByJob);
router.get('/:id', getApplicant);

module.exports = router;
