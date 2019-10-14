import React, { Component } from 'react';
import axios from 'axios';
import { TextField, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Container  from '@material-ui/core/Container';
import { format } from 'date-fns';
import clsx from 'clsx';
import SaveIcon from '@material-ui/icons/Save';
import BasicDatePicker from '../../components/BasicDatePicker';
import ImgHandler from '../../components/ImgHandler';

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
            updatedAt:'',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
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
    
    handleInputChange(event,dateName) {
        if(!dateName) {
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
                        name="id"
                        onChange = {this.handleInputChange}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="title"
                        label="Title"
                        value={title}
                        name="title"
                        onChange = {this.handleInputChange}
                        margin="normal"
                        fullWidth
                    />
                    <TextField
                        id="description"
                        label="Description"
                        multiline
                        rows="3"
                        value={description}
                        name ="description"
                        onChange = {this.handleInputChange}
                        margin="normal"
                        fullWidth
                    />
                    <ImgHandler
                        label="Image Path"
                        value={imgPath}
                    />
                    <BasicDatePicker
                        label="Release Date"
                        name="releaseDate"
                        value={releaseDate}
                        onChange= {this.handleInputChange}
                        margin="normal"
                    />
                    <BasicDatePicker
                        label="Created At"
                        name="createdAt"
                        value={createdAt}
                        onChange= {this.handleInputChange}
                        margin="normal"
                    />
                    <BasicDatePicker
                        label="Modified At"
                        name="updatedAt"
                        value={updatedAt}
                        onChange= {this.handleInputChange}
                        margin="normal"
                        disabled
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