const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const user = req.body;
        const result = await User.createUser(db, user);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { email } = req.params;
        const user = await User.getUserByEmail(db, email);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { email } = req.params;
        const { role } = req.body;
        const result = await User.updateUserRole(db, email, role);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
