const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, verifyAdmin } = require('../middleware/auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', requireAuth, verifyAdmin, userController.getAllUsers);
router.get('/:email', userController.getUserByEmail);
router.patch('/:email/role', requireAuth, verifyAdmin, userController.updateUserRole);
router.delete('/:email', requireAuth, verifyAdmin, userController.deleteUser);

module.exports = router;
