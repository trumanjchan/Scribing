const chalk = require("chalk")
const port = process.env.PORT || 5050;
let players = [];

module.exports = function(io) {

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on('joinRoom', ([propsParentUser, registeredUser]) => {
      console.log("propsParentUser: " + propsParentUser + ", registeredUser: " + registeredUser)
      let clientInfo = new Object();
      clientInfo.clientId = socket.id;
      clientInfo.propsUsername = propsParentUser
      clientInfo.username = registeredUser
      clientInfo.percent = 0
      players.push(clientInfo)
      console.log(players)

      socket.emit('updateClientCurrentPlayers', players);
    });

    socket.on('clientTypedMsg', ([registeredUser, usersPercent]) => {
      let propsParentUser = undefined

      for (let i = 0; i < players.length; i++) {
        if (players[i].username === registeredUser) {
          players[i].percent = usersPercent
          propsParentUser = players[i].propsUsername
        }
      }
      socket.emit('updateClientCurrentPlayers', players);
      console.log(players)

      socket.emit('typing', {propsParentUser, registeredUser, usersPercent, players});
    });

    socket.on('disconnect', () => {
      players = players.filter(person => person.clientId != socket.id)

      console.log(socket.id + " removed from players")
      console.log(players)

      socket.emit('updateClientCurrentPlayers', players);
    });
  });

  console.log(chalk.bold.white(`Socket Server listening on port `) + chalk.bold.magenta(port));
}
