/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/* eslint-disable no-console */
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "react-router-dom";
import {
  TextField,
  LinearProgress,
  Grid,
  Card,
  ListItemSecondaryAction,
  Typography,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  AppBar,
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SaveIcon from "@material-ui/icons/Save";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const headerTitle = {
  pageTitle: "User Profile Screen"
};

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
      isLoading: true,
      deleted: false,
      tabIndex: 0,
      openConfirmationDelete: false
    };
    this.props.setHeader(headerTitle);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }

  async componentDidMount() {
    const accessString = localStorage.getItem("JWT");
    if (accessString == null) {
      this.setState({
        isLoading: false
      });
    } else {
      await axios
        .get(process.env.REACT_APP_API_URL + "/findUser", {
          params: {
            username: this.props.match.params.username
          },
          headers: { Authorization: `JWT ${accessString}` }
        })
        .then(response => {
          this.setState({
            email: response.data.email,
            username: response.data.username,
            password: "",
            isLoading: false
          });
        })
        .catch(error => {
          this.props.enqueueSnackbar("Failed finding user.", {
            variant: "error",
            autoHideDuration: 3000
          });
          this.setState({
            isLoading: false
          });
        });
    }
  }

  deleteUser() {
    //add confirmation
    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.setState({
        isLoading: false
      });
    }
    axios
      .delete(process.env.REACT_APP_API_URL + "/deleteUser", {
        params: {
          username: this.props.match.params.username
        },
        headers: { Authorization: `JWT ${accessString}` }
      })
      .then(response => {
        this.props.enqueueSnackbar("Successfully deleted user.", {
          variant: "success",
          autoHideDuration: 3000
        });
        localStorage.removeItem("JWT");
        localStorage.removeItem("username");
        this.setState({
          deleted: true
        });
      })
      .catch(error => {
        this.props.enqueueSnackbar("Failed deleting user.", {
          variant: "error",
          autoHideDuration: 3000
        });
      });
  }

  updatePassword = e => {
    if (this.state.password.length < 8) {
      this.props.enqueueSnackbar(
        "Password must be at least 8 characters long.",
        {
          variant: "warning",
          autoHideDuration: 3000
        }
      );
    }
    if (this.state.password !== this.state.passwordConfirm) {
      this.props.enqueueSnackbar(
        "Passwords in both fields must be identical.",
        {
          variant: "warning",
          autoHideDuration: 3000
        }
      );
    }
    if (
      this.state.password.length >= 8 &&
      this.state.password === this.state.passwordConfirm
    ) {
      const accessString = localStorage.getItem("JWT");
      if (accessString === null) {
        this.props.enqueueSnackbar("You are not logged in.", {
          variant: "warning",
          autoHideDuration: 3000
        });
      } else {
        e.preventDefault();
        axios
          .put(
            process.env.REACT_APP_API_URL + "/updatePassword",
            {
              username: this.state.username,
              password: this.state.password
            },
            {
              headers: { Authorization: `JWT ${accessString}` }
            }
          )
          .then(response => {
            if (response.data.message === "password updated") {
              this.props.enqueueSnackbar("Successfully updated password.", {
                variant: "success",
                autoHideDuration: 3000
              });
              this.setState({
                tabIndex: 0
              });
            }
          })
          .catch(error => {
            this.props.enqueueSnackbar("Failed updating password.", {
              variant: "error",
              autoHideDuration: 3000
            });
          });
      }
    }
  };

  updateUser = e => {
    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.props.enqueueSnackbar("You are not logged in.", {
        variant: "warning",
        autoHideDuration: 3000
      });
    } else if (this.state.email.length < 4) {
      this.props.enqueueSnackbar("Email must be atleast 4 characters long", {
        variant: "warning",
        autoHideDuration: 3000
      });
    } else {
      e.preventDefault();
      axios
        .put(
          process.env.REACT_APP_API_URL + "/updateUser",
          {
            email: this.state.email,
            username: this.state.username
          },
          {
            headers: { Authorization: `JWT ${accessString}` }
          }
        )
        .then(response => {
          this.props.enqueueSnackbar("Successfully updated user.", {
            variant: "success",
            autoHideDuration: 3000
          });
        })
        .catch(error => {
          this.props.enqueueSnackbar("Failed updating user.", {
            variant: "error",
            autoHideDuration: 3000
          });
        });
    }
  };

  logout = e => {
    e.preventDefault();
    localStorage.removeItem("JWT");
    localStorage.removeItem("username");
    this.props.enqueueSnackbar("Successfully logged out.", {
      variant: "success",
      autoHideDuration: 3000
    });
  };
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleConfirmDelete() {
    this.setState({ openConfirmationDelete: false });
    this.deleteUser();
  }

  render() {
    const {
      email,
      username,
      password,
      isLoading,
      deleted,
      passwordConfirm,
      openConfirmationDelete
    } = this.state;
    const { classes } = this.props;
    const isAdvancedTab = this.state.tabIndex === 0 ? false : true;
    if (deleted) {
      return <Redirect to="/" />;
    }
    return (
      <Fragment>
        {isLoading && <LinearProgress />}
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
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
                <Tab label="Main" />
                <Tab label="Advanced" />
              </Tabs>
            </AppBar>
            <Toolbar>
              <Typography variant="h6" color="primary">
                {username}
              </Typography>
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Back"
                  title="Back"
                  onClick={e => this.props.history.goBack()}
                >
                  <ArrowBackIcon />
                </IconButton>
                {!isAdvancedTab && (
                  <IconButton
                    aria-label="Update User"
                    title="Update User"
                    onClick={this.updateUser}
                  >
                    <SaveIcon />
                  </IconButton>
                )}
                {isAdvancedTab && (
                  <Fragment>
                    <IconButton
                      aria-label="Delete User"
                      title="Delete User"
                      onClick={e =>
                        this.setState({ openConfirmationDelete: true })
                      }
                    >
                      <DeleteForeverIcon />
                    </IconButton>

                    <IconButton
                      aria-label="Update Password"
                      title="Update Password"
                      onClick={this.updatePassword}
                    >
                      <SaveIcon />
                    </IconButton>
                  </Fragment>
                )}
              </ListItemSecondaryAction>
            </Toolbar>
            <form noValidate autoComplete="off">
              {!isAdvancedTab && (
                <Fragment>
                  <TextField
                    id="email"
                    label="Email"
                    value={email}
                    onChange={this.handleInputChange}
                    name="email"
                    margin="normal"
                    type="email"
                    fullWidth
                  />
                  <TextField
                    id="username"
                    label="User Name"
                    value={username}
                    onChange={this.handleInputChange}
                    name="username"
                    margin="normal"
                    disabled
                    fullWidth
                  />
                </Fragment>
              )}
              {isAdvancedTab && (
                <Fragment>
                  <TextField
                    id="password"
                    label="Password"
                    value={password}
                    onChange={this.handleInputChange}
                    name="password"
                    margin="normal"
                    type="password"
                    fullWidth
                  />
                  <TextField
                    id="passwordConfirm"
                    label="Confirm Password"
                    value={passwordConfirm}
                    onChange={this.handleInputChange}
                    name="passwordConfirm"
                    margin="normal"
                    type="password"
                    fullWidth
                  />
                </Fragment>
              )}
            </form>
          </Card>
        </Grid>

        <Dialog
          open={openConfirmationDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure ?"}</DialogTitle>
          <DialogActions>
            <Button
              variant="text"
              size="small"
              className={classes.button}
              onClick={e => this.setState({ openConfirmationDelete: false })}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              onClick={this.handleConfirmDelete}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  })
};

export default withSnackbar(withStyles()(Profile));
