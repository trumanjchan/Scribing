import React, { useEffect, useState } from "react";
import Navbar from '../../Components/Navbar/Navbar';
import WordsPerMin from '../../Components/WordsPerMin/WordsPerMin.js';
import LoadingBar from '../../Components/LoadingBar/LoadingBar.js';
import { socket } from "../../services.js";
import './Multiplayer.css';

export default function Multiplayer(props) {
  const [usersPercent, setUsersPercent] = useState(0);
  const [score, setScore] = useState(0);
  const [registeredUser, setUser] = useState("user" + getRandomInt(100));
  const [currentPlayers, setCurrentPlayers] = useState([]);

  useEffect(() => {
    let propsParentUser = props.parentUser
    socket.emit('joinRoom', [propsParentUser, registeredUser]);
  }, []);

  useEffect(() => {
    socket.on('updateClientCurrentPlayers', (players) => {
      setCurrentPlayers(players);
      console.log("currentPlayers array has been updated");
    });
  }, []);

  useEffect(() => {
    console.log("initiate clientTypedMsg")
    socket.emit('clientTypedMsg', [registeredUser, usersPercent]);

    socket.on('typing', (typerInfo) => {
      console.log("typerInfo.propsParentUser: " + typerInfo.propsParentUser + ", typerInfo.registeredUser: " + typerInfo.registeredUser + ", typerInfo.usersPercent: " + typerInfo.usersPercent)
      console.log(typerInfo.players)

      for (let i = 0; i < typerInfo.players.length; i++) {
        if (typerInfo.players[i].registeredUser === registeredUser) {
          currentPlayers[i].username = typerInfo.players[i].username
        }
      }
    });
  }, [usersPercent]);

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getLoadingBars() {
    let temp = [];
    console.log("currentPlayers: " + currentPlayers)
    console.log("currentPlayers.length: " + currentPlayers.length)
    for (let i = 0; i < currentPlayers.length; i++) {
      temp.push(<LoadingBar userName={currentPlayers[i].username} loadingData={currentPlayers[i].percent}/>)
    }
    return temp;
  }

  return (
    <div className="Multiplayer">
      <Navbar fName={props.parentUser}/>
      <div className="Multiplayer-container">
        {getLoadingBars()}
        <WordsPerMin setScore={setScore} setUsersPercent={setUsersPercent}/>
      </div>
    </div>
  );
}
