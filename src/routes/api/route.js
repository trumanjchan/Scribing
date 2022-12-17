const db = require('../../../config/db.js');
const { Keccak } = require('sha3');
var jwt = require('jsonwebtoken');


module.exports = function(app) {

  app.get('/top', function(req, res) {
    
    db.query("SELECT DISTINCT scores.firstName, scores.lastName, MAX(scores.score) as score FROM freedb_scribingdb.scores scores JOIN freedb_scribingdb.users users ON (scores.firstName = users.firstName) GROUP BY firstName, lastName ORDER BY MAX(score) DESC", (err,result)=>{
      if(err) {
        console.log(err);
      }
      res.send(result);
    });
  });

  app.get('/user', function(req, res) {
    let user = req.query.user;

    db.query("SELECT scores.firstName, scores.lastName, scores.matchDate, scores.matchTime, scores.score FROM freedb_scribingdb.scores scores, freedb_scribingdb.users users WHERE users.firstName = scores.firstName AND users.userName = '" + user + "' ORDER BY matchDate DESC", (err,result)=>{
      if(err) {
        console.log(err);
      }
      res.send(result);
    });
  });

  app.get('/pastMatch', function(req, res) {
    let user = req.query.user;

    db.query("SELECT scores.matchDate, scores.matchTime, scores.score FROM freedb_scribingdb.scores scores, freedb_scribingdb.users users WHERE users.firstName = scores.firstName AND users.userName = '" + user + "' ORDER BY matchDate DESC LIMIT 10", (err,result)=>{
      if(err) {
        console.log(err);
      }
      res.send(result);
    });
  });

  app.post('/newScore', function(req, res) {
    const username = req.body.userName;
    const score = req.body.score;
    const rightnow = new Date();
    const date = rightnow.toLocaleDateString("en-US");
    const time = rightnow.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    db.query("INSERT INTO freedb_scribingdb.scores (firstName, lastName, matchDate, matchTime, score) VALUES ((SELECT firstName from freedb_scribingdb.users WHERE userName = '" + username + "'), (SELECT lastName from freedb_scribingdb.users WHERE userName = '" + username + "'), '" + date + "', '" + time + "', '" + score + "')", (err,result)=>{
      if(err) {
        console.log(err);
      }
      res.send(result);
    });
  });

  app.post('/loginUser', function(req, res) {
    console.log("POST login OK!");
    const username = req.body.userName;
    const attemptPass = req.body.password;
    const hash = new Keccak(256);

    db.query("SELECT password FROM freedb_scribingdb.users where userName = '" + username + "'", (err,result)=>{
      if(err) {
        console.log(err);
      }

      let pass1 = result[0].password;
      console.log(pass1);
      for(i=65; i++; i<=90) {
        console.log(i);
        hash.reset();
        let temp = attemptPass + String.fromCharCode(i);
        hash.update(temp);
        let temp2 = hash.digest('hex');
        hash.reset();
        console.log(i);
        if(temp2 === pass1){
          console.log("logged in user " + username);
          var token = jwt.sign({
            verfiedUser: username
          }, process.env.SECRET, { expiresIn: '1d' });

          res.send({result: "access granted!",
            userName: username,
            jwtoken: token
          });

          return;
        }
        console.log("end of for loop");
      }
      console.log("incorrect password");
      res.send({reset: "access denied"});
    });
  });

  app.post('/signUpUser', function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const password = req.body.password;

    db.query("INSERT INTO freedb_scribingdb.users (firstName, lastName, userName, password) VALUES ('" + firstName  + "','" + lastName + "','" + userName + "','" + password + "')", (err,result)=>{
      if(err) {
        console.log(err);
      }

      var token = jwt.sign({
        verfiedUser: userName
      }, process.env.SECRET, { expiresIn: '1d' });

      res.send({result: "access granted!",
        userName: userName,
        jwtoken: token
      });
    });
  });
}
