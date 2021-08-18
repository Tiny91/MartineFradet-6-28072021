const Sauce = require('../models/sauce');
 const fs = require('fs');

 //ajout d'une sauce 
exports.createSauce = (req ,res ) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });// Url dynamique selon chemin serveur
  // enregistrement nouvelle sauce dans la base de données
  sauce.save()
    .then(sauce => {
      const message = 'la sauce a bien été ajoutée'
      res.json({ message, data: sauce})
    })
    .catch(error => {
      const message = 'sauce non ajoutée, réessayez plus tard' 
      res.status(500).json({message, data:error })
    });
  }

// Afficher toutes les sauces
exports.getAllSauces = (req ,res ) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => {
      const message = "les sauces n'ont pu être affichées, réessayez plus tard"
      res.status(500).json({message, data:error})
      })
};

// Afficher une sauce selon l'id
exports.getOneSauce = (req ,res ) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => {
      const message = `La sauce ne peut être affichée. Réessayez dans quelques instants.`
      res.status(500).json({ message, data: error })
    })
};

//modif d'une sauce (image ou texte)
exports.modifySauce = (req, res, next) => {
    if (req.file) {
      // si modif de l'image=> supp ancienne image 
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            // ajout nouvelle image et update des infos
            const sauceObject = {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
              }
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
          })
         })
        .catch(error => res.status(500).json({ error }));
    } else {
        // pas de modif image
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
          .catch(error => res.status(400).json({ error }));
    }
};

//supression d'une sauce
exports.deleteSauce = (req ,res ) => {
  Sauce.findOne({ _id: req.params.id })
    // recherche du nom du fichier image pour le sup
  .then(sauce => {
    const filename = sauce.imageUrl.split('/images/')[1];// split de l'URL et recup  du nom de fichier
    fs.unlink(`images/${filename}`, () => {
      Sauce.deleteOne({ _id: req.params.id })
      .then(sauce => {
        const message = 'la sauce a bien été supprimée'
        res.json({ message, data: sauce})
      })
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => {
    const message = `La sauce n'a pas pu être supprimée. Réessayez dans quelques instants.`
    res.status(500).json({ message, data: error })
  })
};

//Noter une sauce (like et dislike)
exports.noteSauce = (req, res, ) => {
  if (req.body.like == 0){
    Sauce.findOne({ _id: req.params.id })
      .then(sauces => {
        //l'utilisateur a déjà "liké" la sauce 
        if(sauces.usersLiked.find(user => user ===req.body.userId)){
          // retrait d'un like et sup du userId dans le usersLiked
        Sauce.updateOne ({_id: req.params.id},{$inc:{likes:-1},$pull:{usersLiked: req.body.userId}})
          .then(() => res.status(200).json({ message: 'note mise à jour'}))
          .catch(error => {
            const message = `votre note n'a pu être prise en compte, merci de réessayer dans quelques instants.`
            res.status(500).json({ message, data: error })
          })
        } 
        //l'utilisateur a déjà "disliké" la sauce
        if(sauces.usersDisliked.find(user => user===req.body.userId)){
          //retrait d'un dislike et sup du userId dans usersDisliked
        Sauce.updateOne ({_id: req.params.id}, {$inc:{dislikes:-1},$pull:{usersDisliked:req.body.userId}})
          .then(() => res.status(200).json({ message: 'note mise à jour'}))
          .catch(error => {
            const message = `votre note n'a pu être prise en compte, merci de réessayer dans quelques instants.`
            res.status(500).json({ message, data: error })
          })
        }
      })
      .catch(error => {
        const message = `votre note n'a pu être prise en compte, merci de réessayer dans quelques instants.`
        res.status(500).json({ message, data: error })
      })
    };
  
  if (req.body.like == 1){
    Sauce.updateOne( {_id: req.params.id}, {$inc:{likes:1}, $push:{usersLiked: req.body.userId}})
    //ajout d'un like et ajout du userId dans le usersLiked
    .then(() => res.status(200).json({ message: 'note prise en compte'}))
    .catch(error => {
      const message = `votre note n'a pu être prise en compte, merci de réessayer dans quelques instants.`
      res.status(500).json({ message, data: error })
    })
  }
  
  if (req.body.like == -1){
    Sauce.updateOne( {_id: req.params.id}, {$inc:{dislikes:1}, $push:{usersDisliked: req.body.userId}})
    //ajout d'un dislike et ajout du userId dans le usersDisliked
    .then(() => res.status(200).json({ message: 'note prise en compte'}))
    .catch(error => {
      const message = `votre note n'a pu être prise en compte, merci de réessayer dans quelques instants.`
      res.status(500).json({ message, data: error })
    })
  }
};