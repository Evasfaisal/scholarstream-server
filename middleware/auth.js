const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    try {
        // Try loading from service account file first
        const serviceAccount = require('../serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase Admin initialized with service account file');
    } catch (err) {
        // Fallback to environment variables
        if (process.env.FIREBASE_PROJECT_ID) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
                })
            });
            console.log('✅ Firebase Admin initialized with environment variables');
        } else {
            console.warn('⚠️ Firebase Admin not initialized - no credentials found');
        }
    }
}

const requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

        // Try Firebase token verification first
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.userEmail = decodedToken.email;
            req.firebaseUid = decodedToken.uid;

            // Get user role from database
            const db = req.app.locals.db;
            const user = await db.collection('users').findOne({ email: decodedToken.email });
            req.userRole = user?.role || 'Student';

            return next();
        } catch (firebaseErr) {
            // If Firebase fails, try JWT (for backward compatibility)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userEmail = decoded.email;
            req.userRole = decoded.role;
            next();
        }
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

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            // Try Firebase token first
            try {
                const decodedToken = await admin.auth().verifyIdToken(token);
                req.userEmail = decodedToken.email;
                req.firebaseUid = decodedToken.uid;

                const db = req.app.locals.db;
                const user = await db.collection('users').findOne({ email: decodedToken.email });
                req.userRole = user?.role || 'Student';
            } catch (firebaseErr) {
                // Try JWT as fallback
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.userEmail = decoded.email;
                req.userRole = decoded.role;
            }
        }
    } catch (err) {
        // Token invalid, but continue anyway
    }
    next();
};

module.exports = { requireAuth, verifyAdmin, verifyModerator, optionalAuth };
