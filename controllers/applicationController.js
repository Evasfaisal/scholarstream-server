const Application = require('../models/Application');

exports.createApplication = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const application = req.body;
        const result = await Application.createApplication(db, application);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getApplicationById = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const application = await Application.getApplicationById(db, id);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
