import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Container  from '@material-ui/core/Container';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import clsx from 'clsx';
import SaveIcon from '@material-ui/icons/Save';

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(),
      marginRight: theme.spacing(),
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
        const { game } = this.state;
        const { classes } = this.props;
        
    function handleCreatedAtChange(date) {
        game.createdAt=React.useState(new Date(date));
    }
    function save() {
        console.log('aa');
    }
        return ( 
            <div>
                <Container maxWidth="sm">
                <Typography component="h1" variant="h5">
                        {game.title}
                </Typography>
                <form className={classes.container} noValidate autoComplete="off">
                    <TextField disabled noValidate autoComplete="off"
                        id="id"
                        label="Id"
                        value={game.id}
                        margin="normal"
                        fullWidth
                    />
                    <TextField noValidate autoComplete="off"
                        id="title"
                        label="Title"
                        value={game.title}
                        margin="normal"
                        fullWidth
                    />
                    <TextField noValidate autoComplete="off"
                        id="description"
                        label="Description"
                        multiline
                        rows="3"
                        value={game.description}
                        margin="normal"
                        fullWidth
                    />
                    <TextField noValidate autoComplete="off"
                        id="imgPath"
                        label="Image Path"
                        value={game.imgPath}
                        margin="normal"
                        fullWidth
                    />
                    <TextField noValidate autoComplete="off"
                        id="releaseDate"
                        label="Release Date"
                        value={game.releaseDate}
                        type="date"
                        margin="normal"
                        fullWidth
                    />
                    
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="mui-pickers-date"
                            label="Date picker"
                            value={game.createdAt}
                            onChange={handleCreatedAtChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                    <TextField disabled noValidate autoComplete="off"
                        id="updatedAt"
                        label="Updated At"
                        value={game.updatedAt}
                        type="date"
                        margin="normal"
                        fullWidth
                    />
                    <Button variant="contained" size="small" className={classes.button} onClick={save}>
                        <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
                        Save
                    </Button>
                </form>
                </Container>
            </div>
        );
    }
}
 
export default withStyles(styles)(GameEdit);