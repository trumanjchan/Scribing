import React from 'react';
import { Navigate } from "react-router-dom";
import './Login.css';
import Navbar from '../../Components/Navbar/Navbar';
import { Keccak } from 'sha3';
const axios = require('axios');


class Login extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
                    uName: '',
                    pass:'',
                    visiblity: 'password',
                    redirect: false,
                    res: null
                    };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }


  hashMe(pass) {
    const hash = new Keccak(256);
    hash.reset();
    hash.update(pass); //add the value to be hashed
    const temp = hash.digest('hex'); //hash the value
    return temp;
  }

  handleChange = (e) => {
      const target = e.target;
      const value = target.value;
      const object = target.name;
      this.setState(
        {
          [object]: object === "pass" ? this.hashMe(value) : value,

        }
      );
    }


  handleSubmit = (e) => {
    e.preventDefault();

    console.log(this.state.uName.length)
    console.log(document.getElementById("typedpass").value.length)
    if (this.state.uName.length !== 0 && document.getElementById("typedpass").value.length !== 0) {  //typed username and typed password lengths are not undefined
      axios.post('/loginUser', {
        userName: this.state.uName,
        password: this.state.pass
      })
      .then(function (response) {
        console.log(response);
        let res = response.data;
        if(res.result === "access granted!"){
          localStorage.setItem('jswtoken', res.jwtoken);
          this.props.setParentUser(res.userName);
          this.setState({
            redirect: true
          })
        } else {
          document.getElementById("requiredmsg").innerHTML = "Username (" + this.state.uName + ") and Password do not match."
        }
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    } else {
      console.log("Failed to log in")
      document.getElementById("requiredmsg").innerHTML = "Please enter a Username and Password."
    }
  };


  togglePasswordVisiblity = () => {
      this.setState(
        {
            visiblity: this.state.visiblity === "password" ? "text" : "password"
        }
      )
  }
    render() {
      if(this.state.redirect){
        return <Navigate
          to={{
            pathname: "/profile/" + this.state.uName
          }} />
      }else{
        return (
            <div className="Login">
                <Navbar />
                <div className="login-container">
                  <div className="form-container">
                      <h1>Login</h1>
                      <form className="grid" onSubmit={this.handleSubmit}>
                          <label>Username:</label>
                          <input name="uName" type="text" value={this.state.uName} onChange={this.handleChange} />
                          <label>Password:</label>
                          <input id='typedpass' name="pass" type={this.state.visiblity} value={this.state.value} onChange={this.handleChange} />
                          <input type="checkbox" onClick={this.togglePasswordVisiblity} />
                          <input type="submit" value="Submit" />
                      </form>
                      <p id='requiredmsg'></p>
                  </div>
                </div>
            </div>
        );
      }
    }
  }

export default Login;
