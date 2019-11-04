import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

import {
  LinkButtons,
  SubmitButtons,
  homeButton,
  cancelButton,
  saveButton,
  loginButton,
  inputStyle
} from "../../components";

const loading = {
  margin: "1em",
  fontSize: "24px"
};

const headerTitle = {
  pageTitle: "Update User Profile Screen"
};

class UpdateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      username: "",
      password: "",
      loadingUser: false,
      updated: false,
      error: false
    };
    this.props.setHeader(headerTitle);
  }

  componentDidMount() {
    this.setState({ loadingUser: true });

    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.setState({
        loadingUser: false,
        error: true
      });
    }

    axios
      .get(process.env.REACT_APP_API_URL + "/findUser", {
        params: {
          username: this.props.match.params.username
        },
        headers: { Authorization: `JWT ${accessString}` }
      })
      .then(response => {
        this.setState({
          loadingUser: false,
          email: response.data.email,
          username: response.data.username,
          password: response.data.password,
          error: false
        });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  updateUser = e => {
    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.setState({
        loadingUser: false,
        error: true
      });
    }

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
        this.setState({
          updated: true,
          error: false
        });
      })
      .catch(error => {
        console.log(error.response.data);
        this.setState({
          loadingUser: false,
          error: true
        });
      });
  };

  render() {
    const {
      email,
      username,
      password,
      updated,
      error,
      loadingUser
    } = this.state;

    if (error) {
      return (
        <div>
          <p style={loading}>
            There was a problem accessing your data. Please go login again.
          </p>
          <LinkButtons
            style={loginButton}
            buttonText="Go Login"
            link="/login"
          />
        </div>
      );
    }
    if (loadingUser !== false) {
      return (
        <div>
          <p style={loading}>Loading user data...</p>
        </div>
      );
    }
    if (loadingUser === false && updated === true) {
      return <Redirect to={`/userProfile/${username}`} />;
    }
    if (loadingUser === false) {
      return (
        <div>
          <form className="profile-form" onSubmit={this.updateUser}>
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
              readOnly
              disabled
            />
            <TextField
              style={inputStyle}
              id="password"
              label="password"
              value={password}
              readOnly
              disabled
              type="password"
            />
            <SubmitButtons buttonStyle={saveButton} buttonText="Save Changes" />
          </form>
          <LinkButtons buttonStyle={homeButton} buttonText="Go Home" link="/" />
          <LinkButtons
            buttonStyle={cancelButton}
            buttonText="Cancel Changes"
            link={`/userProfile/${username}`}
          />
        </div>
      );
    }
  }
}

UpdateProfile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  })
};

export default UpdateProfile;
