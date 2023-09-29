import React, { useEffect, useState } from "react";
import './Matches.css';
import Match from '../Match/Match';
const axios = require('axios');

export default function Matches(props) {
  const [uName, setUName] = useState(null);
  const [matchList, setMatchList] = useState([]);
  
  useEffect(() => {
    console.log("props.uName: " + props.uName);
    setUName(props.uName);
  }, []);

  useEffect(() => {
    axios.get('/pastMatch', {
      params: {
        user: props.uName
      }
    })
    .then(function(response) {
      setMatchList(response.data);
    })
    .catch(function(error) {
      console.log(error);
    });
  }, [uName]);

  if (uName != null) {
    return (
      <div className="Matches">
        <div className="title">My Past 10 Matches</div>
        {matchList.map((match, index) => (
          <Match key={index} matchData={match}/>
        ))}
      </div>
    );
  }
  else {
    return (
      <div className="Matches">
        <div className="title">My Past 10 Matches</div>
        <div className="alert">Log in or sign up to see your past matches!</div>
      </div>
    )
  }
}
