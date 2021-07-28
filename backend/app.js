const express = require('express');

const mongoose = require('mongoose');

const app = express();

const Sauce = require('./model/sauce');

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

//ttes les sauces
app.get('/api/sauces',(req, res, next)=>{
    Sauce.find()
    .then(products => res.status(200).json({products}))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;