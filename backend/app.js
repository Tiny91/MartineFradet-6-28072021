const express = require('express');

const mongoose = require('mongoose');

const app = express();

const path = require('path');

const sauceRoutes = require('./routes/sauce');

const userRoutes = require ('./routes/user');

//connexion à MongoDB
mongoose.connect('mongodb+srv://Tiny:coursNode@cluster0.1vvuv.mongodb.net/pekocko?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// Politique de sécurité
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.urlencoded({extended:true}));
app.use(express.json());


// chemin middleware sauces - utilisateurs - images
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces',sauceRoutes);
app.use('/api/auth',userRoutes);

module.exports = app;