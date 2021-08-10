const express = require('express');
const app = express();

const mongoose = require('mongoose');

//gestion des variables d'environnement
const dotenv = require('dotenv').config();

//sécurisation des entêtes HTTP
const helmet = require ('helmet');
app.use (helmet());

// gestion des chemins de fichiers
const path = require('path');

const sauceRoutes = require('./routes/sauce');

const userRoutes = require ('./routes/user');

//connexion à MongoDB
mongoose.connect(process.env.DATABASE,{useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


// Politique de sécurité pour le partage de ressources(cors)
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