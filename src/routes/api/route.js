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

    db.query("SELECT scores.firstName, scores.lastName, scores.matchDate, scores.matchTime, scores.score FROM freedb_scribingdb.scores scores, freedb_scribingdb.users users WHERE users.firstName = scores.firstName AND users.userName = '" + user + "' ORDER BY scores.matchDate DESC, scores.matchTime DESC", (err,result)=>{
      if(err) {
        console.log(err);
      }
      res.send(result);
    });
  });

  app.get('/pastMatch', function(req, res) {
    let user = req.query.user;
    console.log("req.query.user: " + user);

    db.query("SELECT scores.matchDate, scores.matchTime, scores.score FROM freedb_scribingdb.scores scores, freedb_scribingdb.users users WHERE users.firstName = scores.firstName AND users.userName = '" + user + "' ORDER BY scores.matchDate DESC, scores.matchTime DESC LIMIT 10", (err,result)=>{
      if(err) {
        console.log(err);
      }
      res.send(result);
    });
  });

  app.post('/newScore', function(req, res) {
    const username = req.body.userName;
    const score = req.body.score;
    const date = req.body.date;
    const time = req.body.time;

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

    db.query("SELECT password FROM freedb_scribingdb.users WHERE userName = '" + username + "'", (err,result)=>{
      if(err) {
        console.log(err);
      }

      console.log(result[0] !== undefined)
      console.log(username.length !== 0)
      console.log(attemptPass.length !== 0)
      if (result[0] !== undefined && username.length !== 0 && attemptPass.length !== 0) {  //username exists in the database and typed username and typed password are not undefined
        let pass1 = result[0].password;
        console.log(pass1);

        for (i=65; i++; i<=90) {
          console.log(i);
          hash.reset();
          let temp = attemptPass + String.fromCharCode(i);
          hash.update(temp);
          let temp2 = hash.digest('hex');
          hash.reset();
          console.log(i);
          if (temp2 === pass1){
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
          if (i === 100) {
            console.log("correct username but incorrect password");
            res.send({reset: "access denied"});
            break;
          }
        }
      } else {
        console.log("incorrect username and password");
        res.send({reset: "access denied"});
      }
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
