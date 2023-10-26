import './Navbar.css';
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import logoGif from '../../Images/beam-a-person-is-typing-on-a-laptop.gif';

function Navbar(props) {
  const [fName, setFirstName] = useState(null);

  useEffect( () => {
    setFirstName(props.fName);
  }, [props.fName]);

  const userLogOut = () => {
    document.getElementById("logoGif").click();
    window.location.reload();
  };

  if (fName != null) {
    return (
      <div className="Navbar">
        <div className='branding'>
          <Link id='logoGif' to="/"><img src={ logoGif } alt="Illustration by Vera Erm from Ouch!"/></Link>
        </div>

        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/multiplayer">Multiplayer</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
        </ul>

        <div className="userinfo">
          <div className="welcome">Welcome, <Link to={"/profile/" + fName}>{fName}</Link>!</div> 
          <div className="logoutcontainer">
            <button onClick={userLogOut}>Log out</button>
          </div>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="Navbar">
        <div className='branding'>
          <Link id='logoGif' to="/"><img src={ logoGif } alt="Illustration by Vera Erm from Ouch!"/></Link>
        </div>

        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/multiplayer">Multiplayer</Link></li>
          <li><Link to="/leaderboard">Leaderboard</Link></li>
        </ul>

        <div className="userinfo">
          <div className='welcome'>Welcome, Guest!</div>
          <div className="buttons">
            <button className="loginbutton"><Link to="/login">Log in</Link></button>
            <button className="signupbutton"><Link to="/signup">Sign up</Link></button>
          </div>
        </div>
      </div>
    )
  }
}

export default Navbar;
