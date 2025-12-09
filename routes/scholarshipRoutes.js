const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');

router.post('/', scholarshipController.createScholarship);
router.get('/:id', scholarshipController.getScholarshipById);

module.exports = router;
