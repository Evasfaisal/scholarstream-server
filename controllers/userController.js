const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { name, email, photoURL, password } = req.body;
        const existingUser = await User.getUserByEmail(db, email);
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const user = { name, email, photoURL, role: 'Student', createdAt: new Date() };
        const result = await User.createUser(db, user);
        const token = jwt.sign({ email, role: 'Student' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user: result, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { email } = req.body;
        const user = await User.getUserByEmail(db, email);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { role } = req.query;
        const filter = role ? { role } : {};
        const users = await db.collection('users').find(filter).toArray();
        res.json(users);
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

exports.deleteUser = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { email } = req.params;
        const result = await db.collection('users').deleteOne({ email });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};