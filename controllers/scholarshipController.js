const Scholarship = require('../models/Scholarship');

exports.getAllScholarships = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { search = '', country = '', category = '', sort = '', page = 1, limit = 10 } = req.query;

        // Build filter query
        const filter = {};
        if (search) {
            filter.$or = [
                { scholarshipName: { $regex: search, $options: 'i' } },
                { universityName: { $regex: search, $options: 'i' } },
                { degree: { $regex: search, $options: 'i' } }
            ];
        }
        if (country) filter.universityCountry = country;
        if (category) filter.scholarshipCategory = category;

        // Build sort options
        let sortOptions = {};
        if (sort === 'applicationFees_asc') sortOptions.applicationFees = 1;
        else if (sort === 'applicationFees_desc') sortOptions.applicationFees = -1;
        else if (sort === 'postDate_asc') sortOptions.scholarshipPostDate = 1;
        else if (sort === 'postDate_desc') sortOptions.scholarshipPostDate = -1;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const scholarships = await db.collection('scholarships')
            .find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        const total = await db.collection('scholarships').countDocuments(filter);

        res.json({
            scholarships,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (err) {
        console.error('GET /api/scholarships error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.createScholarship = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const scholarship = req.body;
        const result = await Scholarship.createScholarship(db, scholarship);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; exports.getScholarshipById = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const scholarship = await Scholarship.getScholarshipById(db, id);
        if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });
        res.json(scholarship);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateScholarship = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { ObjectId } = require('mongodb');
        const scholarship = req.body;
        const result = await db.collection('scholarships').updateOne({ _id: new ObjectId(id) }, { $set: scholarship });
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteScholarship = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { ObjectId } = require('mongodb');
        const result = await db.collection('scholarships').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Scholarship not found' });
        res.json({ message: 'Scholarship deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};