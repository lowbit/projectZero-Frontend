import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  });
class GameEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game:{
                id:'',
                title:'',
                description:'',
                imgPath:'',
                releaseDate:'',
                createdAt:'',
                updatedAt:''
            }}
    }
    async componentDidMount() {
        
        const { id } = this.props.match.params;
        if (id){
        await axios
            .get(process.env.REACT_APP_API_URL+'/getGame/'+id)
            .then((res)=>{
                this.setState({
                    game:res.data.game
                })
            }).catch((err)=>{
                console.error(err.response.data);
                this.setState({
                    error: true,
                });
            });
        }
    }
    render() { 
        const {game} = this.state;
        const { classes } = this.props;
        
        return ( 
            <div>
                
                <Typography component="h1" variant="h5">
                        {game.title}
                </Typography>
                <form className={classes.container} noValidate autoComplete="off">
                    <TextField disabled noValidate autoComplete="off"
                        id="id"
                        label="Id"
                        value={game.id}
                        margin="normal"
                        className={classes.textField}
                    />
                    <TextField noValidate autoComplete="off"
                        id="title"
                        label="Title"
                        value={game.title}
                        margin="normal"
                        className={classes.textField}
                    />
                    <TextField noValidate autoComplete="off"
                        id="description"
                        label="Description"
                        multiline
                        rows="3"
                        value={game.description}
                        margin="normal"
                        className={classes.textField}
                    />
                    <TextField noValidate autoComplete="off"
                        id="imgPath"
                        label="Image Path"
                        value={game.imgPath}
                        margin="normal"
                        className={classes.textField}
                    />
                    <TextField noValidate autoComplete="off"
                        id="releaseDate"
                        label="Release Date"
                        value={game.releaseDate}
                        type="date"
                        margin="normal"
                        className={classes.textField}
                    />
                    <TextField disabled noValidate autoComplete="off"
                        id="createdAt"
                        label="createdAt"
                        value={game.createdAt}
                        type="date"
                        margin="normal"
                        className={classes.textField}
                    />
                    <TextField disabled noValidate autoComplete="off"
                        id="updatedAt"
                        label="Updated At"
                        value={game.updatedAt}
                        type="date"
                        margin="normal"
                        className={classes.textField}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                    Add
                    </Button>
                </form>
            </div>
        );
    }
}
 
export default withStyles(styles)(GameEdit);