const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/:email', userController.getUserByEmail);
router.patch('/:email/role', userController.updateUserRole);

module.exports = router;
