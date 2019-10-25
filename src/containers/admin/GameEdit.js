import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { format } from 'date-fns';
import clsx from 'clsx';
import SaveIcon from '@material-ui/icons/Save';
import BasicDatePicker from '../../components/BasicDatePicker';
import ImgHandler from '../../components/ImgHandler';
import { withSnackbar } from 'notistack';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 200
  },
  dense: {
    marginTop: 19
  },
  menu: {
    width: 200
  }
});
class GameEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      title: '',
      description: '',
      imgPath: '',
      releaseDate: '',
      createdAt: new Date(),
      updatedAt: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.gameAddUpdate = this.gameAddUpdate.bind(this);
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      await axios
        .get(process.env.REACT_APP_API_URL + '/getGame/' + id)
        .then(res => {
          this.setState({
            id: res.data.game.id,
            title: res.data.game.title,
            description: res.data.game.description,
            imgPath: res.data.game.imgPath,
            releaseDate: res.data.game.releaseDate,
            createdAt: res.data.game.createdAt,
            updatedAt: res.data.game.updatedAt
          });
        })
        .catch(err => {
          console.error(err.response.data);
          this.setState({
            error: true
          });
        });
    }
  }

  handleInputChange(event, dateName) {
    if (!dateName) {
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    } else {
      this.setState({
        [dateName]: format(new Date(event), 'yyyy-MM-dd')
      });
    }
  }

  handleCreatedAtChange = event => {
    this.setState({
      createdAt: format(new Date(event), 'yyyy-MM-dd')
    });
  };

  gameAddUpdate() {
    const accessString = localStorage.getItem('JWT');
    const isUpdate = this.state.id ? true : false;
    if (accessString === null) {
      this.setState({
        error: true
      });
    } else {
      let game = {
        id: this.state.id,
        title: this.state.title,
        description: this.state.description,
        imgPath: this.state.imgPath,
        releaseDate: this.state.releaseDate,
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt
      };
      if (isUpdate) {
        axios
          .put(
            process.env.REACT_APP_API_URL + '/updateGame',
            {
              game: game
            },
            {
              headers: { Authorization: `JWT ${accessString}` }
            }
          )
          .then(response => {
            console.log('sucessful');
            this.setState({
              id: response.data.result.id,
              title: response.data.result.title,
              description: response.data.result.description,
              imgPath: response.data.result.imgPath,
              releaseDate: response.data.result.releaseDate,
              createdAt: response.data.result.createdAt,
              updatedAt: response.data.result.updatedAt
            });
            this.props.enqueueSnackbar('Successfully updated game.', {
              variant: 'success',
              autoHideDuration: 3000
            });
          })
          .catch(error => {
            console.log('error');
            this.setState({
              error: true
            });
          });
      } else {
        axios
          .post(process.env.REACT_APP_API_URL + '/addGame', {
            game: game
          })
          .then(response => {
            console.log('sucessful');
          })
          .catch(error => {
            console.log('error');
            this.setState({
              error: true
            });
          });
      }
    }
  }
  render() {
    const {
      id,
      title,
      description,
      imgPath,
      releaseDate,
      createdAt,
      updatedAt
    } = this.state;
    const { classes } = this.props;

    return (
      <div>
        <Container maxWidth="sm">
          <Typography variant="h5">{title}</Typography>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              disabled
              id="id"
              label="Id"
              value={id}
              name="id"
              onChange={this.handleInputChange}
              margin="normal"
              fullWidth
            />
            <TextField
              id="title"
              label="Title"
              value={title}
              name="title"
              onChange={this.handleInputChange}
              margin="normal"
              fullWidth
            />
            <TextField
              id="description"
              label="Description"
              multiline
              rows="3"
              value={description}
              name="description"
              onChange={this.handleInputChange}
              margin="normal"
              fullWidth
            />
            <ImgHandler
              id={id}
              label="Image Path"
              value={imgPath}
              classes={classes}
            />
            <BasicDatePicker
              label="Release Date"
              name="releaseDate"
              value={releaseDate}
              onChange={this.handleInputChange}
              margin="normal"
            />
            <BasicDatePicker
              label="Created At"
              name="createdAt"
              value={createdAt}
              onChange={this.handleInputChange}
              margin="normal"
              disabled
            />
            <BasicDatePicker
              label="Modified At"
              name="updatedAt"
              value={updatedAt}
              onChange={this.handleInputChange}
              margin="normal"
              disabled
            />
            <Button
              variant="contained"
              size="small"
              className={classes.button}
              onClick={this.gameAddUpdate}
            >
              <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
              Save
            </Button>
          </form>
        </Container>
      </div>
    );
  }
}

export default withSnackbar(withStyles(styles)(GameEdit));
