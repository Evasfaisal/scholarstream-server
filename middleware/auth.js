const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userEmail = decoded.email;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.userRole !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }
    next();
};

const verifyModerator = (req, res, next) => {
    if (req.userRole !== 'Moderator' && req.userRole !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden: Moderator or Admin access required' });
    }
    next();
};

const optionalAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userEmail = decoded.email;
            req.userRole = decoded.role;
        }
    } catch (err) {
        // Token invalid, but continue anyway
    }
    next();
};

module.exports = { requireAuth, verifyAdmin, verifyModerator, optionalAuth };
