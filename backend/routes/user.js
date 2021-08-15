const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//validation de la création de mot de passe selon modèle
const passwordValid = require('../middleware/pwdValid');

//Essai maximum autorisé pour mot de passe
const maxTry = require ('../middleware/rate-limit')

router.post('/signup', passwordValid, userCtrl.signup);
router.post('/login', maxTry.limiter, userCtrl.login);

module.exports = router;