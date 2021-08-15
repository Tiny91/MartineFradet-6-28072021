// protection des routes avec l'authentification par token

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
       // récuperation du token dans le header 
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, `${process.env.PRIVATEKEY}`);
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
      const message = 'vous n êtes pas autorisé à accéder à cette page'
        res.status(401).json({message, data:error})
  }
};
