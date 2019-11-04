/* eslint-disable no-console */
import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { TextField, Grid, Card, CardActions, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  LinkButtons,
  SubmitButtons,
  registerButton,
  loginButton,
  forgotButton,
  inputStyle
} from "../../components";

const styles = theme => ({
  CardActions: {
    justifyContent: "right",
    width: "100%"
  }
});

const headerTitle = {
  pageTitle: "Login Screen"
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loggedIn: false,
      showError: false,
      showNullError: false
    };
    this.props.setHeader(headerTitle);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  loginUser = e => {
    e.preventDefault();
    const { username, password } = this.state;
    if (username === "" || password === "") {
      this.setState({
        showError: false,
        showNullError: true,
        loggedIn: false
      });
    } else {
      axios
        .post(process.env.REACT_APP_API_URL + "/loginUser", {
          username,
          password
        })
        .then(response => {
          // console.log(response.data);
          localStorage.setItem("JWT", response.data.token);
          localStorage.setItem("username", username);
          this.setState({
            loggedIn: true,
            showError: false,
            showNullError: false
          });
        })
        .catch(error => {
          console.error(error.response.data);
          if (
            error.response.data === "bad username" ||
            error.response.data === "passwords do not match"
          ) {
            this.setState({
              showError: true,
              showNullError: false
            });
          }
        });
    }
  };

  render() {
    const {
      username,
      password,
      showError,
      loggedIn,
      showNullError
    } = this.state;
    const { classes } = this.props;
    if (!loggedIn) {
      return (
        <Fragment>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Card>
              <form className="profile-form" onSubmit={this.loginUser}>
                <TextField
                  style={inputStyle}
                  id="username"
                  label="username"
                  value={username}
                  onChange={this.handleChange("username")}
                  placeholder="Username"
                  fullWidth
                />
                <TextField
                  style={inputStyle}
                  id="password"
                  label="password"
                  value={password}
                  onChange={this.handleChange("password")}
                  placeholder="Password"
                  type="password"
                  fullWidth
                />

                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.button}
                    type="submit"
                  >
                    Login
                  </Button>

                  <Link to={`/forgotPassword`}>
                    <Button
                      variant="text"
                      size="small"
                      className={classes.button}
                    >
                      Forgot Password
                    </Button>
                  </Link>
                </CardActions>
              </form>
              {showNullError && (
                <div>
                  <p>The username or password cannot be null.</p>
                </div>
              )}
              {showError && (
                <div>
                  <p>
                    That username or password isn&apos;t recognized. Please try
                    again or register now.
                  </p>
                  <LinkButtons
                    buttonText="Register"
                    buttonStyle={registerButton}
                    link="/register"
                  />
                </div>
              )}
            </Card>
          </Grid>
        </Fragment>
      );
    }
    return <Redirect to={`/admin`} />;
  }
}

export default withStyles(styles)(Login);
