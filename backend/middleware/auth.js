const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'random-secret-key');
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
