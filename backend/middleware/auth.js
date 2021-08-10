// protection des routes avec l'authentification par token

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
       // récuperation du token dans le header 
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'random-secret-key');
      // comparaison du userId de la demande avec celui extrait du token
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
          throw 'utilisateur non valide';
    } 
    else {
      next();
    }
  } 
  catch {
        res.status(403).json({error})
  }
};
