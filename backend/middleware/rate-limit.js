const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Vous avez atteint le maximum d'essais de connexion. Votre compte est bloqué 15mn."
})

module.exports = { limiter }