import React, { Component } from 'react';
import { TextField } from '@material-ui/core';

class ImgHandler extends Component {
    constructor(props) {
        super(props);
        this.state = { 
         }
    }
    render() { 
        return ( 
            <div>
                <TextField
                    id="imgPath"
                    label={this.props.label}
                    value={this.props.value}
                    name="imgPath"
                    onChange = {this.handleInputChange}
                    margin="normal"
                    fullWidth
                />
                <div>
                    show img here
                </div>
                <button>Upload new Image</button>
            </div>
        );
    }
}
 
export default ImgHandler;