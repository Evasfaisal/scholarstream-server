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

exports.getApplicationsByUser = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { email } = req.params;
        const applications = await db.collection('applications').find({ userEmail: email }).toArray();
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const applications = await db.collection('applications').find({}).toArray();
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { applicationStatus, feedback } = req.body;
        const { ObjectId } = require('mongodb');
        const update = {};
        if (applicationStatus) update.applicationStatus = applicationStatus;
        if (feedback) update.feedback = feedback;
        const result = await db.collection('applications').updateOne({ _id: new ObjectId(id) }, { $set: update });
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { id } = req.params;
        const { ObjectId } = require('mongodb');
        const result = await db.collection('applications').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Application not found' });
        res.json({ message: 'Application deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};