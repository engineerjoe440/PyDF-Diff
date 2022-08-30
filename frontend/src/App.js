/*******************************************************************************
 * App.js
 * 
 * Main javascript application definition - a thin wrapper around the other
 * components that are used for the 4-H Photo Uploader.
 ******************************************************************************/
 import React, { Component } from "react";
 import { ThemeProvider, createTheme } from '@mui/material/styles';
 import AppBar from '@mui/material/AppBar';
 import Box from '@mui/material/Box';
 import Toolbar from '@mui/material/Toolbar';
 import Typography from '@mui/material/Typography';
 import IconButton from '@mui/material/IconButton';
 import MenuIcon from '@mui/icons-material/Menu';
 import CssBaseline from '@mui/material/CssBaseline';
 import "./App.css";
 
 const getDesignTokens = (mode) => ({
   palette: {
     mode,
     ...(mode === 'light'
       ? {
           // palette values for light mode
          primary: {
            main: '#B71C1C',
          },
       }
       : {
           // palette values for dark mode
          primary: {
            main: '#B71C1C',
          },
          background: {
             default: '#D50000',
             paper: '#6D4C41',
           },
       }),
   },
 });
 
 class App extends Component {
   constructor(props) {
     super(props);
 
     // Set Default State Options
     this.state = {
       error: null,
       pageLoadComplete: false,
       mode: 'light',
       theme: createTheme(getDesignTokens('light')), // Create Default Theme
     };
 
     // Bind Class Method
     this.toggleThemeSetting = this.toggleThemeSetting.bind(this);
     this.setDefaultTheme = this.setDefaultTheme.bind(this);
   }
 
   // Run any code that needs to be executed on page load.
   componentDidMount() {
     this.setState({pageLoadComplete: true});
   }
 
   // Theme Changer Function
   toggleThemeSetting() {
     var newTheme = (this.state.mode === 'light' ? 'dark' : 'light');
     this.setState({mode: newTheme});
     this.setState({theme: createTheme(getDesignTokens(newTheme))});
   }
 
   // Theme Default Setter
   setDefaultTheme(themePreference) {
     // Set the default color profile - only if we haven't done so before!
     if (!this.state.pageLoadComplete) {
       var defaultTheme = (themePreference ? 'dark' : 'light');
       this.setState({mode: defaultTheme});
       this.setState({theme: createTheme(getDesignTokens(defaultTheme))});
     }
   }
 
   render() {
     return (
       <ThemeProvider theme={this.state.theme}>
         <CssBaseline />
         <div className="App">
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  PyDF-Diff
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
         </div>
       </ThemeProvider>
     );
   }
 }
 
 export default App;