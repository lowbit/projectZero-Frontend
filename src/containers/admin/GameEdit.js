import React, { Component } from "react";
import axios from "axios";
import {
  TextField,
  Typography,
  Toolbar,
  ListItemSecondaryAction,
  Grid
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Container, Card, IconButton } from "@material-ui/core";
import { format } from "date-fns";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import BasicDatePicker from "../../components/BasicDatePicker";
import ImgHandler from "../../components/ImgHandler";
import { withSnackbar } from "notistack";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    paddingLeft: "24px",
    paddingRight: "24px",
    paddingBottom: "12px"
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
      startingState: {}
    };
    this.props.setHeader(headerTitle);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.gameAddUpdate = this.gameAddUpdate.bind(this);
    this.returnStartingState = this.returnStartingState.bind(this);
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
          <Card>
            <Toolbar>
              <Typography variant="h6" color="primary">
                {title}
              </Typography>
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Back"
                  onClick={e => this.props.history.goBack()}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  aria-label="Clear"
                  onClick={this.returnStartingState}
                >
                  <ClearIcon />
                </IconButton>
                <IconButton aria-label="Save" onClick={this.gameAddUpdate}>
                  <SaveIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </Toolbar>
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
      </div>
    );
  }
}

export default withSnackbar(withStyles(styles)(GameEdit));
