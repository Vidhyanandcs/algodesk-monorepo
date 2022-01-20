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
        MuiTextField: {
            root: {
                [`& fieldset`]: {
                    borderRadius: 10,
                },
            }
        },
        MuiButton: {
            root: {
                borderRadius: 10,
                boxShadow: "none !important",
                padding: "12px 24px !important"
            },
            // contained: {
            //     '&:hover': {
            //         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25) !important',
            //     }
            // },
            // outlined: {
            //     '&:hover': {
            //         boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25) !important',
            //     }
            // },
            containedPrimary: {
                background: "linear-gradient(56.21deg, #0BB68C -43.1%, #60DD8B 132.97%)",
                '&:hover': {
                    background: 'linear-gradient(0deg, #74C386 0%, #04B58B 100%);',
                    // boxShadow: '0px 0px 7px #03B68C  !important'
                }
            },
            containedSecondary: {
                background: "linear-gradient(247.73deg, #F7931E -15.43%, #FF0000 125.76%)",
                '&:hover': {
                    // background: 'linear-gradient(247.73deg, #C1272D -15.43%, #FF0000 125.76%)'
                    boxShadow: '0px 0px 7px #fa5c7c  !important'
                }
            }
        },
        MuiButtonGroup: {
            root: {

            },
            groupedOutlinedHorizontal: {
                padding: "6px 12px !important",
            },

        },
        MuiTooltip: {
            tooltip: {
                backgroundColor: '#333',
                color: '#fff',
                fontSize: 12,
                border: '1px solid #333',
            },
            arrow: {
                color: '#000',
            }
        },
        MuiCard: {
            root: {
                boxShadow: "none",
                borderRadius: '10px',
                background: '#F6FBF8'
            }
        },
        MuiDialog: {
            paper: {
                borderRadius: 15
            }
        },
        MuiInputBase: {
            root: {
                "&$disabled": {
                    background: "#F5F5F5 !important",
                    color: '#A9A9A9 !important',
                    '&:hover': {
                        cursor: 'not-allowed'
                    }
                }
            }
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: 4
            }
        }
    }
});


