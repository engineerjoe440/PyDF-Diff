/*******************************************************************************
 * App.js
 * 
 * Main javascript application definition - a thin wrapper around the other
 * components that are used for the PDF diffing functionality.
 * 
 * License: MIT
 * Original Author: Joe Stanley
 ******************************************************************************/
import React, { Component } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import DifferenceIcon from '@mui/icons-material/Difference';
import Fade from '@mui/material/Fade';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip'; 
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'; 
import MuiAlert from '@mui/material/Alert';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Snackbar from '@mui/material/Snackbar';
import { DropzoneArea } from 'react-mui-dropzone'
import CssBaseline from '@mui/material/CssBaseline';
import "./App.css";
import uploadPDFFiles from "./api";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
            default: '#973c3c',
            paper: '#731212',
          },
      }),
  },
});

// Function to help secure usage of `_blank`
const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

 
 class App extends Component {
   constructor(props) {
     super(props);
 
     // Set Default State Options
     this.state = {
       error: null,
       pageLoadComplete: false,
       mode: 'light',
       theme: createTheme(getDesignTokens('light')), // Create Default Theme
       anchorEl: null,
       dropzoneKey: 0,
       files: [],
       snackbarOpen: false,
       snackbarMsg: "", 
       severity: "success",
       uploading: false,
     };
 
     // Bind Class Method
     this.toggleThemeSetting = this.toggleThemeSetting.bind(this);
     this.setDefaultTheme = this.setDefaultTheme.bind(this);
     this.handleMenuClick = this.handleMenuClick.bind(this);
     this.handleMenuClose = this.handleMenuClose.bind(this);
     this.openGitHubPage = this.openGitHubPage.bind(this);
     this.handleFileChange = this.handleFileChange.bind(this);
     this.startDifferenceEval = this.startDifferenceEval.bind(this);
     this.handlePopup = this.handlePopup.bind(this);
     this.handleSuccessfulDiff = this.handleSuccessfulDiff.bind(this);
   }

    handleMenuClick = (event) => {
      this.setState({anchorEl: event.currentTarget});
    };
    openGitHubPage = () => {
      openInNewTab("https://github.com/engineerjoe440/PyDF-Diff");
      this.handleMenuClose();
    };
    handleMenuClose = () => {
      this.setState({anchorEl: null});
    };

    handleFileChange(files){
      this.setState({
        files: files
      });
    }

    handlePopup = (data) => {
      // Show Popup with Defined Message and Severity
      console.log(data.message);
  
      // Update Snackbar
      this.setState({
        uploading: false,
        snackbarMsg: data.message,
        snackbarOpen: true,
        severity: data.severity,
      })
    };

   handleSuccessfulDiff = (uploadedFile) => {
    // Show Popup with Listed Successful File - Remove File from List
    console.log(uploadedFile);

    // Update Snackbar
    this.setState({
      snackbarMsg: `Successfully uploaded image '${uploadedFile}'.`,
      snackbarOpen: true,
      severity: "success",
    })

    // Remove the Uploaded File
    var files = this.state.files.filter(
      function(f){return f.name !== uploadedFile;}
    );
    this.setState({files: files});

    // When the List of Files is Emptied, We're Done
    if (files.length === 0) {
      // Turn Off Spinner
      this.setState({
        uploading: false, 
        dropzoneKey: this.state.dropzoneKey + 1,
      });
    }
  };

  
  
   // Start PDF-DIFF
   startDifferenceEval(event) {
    event.preventDefault();
    // Validate Photo List
    console.log(this.state.files.length)
    if (this.state.files.length !== 2) {
      this.setState({
        snackbarMsg: "Select two (2) PDF files, first!",
        snackbarOpen: true,
        severity: "warning"
      })
      return // Don't attempt the upload
    }
    uploadPDFFiles({
      files: this.state.files,
      onPopup: this.handlePopup,
      onSuccess: this.handleSuccessfulDiff,
    })
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
                  onClick={this.handleMenuClick}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    'aria-labelledby': 'fade-button',
                  }}
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleMenuClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={this.openGitHubPage}>Github</MenuItem>
                </Menu>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  PyDF-Diff
                </Typography>
                <Tooltip title={this.state.mode === 'dark' ? "Light Mode" : "Dark Mode"}>
                  <IconButton sx={{ ml: 1 }} onClick={this.toggleThemeSetting} color="inherit">
                    {this.state.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                  </IconButton>
                </Tooltip>
              </Toolbar>
            </AppBar>
            <div>
            <FormLabel component="legend">&nbsp;</FormLabel>
            <FormControl fullWidth my={3}>
              <DropzoneArea
                key={this.state.dropzoneKey}
                clearOnUnmount="true"
                acceptedFiles={['.pdf']}
                dropzoneText={"Drag or click to select PDF files"}
                onChange={this.handleFileChange}
                filesLimit={2}
                maxFileSize={10000000}
                fileObjects={this.state.files}
                showPreviewsInDropzone={true}
                useChipsForPreview={true}
                showAlerts={['error', 'info']}
              />
            </FormControl>
            <FormControl id="PDFUploadSubmit" mt={3}>
              <LoadingButton
                onClick={this.startDifferenceEval}
                endIcon={<DifferenceIcon />}
                loading={this.state.uploading}
                loadingPosition="end"
                variant="contained"
              >
                Evaluate PDF Difference
              </LoadingButton>
            </FormControl>
            </div>
            <Snackbar
              open={this.state.snackbarOpen}
              autoHideDuration={6000}
              onClose={this.handleClose}
            >
              <Alert
                onClose={this.handleClose}
                severity={this.state.severity}
                sx={{ width: '100%' }}
              >
                {this.state.snackbarMsg}
              </Alert>
            </Snackbar>
          </Box>
         </div>
       </ThemeProvider>
     );
   }
 }
 
 export default App;