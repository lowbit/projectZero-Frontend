import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Axios from "axios";
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Toolbar,
  Card
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

const title = {
  pageTitle: "Admin Home"
};
const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
    "& > span": {
      margin: theme.spacing(2)
    }
  },
  iconHover: {
    "&:hover": {
      color: "#CCC"
    }
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  }
});
class AdminHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: []
    };
    this.props.setHeader(title);
  }
  async componentDidMount() {
    const accessString = localStorage.getItem("JWT");
    await Axios.get(process.env.REACT_APP_API_URL + "/getGames", {
      headers: { Authorization: `JWT ${accessString}` }
    })
      .then(response => {
        this.setState({
          games: response.data.games,
          isloading: false,
          error: false
        });
      })
      .catch(err => {
        console.error(err.response.data);
        this.setState({
          error: true
        });
      });
  }
  editGame = gameId => {};
  render() {
    const { classes } = this.props;
    const { dense } = this.state;
    return (
      <Fragment>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Card>
              <Toolbar variant="regular">
                <Typography variant="h6">Games</Typography>
                <ListItemSecondaryAction>
                  <Link to={`/gameEdit/`}>
                    <IconButton aria-label="Add">
                      <AddIcon />
                    </IconButton>
                  </Link>
                </ListItemSecondaryAction>
              </Toolbar>
              <div className={classes.demo}>
                <List dense={dense}>
                  {this.state.games.map(game => (
                    <div key={game.id}>
                      <ListItem divider>
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={game.title} />
                        <ListItemSecondaryAction>
                          <Link to={`/gameEdit/${game.id}`}>
                            <IconButton aria-label="Edit">
                              <EditIcon />
                            </IconButton>
                          </Link>
                          <Link to={`/tierListEdit/${game.id}`}>
                            <IconButton aria-label="Add Tier List">
                              <AddIcon />
                            </IconButton>
                          </Link>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </div>
                  ))}
                </List>
              </div>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>aa</Card>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(AdminHome);
