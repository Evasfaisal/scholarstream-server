const express = require('express');
const router = express.Router();
const { requireAuth, verifyAdmin } = require('../middleware/auth');

router.get('/', requireAuth, verifyAdmin, async (req, res) => {
    try {
        const db = req.app.locals.db;

        const totalUsers = await db.collection('users').countDocuments();
        const totalScholarships = await db.collection('scholarships').countDocuments();

        const applications = await db.collection('applications').find({ paymentStatus: 'paid' }).toArray();
        const totalFeesCollected = applications.reduce((sum, app) => sum + (app.applicationFees || 0) + (app.serviceCharge || 0), 0);

        const applicationsByUniversity = await db.collection('applications').aggregate([
            { $group: { _id: '$universityName', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        const applicationsByCategory = await db.collection('applications').aggregate([
            { $group: { _id: '$scholarshipCategory', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        res.json({
            totalUsers,
            totalScholarships,
            totalFeesCollected,
            applicationsByUniversity,
            applicationsByCategory
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
