const express = require('express');
const http = require("http");
const helmet = require('helmet');
const path = require("path");
const chalk = require("chalk");
var cors = require('cors');
const socketio = require("socket.io");
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

console.log(chalk.bold.green(`Starting Express Server`));
const port = process.env.PORT || 5050;

//add securty to our application
app.use(helmet())
app.use(express.json())
app.use(cors())

if(process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  //superficial logging
  app.use(morgan("tiny"));
}

//render react application
app.use(express.static(path.join(__dirname, "/Client/build/")));

require('./src/routes/api/route.js')(app);
require('./src/routes/socket/socket.js')(io);

//wildcard request; if request doesn't fit any predefined ones go to landing page
app.get('*', (request, response) =>{
  response.sendFile(path.join(__dirname, "/Client/build/index.html"));
});

//server listening for any reqests on port
server.listen(port, () =>
  console.log(chalk.bold.white(`Server listening on port `) + chalk.bold.magenta(port))
);
