const Sauce = require('../models/sauce');
 const fs = require('fs');

 //ajout d'une sauce
 exports.createSauce = (req ,res , next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
  ...sauceObject,
  likes: 0,
  dislikes: 0,
  userLiked: [],
  userDisliked: [],
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then(() => res.status(201).json({ message: 'sauce ajoutée !'}))
  .catch(error => res.status(400).json({ error }));
};

// Afficher toutes les sauces
exports.getAllSauces = (req ,res , next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

// Afficher une sauce selon l'id
exports.getOneSauce = (req ,res , next) => {
    Sauce.findOne({ _id: req.params.id })
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(404).json({ error }));
};

//modif d'une sauce (image ou texte)
exports.modifySauce = (req ,res , next) => {
    const sauceObject = req.file ? 
  {...JSON.parse(req.body.sauce),
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`}
  : { ...req.body };  
Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

//supression d'une sauce
exports.deleteSauce = (req ,res , next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
  


