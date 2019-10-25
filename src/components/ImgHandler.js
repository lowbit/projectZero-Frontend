import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';

class ImgHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onChange(e) {
    const accessString = localStorage.getItem('JWT');
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    const data = new FormData();
    data.append('file', e.target.files[0]);
    data.append('id', this.props.id);
    reader.onload = e => {
      axios
        .post(process.env.REACT_APP_API_URL + '/uploadImg', data, {
          headers: { Authorization: `JWT ${accessString}` }
        })
        .then(response => {
          console.log('sucessful');
        })
        .catch(error => {
          console.log('error');
        });
    };
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <TextField
          id="imgPath"
          label={this.props.label}
          value={this.props.value}
          name="imgPath"
          onChange={this.handleInputChange}
          margin="normal"
          fullWidth
        />
        <div>
          <img
            alt=""
            src={process.env.REACT_APP_API_URL + this.props.value}
            width="340px"
            height="auto"
          ></img>
        </div>
        <input
          accept="image/*"
          className={classes.input}
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={e => this.onChange(e)}
        />
        <label htmlFor="raised-button-file">
          <Button variant="raised" component="span" className={classes.button}>
            Upload
          </Button>
        </label>
      </div>
    );
  }
}

export default ImgHandler;
