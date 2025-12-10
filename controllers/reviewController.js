const Review = require('../models/Review');
const { ObjectId } = require('mongodb');

exports.createReview = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const review = req.body;
        const result = await Review.createReview(db, review);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid review ID' });
        const review = await Review.getReviewById(db, id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getReviewsByScholarship = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { scholarshipId } = req.params;
        const reviews = await db.collection('reviews').find({ scholarshipId }).toArray();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getReviewsByUser = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { email } = req.params;
        const reviews = await db.collection('reviews').find({ userEmail: email }).toArray();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const reviews = await db.collection('reviews').find({}).toArray();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid review ID' });
        const update = req.body;
        const result = await db.collection('reviews').updateOne({ _id: new ObjectId(id) }, { $set: update });
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid review ID' });
        const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
