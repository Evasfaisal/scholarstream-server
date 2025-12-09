const Scholarship = require('../models/Scholarship');

exports.createScholarship = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const scholarship = req.body;
        const result = await Scholarship.createScholarship(db, scholarship);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getScholarshipById = async (req, res) => {
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
