import React from "react";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AccountBoxIco from "@material-ui/icons/AccountBox";

class UserMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  handleLogin = () => {
    this.setState({ anchorEl: null });
    this.props.history.push("/login");
  };
  handleLogout = () => {
    this.setState({ anchorEl: null });
    localStorage.removeItem("JWT");
    localStorage.removeItem("username");
    this.props.history.push("/");
  };
  handleAdmin = () => {
    this.setState({ anchorEl: null });
    this.props.history.push("/admin");
  };
  handleMyAccount = () => {
    this.setState({ anchorEl: null });
    this.props.history.push(`/userProfile/${localStorage.getItem("username")}`);
  };
  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <Button
          aria-owns={anchorEl ? "user-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <AccountBoxIco color="action" />
        </Button>
        {localStorage.getItem("JWT") != null ? (
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleAdmin}>Admin</MenuItem>
            <MenuItem onClick={this.handleMyAccount}>My account</MenuItem>
            <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
          </Menu>
        ) : (
          <Menu
            id="user-menu-logged-out"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleLogin}>Login</MenuItem>
          </Menu>
        )}
      </div>
    );
  }
}

export default withRouter(UserMenu);
