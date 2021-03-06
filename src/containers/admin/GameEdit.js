import React, { Component, Fragment } from "react";
import axios from "axios";
import {
  TextField,
  Typography,
  Toolbar,
  ListItemSecondaryAction,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Container, Card, IconButton } from "@material-ui/core";
import { format } from "date-fns";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Redirect } from "react-router-dom";

import BasicDatePicker from "../../components/BasicDatePicker";
import ImgHandler from "../../components/ImgHandler";
import { withSnackbar } from "notistack";

const styles = theme => ({
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
const headerTitle = {
  pageTitle: "Game Edit"
};
class GameEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      title: "",
      description: "",
      imgPath: "",
      releaseDate: null,
      createdAt: null,
      updatedAt: null,
      startingState: {},
      deleted: false,
      openConfirmationDelete: false
    };
    this.props.setHeader(headerTitle);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.gameAddUpdate = this.gameAddUpdate.bind(this);
    this.returnStartingState = this.returnStartingState.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }
  setStartingState() {
    this.setState({
      startingState: {
        id: this.state.id,
        title: this.state.title,
        description: this.state.description,
        imgPath: this.state.imgPath,
        releaseDate: this.state.releaseDate,
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt
      }
    });
  }
  returnStartingState() {
    this.setState({
      id: this.state.startingState.id,
      title: this.state.startingState.title,
      description: this.state.startingState.description,
      imgPath: this.state.startingState.imgPath,
      releaseDate: this.state.startingState.releaseDate,
      createdAt: this.state.startingState.createdAt,
      updatedAt: this.state.startingState.updatedAt
    });
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      await axios
        .get(process.env.REACT_APP_API_URL + "/getGame/" + id)
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
          this.setStartingState();
        })
        .catch(err => {
          if (err.response) {
            console.error(err.response.data);
          }
        });
    } else {
      this.setState({
        id: "",
        title: "",
        description: "",
        imgPath: "",
        releaseDate: format(new Date(), "yyyy-MM-dd"),
        createdAt: null,
        updatedAt: null
      });
      this.setStartingState();
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
        [dateName]: format(new Date(event), "yyyy-MM-dd")
      });
    }
  }

  handleCreatedAtChange = event => {
    this.setState({
      createdAt: format(new Date(event), "yyyy-MM-dd")
    });
  };

  gameAddUpdate() {
    const accessString = localStorage.getItem("JWT");
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
            process.env.REACT_APP_API_URL + "/updateGame",
            {
              game: game
            },
            {
              headers: { Authorization: `JWT ${accessString}` }
            }
          )
          .then(response => {
            this.setState({
              id: response.data.result.id,
              title: response.data.result.title,
              description: response.data.result.description,
              imgPath: response.data.result.imgPath,
              releaseDate: response.data.result.releaseDate,
              createdAt: response.data.result.createdAt,
              updatedAt: response.data.result.updatedAt
            });
            this.props.enqueueSnackbar("Successfully updated game.", {
              variant: "success",
              autoHideDuration: 3000
            });
          })
          .catch(error => {
            this.props.enqueueSnackbar(
              error.message ? error.message : "Failed updating game.",
              {
                variant: "error",
                autoHideDuration: 3000
              }
            );
          });
      } else {
        axios
          .post(
            process.env.REACT_APP_API_URL + "/addGame",
            {
              game: game
            },
            {
              headers: { Authorization: `JWT ${accessString}` }
            }
          )
          .then(response => {
            this.props.enqueueSnackbar("Successfully added game.", {
              variant: "success",
              autoHideDuration: 3000
            });
          })
          .catch(error => {
            this.props.enqueueSnackbar(
              error.response.data.message
                ? error.response.data.message
                : "Failed adding game.",
              {
                variant: "error",
                autoHideDuration: 3000
              }
            );
          });
      }
    }
  }
  deleteGame() {
    //add confirmation
    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.setState({
        isLoading: false
      });
    }
    axios
      .delete(process.env.REACT_APP_API_URL + "/deleteGame", {
        params: {
          id: this.state.id
        },
        headers: { Authorization: `JWT ${accessString}` }
      })
      .then(response => {
        this.props.enqueueSnackbar("Successfully deleted game.", {
          variant: "success",
          autoHideDuration: 3000
        });
        this.setState({
          deleted: true
        });
      })
      .catch(error => {
        this.props.enqueueSnackbar("Failed deleting game.", {
          variant: "error",
          autoHideDuration: 3000
        });
      });
  }
  handleConfirmDelete() {
    this.deleteGame();
    this.setState({ openConfirmationDelete: false });
  }
  render() {
    const {
      id,
      title,
      description,
      imgPath,
      releaseDate,
      createdAt,
      updatedAt,
      deleted,
      openConfirmationDelete
    } = this.state;
    const { classes } = this.props;
    if (deleted) {
      return <Redirect to="/admin" />;
    }
    return (
      <Fragment>
        <Container maxWidth="sm">
          <Card>
            <Toolbar>
              <Typography variant="h6" color="primary">
                {title}
              </Typography>
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Back"
                  title="Back"
                  onClick={e => this.props.history.goBack()}
                >
                  <ArrowBackIcon />
                </IconButton>
                {id && (
                  <IconButton
                    aria-label="Delete Game"
                    title="Delete Game"
                    onClick={e =>
                      this.setState({ openConfirmationDelete: true })
                    }
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                )}
                <IconButton
                  aria-label="Clear"
                  title="Clear changes"
                  onClick={this.returnStartingState}
                >
                  <ClearIcon />
                </IconButton>
                <IconButton
                  aria-label="Save"
                  title="Save"
                  onClick={this.gameAddUpdate}
                >
                  <SaveIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </Toolbar>
            <form noValidate autoComplete="off">
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
                title={title}
                label="Image Path"
                value={imgPath}
                onUpload={e => this.setState({ imgPath: e })}
              />
              <BasicDatePicker
                label="Release Date"
                name="releaseDate"
                value={releaseDate}
                onChange={this.handleInputChange}
                margin="normal"
              />

              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <BasicDatePicker
                    label="Created At"
                    name="createdAt"
                    value={createdAt}
                    onChange={this.handleInputChange}
                    margin="normal"
                    disabled
                  />
                </Grid>
                <Grid item xs={6}>
                  <BasicDatePicker
                    label="Modified At"
                    name="updatedAt"
                    value={updatedAt}
                    onChange={this.handleInputChange}
                    margin="normal"
                    disabled
                  />
                </Grid>
              </Grid>
            </form>
          </Card>
        </Container>
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

export default withSnackbar(withStyles(styles)(GameEdit));
