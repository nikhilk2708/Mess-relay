// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, findUser } = require('../Controllers/UserController.js');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/details',findUser)
module.exports = router;
