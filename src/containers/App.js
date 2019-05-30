import React, { Component } from 'react';
import './App.css';
import Routes from '../Routes';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue, indigo } from '@material-ui/core/colors'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: {
      main: blue[900]
    },
    primary: {
      main: indigo[700]
    }
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    useNextVariants: true,
    fontFamily: [
      '"Lato"',
      'sans-serif'
    ].join(',')
  }
});

class App extends Component {
  render(){
    return (
    <div className = "App">
      <MuiThemeProvider theme={theme}>
        <Routes />
      </MuiThemeProvider>
    </div>
  )
  }
}

export default App;
