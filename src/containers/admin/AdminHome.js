import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Axios from 'axios';
import { HeaderBar } from '../../components';
import { Grid, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom';

const title = {
    pageTitle: "Admin Home"
}
const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
});
class AdminHome extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            games:[]
         }
    }
    async componentDidMount() {
        const accessString = localStorage.getItem('JWT');
        await Axios.get(process.env.REACT_APP_API_URL+'/getGames',
        {headers: {Authorization:`JWT ${accessString}`}})
            .then((response)=>{
                this.setState({
                    games:response.data.games,
                    isloading:false,
                    error:false
                });
            }).catch((err)=>{
                console.error(err.response.data);
                this.setState({
                    error:true
                });
            });
    }
    editGame = (gameId) =>{

    }
    render() { 
        const { classes } = this.props;
        const { dense } = this.state;
        return ( 
        <div>
            <HeaderBar title={title} />
            <Grid item xs={12} md={6}>
            <Typography variant="h6" className={classes.title}>
              Games
            </Typography>
            <div className={classes.demo}>
              <List dense={dense}>
                
            {this.state.games.map(game=>(
                <div key={game.id}>
                <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <FolderIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={game.title}
                    />
                    <ListItemSecondaryAction>
                      <Link to={`/gameEdit/${game.id}`}>
                      <IconButton aria-label="Edit">
                        <EditIcon />
                      </IconButton>
                      </Link>
                    </ListItemSecondaryAction>
                  </ListItem>
                </div>
            ))}
              </List>
            </div>
          </Grid>
        </div> 
        );
    }
}
 
export default withStyles(styles)(AdminHome);