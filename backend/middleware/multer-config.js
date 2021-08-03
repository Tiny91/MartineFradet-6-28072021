const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
  };

  // enregistrement des fichiers images
const storage = multer.diskStorage({
    destination :(req, file, callback) => {
        callback (null, 'images');
    },
    //modif du nom de fichier pour lisibilité
    //nom d'orgine sans les espaces, extension selon constante MIME_TYPES
    //Ajout de la date précise (avec Date.now)pour éviter tt doublon
    filename : (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension)
    }
});

module.exports = multer({storage: storage}).single('image');