const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');

//validation de la création de mot de passe selon modèle
const passwordValid = require('../middleware/pwdValid');

router.post('/signup', passwordValid, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;