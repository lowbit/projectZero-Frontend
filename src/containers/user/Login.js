/* eslint-disable no-console */
import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import {
  TextField,
  Grid,
  Card,
  CardActions,
  Button,
  IconButton,
  ListItemSecondaryAction,
  Typography,
  Toolbar,
  AppBar,
  Tab,
  Tabs
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { withSnackbar } from "notistack";

const styles = theme => ({
  CardActions: {
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row-reverse"
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
      tabIndex: 0,
      forgotPasswordToggle: false,
      registeredEmail: "",
      registeredUsername: "",
      registeredPassword: "",
      resetPasswordEmail: ""
    };
    this.props.setHeader(headerTitle);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  loginUser = e => {
    e.preventDefault();
    const { username, password } = this.state;
    if (username === "" || password === "") {
      this.props.enqueueSnackbar("The username or password cannot be null.", {
        variant: "error",
        autoHideDuration: 3000
      });
    } else {
      axios
        .post(process.env.REACT_APP_API_URL + "/loginUser", {
          username: username,
          password: password
        })
        .then(response => {
          localStorage.setItem("JWT", response.data.token);
          localStorage.setItem("username", username);

          this.props.enqueueSnackbar("Succesfully logged in", {
            variant: "success",
            autoHideDuration: 3000
          });
          this.setState({ loggedIn: true });
        })
        .catch(error => {
          if (
            error.response &&
            (error.response.data === "bad username" ||
              error.response.data === "passwords do not match")
          ) {
            this.props.enqueueSnackbar(
              "That username or password isn't recognized. Please try again or register now.",
              {
                variant: "error",
                autoHideDuration: 3000
              }
            );
          } else {
            this.props.enqueueSnackbar("Failed trying to log in.", {
              variant: "error",
              autoHideDuration: 3000
            });
          }
        });
    }
  };
  registerUser = e => {
    e.preventDefault();
    const {
      registeredUsername,
      registeredPassword,
      registeredEmail
    } = this.state;
    if (registeredUsername.length < 4) {
      this.props.enqueueSnackbar("Username must be at least 4 letters.", {
        variant: "error",
        autoHideDuration: 3000
      });
      return;
    }
    if (registeredEmail.length < 4) {
      this.props.enqueueSnackbar("Email must be at least 4 letters.", {
        variant: "error",
        autoHideDuration: 3000
      });
      return;
    }
    if (registeredPassword.length < 8) {
      this.props.enqueueSnackbar("Password must be at least 8 characters.", {
        variant: "error",
        autoHideDuration: 3000
      });
      return;
    }
    axios
      .post(process.env.REACT_APP_API_URL + "/registerUser", {
        email: registeredEmail,
        username: registeredUsername,
        password: registeredPassword
      })
      .then(response => {
        this.props.enqueueSnackbar(
          "Succesfully registered user. Please Login",
          {
            variant: "success",
            autoHideDuration: 5000
          }
        );
        this.setState({
          tabIndex: 0
        });
      })
      .catch(error => {
        this.props.enqueueSnackbar("Failed registering user.", {
          variant: "error",
          autoHideDuration: 3000
        });
      });
  };

  sendEmail = e => {
    e.preventDefault();
    const { resetPasswordEmail } = this.state;
    if (resetPasswordEmail === "") {
      this.props.enqueueSnackbar("Please enter email address", {
        variant: "error",
        autoHideDuration: 3000
      });
    } else {
      axios
        .post(process.env.REACT_APP_API_URL + "/forgotPassword", {
          email: resetPasswordEmail
        })
        .then(response => {
          if (response.data === "recovery email sent") {
            this.props.enqueueSnackbar("Recovery email has been sent.", {
              variant: "success",
              autoHideDuration: 3000
            });
            this.setState({
              forgotPasswordToggle: false
            });
          }
        })
        .catch(error => {
          console.error(error.response.data);
          if (error.response.data === "email not in db") {
            this.props.enqueueSnackbar(
              "Email has not been found in the database",
              {
                variant: "error",
                autoHideDuration: 3000
              }
            );
          }
        });
    }
  };
  render() {
    const {
      username,
      password,
      loggedIn,
      registeredEmail,
      registeredUsername,
      registeredPassword,
      resetPasswordEmail,
      forgotPasswordToggle
    } = this.state;
    const { classes } = this.props;
    const isRegisterTab = this.state.tabIndex === 0 ? false : true;
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
            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <AppBar position="static" color="default">
                  <Tabs
                    value={this.state.tabIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    onChange={(e, index) => {
                      this.setState({
                        tabIndex: index
                      });
                    }}
                  >
                    <Tab label="Login" />
                    <Tab label="Register" />
                  </Tabs>
                </AppBar>
                <Toolbar>
                  <Typography variant="h6" color="primary">
                    {isRegisterTab ? "Register" : "Login"}
                  </Typography>
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="Back"
                      onClick={e => this.props.history.goBack()}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </Toolbar>
                {!isRegisterTab && (
                  <Fragment>
                    {!forgotPasswordToggle && (
                      <form className="profile-form" onSubmit={this.loginUser}>
                        <TextField
                          id="username"
                          name="username"
                          label="Username"
                          value={username}
                          onChange={this.handleChange}
                          fullWidth
                        />
                        <TextField
                          id="password"
                          name="password"
                          label="Password"
                          value={password}
                          onChange={this.handleChange}
                          type="password"
                          fullWidth
                        />
                        <CardActions className={classes.CardActions}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            type="submit"
                          >
                            Login
                          </Button>
                          <Button
                            variant="text"
                            size="small"
                            className={classes.button}
                            onClick={e =>
                              this.setState({
                                forgotPasswordToggle: true
                              })
                            }
                          >
                            Forgot Password
                          </Button>
                        </CardActions>
                      </form>
                    )}
                    {forgotPasswordToggle && (
                      <form className="profile-form" onSubmit={this.sendEmail}>
                        <TextField
                          id="resetPasswordEmail"
                          name="resetPasswordEmail"
                          label="Email"
                          value={resetPasswordEmail}
                          onChange={this.handleChange}
                          placeholder="Email Address"
                          fullWidth
                        />
                        <CardActions className={classes.CardActions}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            type="submit"
                          >
                            Send Password Reset Email
                          </Button>
                        </CardActions>
                      </form>
                    )}
                  </Fragment>
                )}
                {isRegisterTab && (
                  <form className="profile-form" onSubmit={this.registerUser}>
                    <TextField
                      id="registeredEmail"
                      name="registeredEmail"
                      label="Email"
                      value={registeredEmail}
                      onChange={this.handleChange}
                      fullWidth
                    />
                    <TextField
                      id="registeredUsername"
                      name="registeredUsername"
                      label="Username"
                      value={registeredUsername}
                      onChange={this.handleChange}
                      fullWidth
                    />
                    <TextField
                      id="registeredPassword"
                      name="registeredPassword"
                      label="Password"
                      value={registeredPassword}
                      onChange={this.handleChange}
                      type="password"
                      fullWidth
                    />

                    <CardActions className={classes.CardActions}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.button}
                        type="submit"
                      >
                        Register
                      </Button>
                    </CardActions>
                  </form>
                )}
              </Card>
            </Grid>
          </Grid>
        </Fragment>
      );
    }
    return <Redirect to={`/admin`} />;
  }
}

export default withSnackbar(withStyles(styles)(Login));
