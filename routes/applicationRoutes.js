const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { requireAuth, verifyModerator } = require('../middleware/auth');

router.post('/', requireAuth, applicationController.createApplication);
router.get('/', requireAuth, verifyModerator, applicationController.getAllApplications);
router.get('/user/:email', requireAuth, applicationController.getApplicationsByUser);
router.get('/:id', requireAuth, applicationController.getApplicationById);
router.patch('/:id', requireAuth, verifyModerator, applicationController.updateApplicationStatus);
router.delete('/:id', requireAuth, applicationController.deleteApplication);

module.exports = router;
