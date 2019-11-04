/* eslint-disable no-console */
/* eslint-disable camelcase */
import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

import {
  LinkButtons,
  SubmitButtons,
  registerButton,
  homeButton,
  loginButton,
  inputStyle
} from "../../components";

const headerTitle = {
  pageTitle: "Register Screen"
};

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      username: "",
      password: "",
      messageFromServer: "",
      showError: false,
      registerError: false,
      loginError: false
    };
    this.props.setHeader(headerTitle);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  registerUser = e => {
    e.preventDefault();
    const { username, password, email } = this.state;
    if (username === "" || password === "" || email === "") {
      this.setState({
        showError: true,
        loginError: false,
        registerError: true
      });
    } else {
      axios
        .post(process.env.REACT_APP_API_URL + "/registerUser", {
          email,
          username,
          password
        })
        .then(response => {
          // console.log(response.data.message);
          this.setState({
            messageFromServer: response.data.message,
            showError: false,
            loginError: false,
            registerError: false
          });
        })
        .catch(error => {
          console.error(error.response.data);
          if (error.response.data === "username or email already taken") {
            this.setState({
              showError: true,
              loginError: true,
              registerError: false
            });
          }
        });
    }
  };

  render() {
    const {
      email,
      username,
      password,
      messageFromServer,
      showError,
      loginError,
      registerError
    } = this.state;

    if (messageFromServer === "") {
      return (
        <div>
          <form className="profile-form" onSubmit={this.registerUser}>
            <TextField
              style={inputStyle}
              id="email"
              label="email"
              value={email}
              onChange={this.handleChange("email")}
              placeholder="Email"
            />
            <TextField
              style={inputStyle}
              id="username"
              label="username"
              value={username}
              onChange={this.handleChange("username")}
              placeholder="Username"
            />
            <TextField
              style={inputStyle}
              id="password"
              label="password"
              value={password}
              onChange={this.handleChange("password")}
              placeholder="Password"
              type="password"
            />
            <SubmitButtons buttonStyle={registerButton} buttonText="Register" />
          </form>
          {showError === true && registerError === true && (
            <div>
              <p>Username, password and email are required fields.</p>
            </div>
          )}
          {showError === true && loginError === true && (
            <div>
              <p>
                That username or email is already taken. Please choose another
                or login.
              </p>
              <LinkButtons
                buttonText="Login"
                buttonStyle={loginButton}
                link="/login"
              />
            </div>
          )}
          <LinkButtons buttonText="Go Home" buttonStyle={homeButton} link="/" />
        </div>
      );
    }
    if (messageFromServer === "user created") {
      return (
        <div>
          <h3>User successfully registered!</h3>
          <LinkButtons
            buttonText="Go Login"
            buttonStyle={loginButton}
            link="/login"
          />
        </div>
      );
    }
  }
}

export default Register;
