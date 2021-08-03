const Sauce = require('../models/sauce');
 const fs = require('fs');
const sauce = require('../models/sauce');

 //ajout d'une sauce 
 exports.createSauce = (req ,res , next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
  ...sauceObject,
  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });// Url dynamique selon chemin serveur
  // enregistrement nouvelle sauce dans la base de données
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
    //si modif de l'image 
    {...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`}
    //si pas de modif image
    : { ...req.body };  
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

//supression d'une sauce
exports.deleteSauce = (req ,res , next) => {
    Sauce.findOne({ _id: req.params.id })
    // recherche du nom du fichier image pour le sup
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];// split de l'URL et recup de du nom de fichier
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//Noter une sauce (like et dislike)
exports.noteSauce = (req, res, next) => {

  if (req.body.like == 0){
    Sauce.findOne({ _id: req.params.id })
      .then(sauces => {
        //l'utilisateur a déjà "liké" la sauce 
        if(sauces.usersLiked.find(user => user ===req.body.userId)){
          // retrait d'un like et sup du userId dans le usersLiked
        Sauce.updateOne ({_id: req.params.id},{$inc:{likes:-1},$pull:{usersLiked: req.body.userId}})
          .then(() => res.status(200).json({ message: 'note mise à jour'}))
          .catch(error => res.status(400).json({ error }));
        } 
        //l'utilisateur a déjà "disliké" la sauce
        if(sauces.usersDisliked.find(user => user===req.body.userId)){
          //retrait d'un dislike et sup du userId dans usersDisliked
        Sauce.updateOne ({_id: req.params.id}, {$inc:{dislikes:-1},$pull:{usersDisliked:req.body.userId}})
          .then(() => res.status(200).json({ message: 'note mise à jour'}))
          .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(400).json({ error }));
    };
  
  if (req.body.like == 1){
    Sauce.updateOne( {_id: req.params.id}, {$inc:{likes:1}, $push:{usersLiked: req.body.userId}})
    //ajout d'un like et ajout du userId dans le usersLiked
    .then(() => res.status(200).json({ message: 'note prise en compte'}))
    .catch(error => res.status(400).json({ error }));
  }
  
  if (req.body.like == -1){
    Sauce.updateOne( {_id: req.params.id}, {$inc:{dislikes:1}, $push:{usersDisliked: req.body.userId}})
    //ajout d'un dislike et ajout du userId dans le usersDisliked
    .then(() => res.status(200).json({ message: 'note prise en compte'}))
    .catch(error => res.status(400).json({ error }));
  }
}