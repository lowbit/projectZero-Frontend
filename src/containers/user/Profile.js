/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import {
  LinkButtons,
  deleteButton,
  updateButton,
  loginButton,
  HeaderBar,
  forgotButton,
} from '../../components';

const loading = {
  margin: '1em',
  fontSize: '24px',
};

const title = {
  pageTitle: 'User Profile Screen',
};

class Profile extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      username: '',
      password: '',
      isLoading: true,
      deleted: false,
      error: false,
    };
  }

  async componentDidMount() {
    const accessString = localStorage.getItem('JWT');
    if (accessString == null) {
      this.setState({
        isLoading: false,
        error: true,
      });
    } else {
      await axios
        .get(process.env.REACT_APP_API_URL+'/findUser', {
          params: {
            username: this.props.match.params.username,
          },
          headers: { Authorization: `JWT ${accessString}` },
        })
        .then((response) => {
          this.setState({
            email: response.data.email,
            username: response.data.username,
            password: response.data.password,
            isLoading: false,
            error: false,
          });
        })
        .catch((error) => {
          console.error(error.response.data);
          this.setState({
            error: true,
          });
        });
    }
  }

  deleteUser = (e) => {
    const accessString = localStorage.getItem('JWT');
    if (accessString === null) {
      this.setState({
        isLoading: false,
        error: true,
      });
    }

    e.preventDefault();
    axios
      .delete(process.env.REACT_APP_API_URL+'/deleteUser', {
        params: {
          username: this.props.match.params.username,
        },
        headers: { Authorization: `JWT ${accessString}` },
      })
      .then((response) => {
        console.log(response.data);
        localStorage.removeItem('JWT');
        localStorage.removeItem('username');
        this.setState({
          deleted: true,
        });
      })
      .catch((error) => {
        console.error(error.response.data);
        this.setState({
          error: true,
        });
      });
  };

  logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('JWT');
    localStorage.removeItem('username');
  };

  render() {
    const {
      email,
      username,
      password,
      error,
      isLoading,
      deleted,
    } = this.state;

    if (error) {
      return (
        <div>
          <HeaderBar title={title} />
          <div style={loading}>
            Problem fetching user data. Please login again.
          </div>
          <LinkButtons
            buttonText="Login"
            buttonStyle={loginButton}
            link="/login"
          />
        </div>
      );
    }
    if (isLoading) {
      return (
        <div>
          <HeaderBar title={title} />
          <div style={loading}>Loading User Data...</div>
        </div>
      );
    }
    if (deleted) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <HeaderBar title={title} />
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>{email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>{username}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Password</TableCell>
              <TableCell style={{ WebkitTextSecurity: 'disc' }}>
                {password}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button
          style={deleteButton}
          variant="contained"
          color="primary"
          onClick={this.deleteUser}
        >
          Delete User
        </Button>
        <LinkButtons
          buttonStyle={updateButton}
          buttonText="Update Email"
          link={`/updateUser/${username}`}
        />
        <LinkButtons
          buttonStyle={forgotButton}
          buttonText="Update Password"
          link={`/updatePassword/${username}`}
        />
      </div>
    );
  }
}

Profile.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
  }),
};

export default Profile;