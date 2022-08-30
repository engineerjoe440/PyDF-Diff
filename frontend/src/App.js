/*******************************************************************************
 * App.js
 * 
 * Main javascript application definition - a thin wrapper around the other
 * components that are used for the 4-H Photo Uploader.
 ******************************************************************************/
 import React, { Component } from "react";
 import { Grid } from "@mui/material";
 import { purple, green } from '@mui/material/colors';
 import { ThemeProvider, createTheme } from '@mui/material/styles';
 import CssBaseline from '@mui/material/CssBaseline';
 import "./App.css";
 
 const getDesignTokens = (mode) => ({
   palette: {
     mode,
     ...(mode === 'light'
       ? {
           // palette values for light mode
          primary: {
            main: green[800],
          },
         secondary: {
            main: purple[500],
   
          },
       }
       : {
           // palette values for dark mode
          primary: {
            main: green[800],
          },
          background: {
             default: '#051700',
             paper: green[800],
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
           <Grid
             container
             spacing={0}
             direction="column"
             alignItems="center"
             style={{ minHeight: '100vh' }}
           >
             <Grid item m={2} pt={3} xs={3}>
              <p>Hello, World!</p>
             </Grid>
           </Grid>
         </div>
       </ThemeProvider>
     );
   }
 }
 
 export default App;