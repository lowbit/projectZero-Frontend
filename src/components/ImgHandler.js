import React, { Component, Fragment } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { withSnackbar } from "notistack";

const styles = () => ({
  imageUploadBox: {
    width: "100%",
    height: "auto"
  },
  imageModalUpload: {
    width: "100%",
    color: "gray",
    cursor: "pointer",
    display: "flex",
    border: "none",
    fontSize: "15px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
    outline: "3px dashed gray",
    outlineOffset: "-10px",
    margin: "10px 0",
    padding: "9px 0",
    transition: "0.3s"
  },
  imageModalUploadHighlighted: {
    outline: "3px dashed #0a66b7",
    outlineOffset: "-6px",
    fontWeight: "bold"
  },
  imageModalLabel: {
    cursor: "pointer",
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "15px"
  }
});

class ImgHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingOver: false,
      imgPath: ""
    };
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.value !== prevProps.value) {
      this.setState({
        imgPath: this.props.value
      });
    }
  }
  fileUpload(file) {
    const accessString = localStorage.getItem("JWT");
    let title = this.props.title
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join("");
    if (title.length < 2) {
      this.props.enqueueSnackbar(
        "Game title must be at least 2 characters long",
        {
          variant: "warning",
          autoHideDuration: 3000
        }
      );
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    const data = new FormData();
    data.append("file", file);
    data.append("title", title);
    reader.onload = e => {
      axios
        .post(process.env.REACT_APP_API_URL + "/uploadImg", data, {
          headers: { Authorization: `JWT ${accessString}` }
        })
        .then(response => {
          this.setState({
            imgPath: response.data.imgPath
          });
          this.props.enqueueSnackbar(
            response.message ? response.message : "Succesfully uploaded Image.",
            {
              variant: "success",
              autoHideDuration: 3000
            }
          );
          this.props.onUpload(response.data.imgPath);
        })
        .catch(error => {
          this.props.enqueueSnackbar(
            error.response.data.message
              ? error.response.data.message
              : "Failed uploading image",
            {
              variant: "error",
              autoHideDuration: 3000
            }
          );
        });
    };
  }
  onChange(e) {
    this.fileUpload(e.target.files[0]);
  }
  onDrop = e => {
    e.preventDefault();
    this.setState({
      draggingOver: false
    });
    if (
      e &&
      e.dataTransfer &&
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      this.fileUpload(e.dataTransfer.files[0]);
    }
  };
  onDragOver = e => {
    e.preventDefault();
    this.setState({
      draggingOver: true
    });
  };
  onDragEnd = event => {
    event.preventDefault();
    this.setState({
      draggingOver: false
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <TextField
          disabled
          id="id"
          label="Cover Photo"
          value={this.state.imgPath}
          name="id"
          margin="normal"
          fullWidth
        />
        <div
          className={classes.imageUploadBox}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragEnd}
          onDragEnd={this.onDragEnd}
          onDrop={this.onDrop}
        >
          <img
            alt=""
            src={
              this.state.imgPath
                ? process.env.REACT_APP_API_URL + this.state.imgPath
                : ""
            }
            width="100%"
            height="auto"
          ></img>
          <div
            className={[
              classes.imageModalUpload,
              this.state.draggingOver ? classes.imageModalUploadHighlighted : ""
            ].join(" ")}
          >
            <label htmlFor="file" className={classes.imageModalLabel}>
              Drop the file or click to upload
            </label>
          </div>
          <input
            hidden
            type="file"
            id="file"
            accept="image/gif,image/jpeg,image/jpg,image/png"
            onChange={e => this.onChange(e)}
          ></input>
        </div>
      </Fragment>
    );
  }
}

export default withSnackbar(withStyles(styles)(ImgHandler));
