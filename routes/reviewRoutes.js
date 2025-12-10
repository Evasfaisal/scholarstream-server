const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth, verifyModerator } = require('../middleware/auth');

router.post('/', requireAuth, reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/scholarship/:scholarshipId', reviewController.getReviewsByScholarship);
router.get('/user/:email', requireAuth, reviewController.getReviewsByUser);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', requireAuth, reviewController.updateReview);
router.delete('/:id', requireAuth, reviewController.deleteReview);

module.exports = router;
