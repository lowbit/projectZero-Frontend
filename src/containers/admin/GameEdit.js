import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Container  from '@material-ui/core/Container';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns'
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
            id:'',
            title:'',
            description:'',
            imgPath:'',
            releaseDate:'',
            createdAt:new Date(),
            updatedAt:'',}
    }
    async componentDidMount() {
        
        const { id } = this.props.match.params;
        if (id){
        await axios
            .get(process.env.REACT_APP_API_URL+'/getGame/'+id)
            .then((res)=>{
                this.setState({
                    id: res.data.game.id,
                    title: res.data.game.title,
                    description: res.data.game.description,
                    imgPath: res.data.game.imgPath,
                    releaseDate: res.data.game.releaseDate,
                    createdAt: res.data.game.createdAt,
                    updatedAt: res.data.game.updatedAt
                })
            }).catch((err)=>{
                console.error(err.response.data);
                this.setState({
                    error: true,
                });
            });
        }
    }  
    handleCreatedAtChange = (event) => {
        this.setState({
            createdAt:format(new Date(event), "yyyy-MM-dd")
        });
    }
    
    
    render() { 
        const { id, title, description, imgPath, releaseDate, createdAt, updatedAt } = this.state;
        const { classes } = this.props;
        
    
    function save() {
        console.log('aa');
    }
        return ( 
            <div>
                <Container maxWidth="sm">
                <Typography component="h1" variant="h5">
                        {title}
                </Typography>
                <form className={classes.container} noValidate autoComplete="off">
                    <TextField disabled
                        id="id"
                        label="Id"
                        value={id}
                        onChange = {(e) => this.setState({id:e.target.value})}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="title"
                        label="Title"
                        value={title}
                        onChange = {(e) => this.setState({title:e.target.value})}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="description"
                        label="Description"
                        multiline
                        rows="3"
                        value={description}
                        onChange = {(e) => this.setState({description:e.target.value})}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="imgPath"
                        label="Image Path"
                        value={imgPath}
                        onChange = {(e) => this.setState({imgPath:e.target.value})}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="releaseDate"
                        label="Release Date"
                        value={releaseDate}
                        onChange = {(e) => this.setState({releaseDate:e.target.value})}
                        type="date"
                        margin="normal"
                        fullWidth
                    />
                    
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="mui-pickers-date"
                            label="Date picker"
                            value={createdAt}
                            onChange = {(e) => this.setState({createdAt:format(new Date(e), "yyyy-MM-dd")})}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                        />
                    </MuiPickersUtilsProvider>
                    <TextField disabled noValidate autoComplete="off"
                        id="updatedAt"
                        label="Updated At"
                        value={updatedAt}
                        onChange = {(e) => this.setState({updatedAt:e.target.value})}
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