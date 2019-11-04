import React from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";

const headerStyle = {
  background: "#222",
  color: "white"
};
const headerText = {
  flexGrow: "1"
};

const HeaderBar = ({ title }) => (
  <div className="header">
    <AppBar position="static" color="default" style={headerStyle}>
      <Toolbar>
        <Link to={`/`}>
          <Button>Home</Button>
        </Link>
        <Typography variant="h6" color="inherit" style={headerText}>
          {title.pageTitle || "Page Title Placeholder"}
        </Typography>
        <UserMenu />
      </Toolbar>
    </AppBar>
  </div>
);

HeaderBar.propTypes = {
  title: PropTypes.shape({
    pageTitle: PropTypes.string.isRequired
  })
};

HeaderBar.defaultProps = {
  title: {
    pageTitle: "Page Title Placeholder"
  }
};

export default HeaderBar;
