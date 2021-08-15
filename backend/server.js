const http = require('http');
const app = require('./app');

// Execution uniquement sur le port 3000
app.set ('port', process.env.PORT || 3000);
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);
