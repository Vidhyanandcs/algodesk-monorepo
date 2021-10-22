import {createTheme} from "@material-ui/core";

export const theme = createTheme({
    typography: {
        button: {
            textTransform: 'none',
            fontFamily: 'Poppins'
        }
    },
    palette: {
        primary: {
            main: '#03B68C',
            contrastText: '#fff'
        },
        secondary: {
            main: '#fa5c7c'
        }
    },
    overrides: {
        MuiButton: {
            root: {
                borderRadius: 10,
                padding: "12px 24px !important",
                boxShadow: "none !important",
            },
            contained: {
                '&:hover': {
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25) !important',
                }
            },
            outlined: {
                '&:hover': {
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25) !important',
                }
            },
            containedPrimary: {
                background: "linear-gradient(56.21deg, #0BB68C -43.1%, #60DD8B 132.97%)",
                '&:hover': {
                    background: 'linear-gradient(247.73deg, #60DD8B -15.43%, #1B733B 125.76%)'
                }
            },
            containedSecondary: {
                background: "linear-gradient(247.73deg, #F7931E -15.43%, #FF0000 125.76%)",
                '&:hover': {
                    background: 'linear-gradient(247.73deg, #C1272D -15.43%, #FF0000 125.76%)'
                }
            }
        }
    }
});


