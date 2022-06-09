const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.use(authController.protect);
router.route('/admin')
    .get(userController.getAllUsers)
    //.post(userController.createUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

router.route('/me')
    .get(userController.getMe, userController.getUser)
    .delete(userController.deleteMe, userController.deleteUser)
    .patch(userController.updateMe);

module.exports = router;

