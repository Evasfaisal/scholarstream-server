const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { requireAuth, verifyAdmin } = require('../middleware/auth');

router.get('/', scholarshipController.getAllScholarships);
router.post('/', requireAuth, verifyAdmin, scholarshipController.createScholarship);
router.get('/:id', scholarshipController.getScholarshipById);
router.put('/:id', requireAuth, verifyAdmin, scholarshipController.updateScholarship);
router.delete('/:id', requireAuth, verifyAdmin, scholarshipController.deleteScholarship);

module.exports = router;
