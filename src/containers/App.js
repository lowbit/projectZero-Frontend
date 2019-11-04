import React, { Component } from "react";
import "./App.css";
import Routes from "./Routes";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue, blueGrey } from "@material-ui/core/colors";
import { CssBaseline } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { withStyles } from "@material-ui/styles";
import HeaderBar from "../components/HeaderBar";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue,
    secondary: blueGrey
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    useNextVariants: true,
    fontFamily: ['"Lato"', "sans-serif"].join(",")
  },
  props: {
    MuiTypography: {
      color: "textPrimary"
    }
  }
});
const styles = theme => ({
  SnackbarFont: {
    color: "white"
  }
});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerTitle: { pageTitle: "aa" }
    };
  }
  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            classes={{
              variantSuccess: classes.SnackbarFont,
              variantError: classes.SnackbarFont,
              variantWarning: classes.SnackbarFont,
              variantInfo: classes.SnackbarFont
            }}
          >
            <HeaderBar title={this.state.headerTitle} />
            <div className="mainContainer">
              <Routes setHeader={e => this.setState({ headerTitle: e })} />
            </div>
          </SnackbarProvider>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default withStyles(styles)(App);
