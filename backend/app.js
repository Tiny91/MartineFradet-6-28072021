const express = require('express');

const mongoose = require('mongoose');

const app = express();

const path = require('path');

const sauceRoutes = require('./routes/sauce');

const userRoutes = require ('./routes/user');

mongoose.connect('mongodb+srv://Tiny:coursNode@cluster0.1vvuv.mongodb.net/projet0?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// equivalent bodyParser
  app.use(express.urlencoded({extended:true}));
  app.use(express.json());

  // app.use('/api/sauces', (req,res,next) =>{
    // const sauce = [
      //  {
          // _id: 'eroimfgjlfh', 
          // name: 'Blair\'s Ultra Death Sauce',
          // manufacturer: 'Blair\'s',
          // // // // description: 'Blair\'s Ultra Death has established itself as a bit of a legend within the hot sauce world. one thing that creator Blair Lazar does well it\'s retaining the flavour in his super-hot sauces. They\'ll melt your face off for sure, but despite the extract they still taste damned fine.Just to emphasise the seriousness of the heat we\'re dealing with here, all Blair\'s super-hot sauces in the Death range now come in a nifty coffin box with his trademark  skull keyring attached to the bottle.',
          // heat: 9,
          // likes: 100,
          // dislikes: 0,
          // imageUrl: 'https://www.chilliworld.com/content/images/thumbs/0000827_blairs-ultra-death-sauce-in-a-coffin_550.jpeg',
          // mainPepper: 'Carolina Reaper',
          // usersLiked: [],
          // usersDisliked: []
        // }
          // ];
    // res.status(200).json(sauce)
  // });

// chemin middleware sauces et utilisateurs et images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces',sauceRoutes);
app.use('/api/auth',userRoutes);

module.exports = app;