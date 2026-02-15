const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');


if (!admin.apps.length) {
    try {
       
        const serviceAccount = require('../serviceAccountKey.json');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log(' Firebase Admin initialized with service account file');
    } catch (err) {
        
        if (process.env.FIREBASE_PROJECT_ID) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
                })
            });
            console.log(' Firebase Admin initialized with environment variables');
        } else {
            console.warn(' Firebase Admin not initialized - no credentials found');
        }
    }
}

const requireAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });

       
        try {
            const decodedToken = await admin.auth().verifyIdToken(token);
            req.userEmail = decodedToken.email;
            req.firebaseUid = decodedToken.uid;

            
            try {
                const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    req.userRole = userData.role || 'Student';
                    console.log(` User authenticated: ${req.userEmail}, Role: ${req.userRole}`);
                } else {
                    
                    req.userRole = 'Student';
                    console.log(`  User ${req.userEmail} not found in Firestore, defaulting to Student role`);
                }
            } catch (firestoreErr) {
                console.error('Firestore fetch error:', firestoreErr.message);
                req.userRole = 'Student';
            }

            return next();
        } catch (firebaseErr) {
            console.error('Firebase auth error:', firebaseErr.message);
           
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userEmail = decoded.email;
            req.userRole = decoded.role;
            next();
        }
    } catch (err) {
        console.error('Auth error:', err.message);
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
    console.log(`🔍 Checking moderator access - User: ${req.userEmail}, Role: ${req.userRole}`);
    if (req.userRole !== 'Moderator' && req.userRole !== 'Admin') {
        console.log(` Access denied - Required: Moderator/Admin, Current: ${req.userRole}`);
        return res.status(403).json({
            message: 'Forbidden: Moderator or Admin access required',
            currentRole: req.userRole,
            userEmail: req.userEmail
        });
    }
    console.log(` Moderator access granted`);
    next();
};

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
           
            try {
                const decodedToken = await admin.auth().verifyIdToken(token);
                req.userEmail = decodedToken.email;
                req.firebaseUid = decodedToken.uid;

             
                try {
                    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
                    if (userDoc.exists) {
                        req.userRole = userDoc.data().role || 'Student';
                    } else {
                        req.userRole = 'Student';
                    }
                } catch {
                    req.userRole = 'Student';
                }
            } catch (firebaseErr) {
               
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.userEmail = decoded.email;
                req.userRole = decoded.role;
            }
        }
    } catch (err) {
      
    }
    next();
};

module.exports = { requireAuth, verifyAdmin, verifyModerator, optionalAuth };
