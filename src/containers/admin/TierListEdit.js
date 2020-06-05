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
  pageTitle: "Tier List Edit"
};
class TierListEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      GameId: "",
      title: "",
      additionalInfo: "",
      imgPath: "",
      createdAt: null,
      updatedAt: null,
      startingState: {},
      deleted: false,
      openConfirmationDelete: false
    };
    this.props.setHeader(headerTitle);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.tierListAddUpdate = this.tierListAddUpdate.bind(this);
    this.returnStartingState = this.returnStartingState.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
  }
  setStartingState() {
    this.setState({
      startingState: {
        id: this.state.id,
        GameId: this.state.GameId,
        title: this.state.title,
        additionalInfo: this.state.additionalInfo,
        imgPath: this.state.imgPath,
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt
      }
    });
  }
  returnStartingState() {
    this.setState({
      id: this.state.startingState.id,
      GameId: this.state.startingState.GameId,
      title: this.state.startingState.title,
      additionalInfo: this.state.startingState.additionalInfo,
      imgPath: this.state.startingState.imgPath,
      createdAt: this.state.startingState.createdAt,
      updatedAt: this.state.startingState.updatedAt
    });
  }
  async componentDidMount() {
    const { id, tierlistid } = this.props.match.params;
    if (id) {
      this.setState({
        GameId: id
      });
      if (id && tierlistid) {
        //Implement for edit funct.
        await axios
          .get(process.env.REACT_APP_API_URL + "/getTierList/" + tierlistid)
          .then(res => {
            this.setState({
              id: res.data.tierlist.id,
              GameId: res.data.tierlist.GameId,
              title: res.data.tierlist.title,
              additionalInfo: res.data.tierlist.additionalInfo,
              imgPath: res.data.tierlist.imgPath,
              createdAt: res.data.tierlist.createdAt,
              updatedAt: res.data.tierlist.updatedAt
            });
            this.setStartingState();
          })
          .catch(err => {
            if (err.response) {
              console.error(err.response.data);
            }
          });
      }
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleCreatedAtChange = event => {
    this.setState({
      createdAt: format(new Date(event), "yyyy-MM-dd")
    });
  };

  tierListAddUpdate() {
    const accessString = localStorage.getItem("JWT");
    const isUpdate = this.state.id ? true : false;
    if (accessString === null) {
      this.setState({
        error: true
      });
    } else {
      let tierlist = {
        id: this.state.id,
        GameId: this.state.GameId,
        title: this.state.title,
        additionalInfo: this.state.additionalInfo,
        imgPath: this.state.imgPath,
        createdAt: this.state.createdAt,
        updatedAt: this.state.updatedAt
      };
      if (isUpdate) {
        axios
          .put(
            process.env.REACT_APP_API_URL + "/updateTierList",
            {
              tierlist: tierlist
            },
            {
              headers: { Authorization: `JWT ${accessString}` }
            }
          )
          .then(response => {
            this.setState({
              id: response.data.result.id,
              GameId: response.data.result.GameId,
              title: response.data.result.title,
              additionalInfo: response.data.result.additionalInfo,
              imgPath: response.data.result.imgPath,
              createdAt: response.data.result.createdAt,
              updatedAt: response.data.result.updatedAt
            });
            this.props.enqueueSnackbar("Successfully updated tier list.", {
              variant: "success",
              autoHideDuration: 3000
            });
          })
          .catch(error => {
            this.props.enqueueSnackbar(
              error.message ? error.message : "Failed updating tier list.",
              {
                variant: "error",
                autoHideDuration: 3000
              }
            );
          });
      } else {
        axios
          .post(
            process.env.REACT_APP_API_URL + "/addTierList",
            {
              tierlist: tierlist
            },
            {
              headers: { Authorization: `JWT ${accessString}` }
            }
          )
          .then(response => {
            this.setState({
              id: response.data.result.id,
              GameId: response.data.result.GameId,
              title: response.data.result.title,
              additionalInfo: response.data.result.additionalInfo,
              imgPath: response.data.result.imgPath,
              createdAt: response.data.result.createdAt,
              updatedAt: response.data.result.updatedAt
            });
            this.props.enqueueSnackbar("Successfully added tier list.", {
              variant: "success",
              autoHideDuration: 3000
            });
          })
          .catch(error => {
            this.props.enqueueSnackbar(
              error.response.data.message
                ? error.response.data.message
                : "Failed adding tierlist.",
              {
                variant: "error",
                autoHideDuration: 3000
              }
            );
          });
      }
    }
  }
  deleteTierList() {
    //add confirmation
    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.setState({
        isLoading: false
      });
    }
    axios
      .delete(process.env.REACT_APP_API_URL + "/deleteTierList", {
        params: {
          id: this.state.id
        },
        headers: { Authorization: `JWT ${accessString}` }
      })
      .then(response => {
        this.props.enqueueSnackbar("Successfully deleted tier list.", {
          variant: "success",
          autoHideDuration: 3000
        });
        this.setState({
          deleted: true
        });
      })
      .catch(error => {
        this.props.enqueueSnackbar("Failed deleting tier list.", {
          variant: "error",
          autoHideDuration: 3000
        });
      });
  }
  handleConfirmDelete() {
    this.deleteTierList();
    this.setState({ openConfirmationDelete: false });
  }
  render() {
    const {
      id,
      GameId,
      title,
      additionalInfo,
      imgPath,
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
                    aria-label="Delete Tier List"
                    title="Delete Tier List"
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
                  onClick={this.tierListAddUpdate}
                >
                  <SaveIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </Toolbar>
            <form noValidate autoComplete="off">
              <Grid container spacing={3}>
                <Grid item xs={6}>
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
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    disabled
                    id="gameid"
                    label="Game Id"
                    value={GameId}
                    name="gameid"
                    onChange={this.handleInputChange}
                    margin="normal"
                    fullWidth
                  />
                </Grid>
              </Grid>
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
                id="additionalInfo"
                label="Additional Info"
                multiline
                rows="3"
                value={additionalInfo}
                name="additionalInfo"
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

export default withSnackbar(withStyles(styles)(TierListEdit));
