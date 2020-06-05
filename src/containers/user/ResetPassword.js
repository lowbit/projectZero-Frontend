import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

import {
  Grid,
  Card,
  Typography,
  TextField,
  Toolbar,
  Button,
  CardActions
} from "@material-ui/core";

const styles = theme => ({
  CardActions: {
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "row-reverse"
  }
});

const headerTitle = {
  pageTitle: "Password Reset Screen"
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      updated: false,
      isLoading: true,
      error: false
    };
    this.props.setHeader(headerTitle);
  }

  async componentDidMount() {
    await axios
      .get(process.env.REACT_APP_API_URL + "/reset", {
        params: {
          resetPasswordToken: this.props.match.params.token
        }
      })
      .then(response => {
        console.log(response);
        if (response.data.message === "password reset link a-ok") {
          this.setState({
            username: response.data.username,
            updated: false,
            isLoading: false,
            error: false
          });
        }
      })
      .catch(error => {
        console.log(error.response.data);
        this.setState({
          updated: false,
          isLoading: false,
          error: true
        });
      });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  updatePassword = e => {
    e.preventDefault();
    axios
      .put(process.env.REACT_APP_API_URL + "/updatePasswordViaEmail", {
        username: this.state.username,
        password: this.state.password,
        resetPasswordToken: this.props.match.params.token
      })
      .then(response => {
        console.log(response.data);
        if (response.data.message === "password updated") {
          this.setState({
            updated: true,
            error: false
          });
        } else {
          this.setState({
            updated: false,
            error: true
          });
        }
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  render() {
    const { password, error, updated, isLoading } = this.state;
    const { classes } = this.props;

    if (error) {
      return (
        <Fragment>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            xs={12}
          >
            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <Toolbar>
                  <Typography variant="h6" color="primary">
                    Reset Password
                  </Typography>
                </Toolbar>
                <form className="password-form">
                  <Typography variant="p">
                    Problem resetting password. Please send another reset link.
                  </Typography>
                  <CardActions className={classes.CardActions}>
                    <Link to="/login">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.button}
                      >
                        Login
                      </Button>
                    </Link>

                    <Link to="/">
                      <Button
                        variant="text"
                        size="small"
                        className={classes.button}
                      >
                        Go Home
                      </Button>
                    </Link>
                  </CardActions>
                </form>

                {updated && <Redirect to={`/admin`} />}
              </Card>
            </Grid>
          </Grid>
        </Fragment>
      );
    }
    if (!error && !isLoading) {
      return (
        <Fragment>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            xs={12}
          >
            <Grid item xs={12} md={4} lg={3}>
              <Card>
                <Toolbar>
                  <Typography variant="h6" color="primary">
                    Reset Password
                  </Typography>
                </Toolbar>
                <form className="password-form" onSubmit={this.updatePassword}>
                  <TextField
                    id="password"
                    label="password"
                    onChange={this.handleChange("password")}
                    value={password}
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
                      Update Password
                    </Button>

                    <Link to="/">
                      <Button
                        variant="text"
                        size="small"
                        className={classes.button}
                      >
                        Go Home
                      </Button>
                    </Link>
                  </CardActions>
                </form>

                {updated && <Redirect to={`/admin`} />}
              </Card>
            </Grid>
          </Grid>
        </Fragment>
      );
    }
    return <Fragment />;
  }
}

ResetPassword.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired
    })
  })
};

export default withStyles(styles)(ResetPassword);
