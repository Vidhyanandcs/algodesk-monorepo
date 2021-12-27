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
                boxShadow: "none !important",
                padding: "12px 24px !important",
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
                    background: 'linear-gradient(247.73deg, #60DD8B -15.43%, #1B733B 125.76%)'
                }
            },
            containedSecondary: {
                background: "linear-gradient(247.73deg, #F7931E -15.43%, #FF0000 125.76%)",
                '&:hover': {
                    background: 'linear-gradient(247.73deg, #C1272D -15.43%, #FF0000 125.76%)'
                }
            }
        },
        MuiChip: {
            root: {
                '&.custom-chip': {
                    borderRadius: 10,
                    padding: "15px 10px",
                    background: "linear-gradient(0deg, #D0D2D3 -59.14%, #A6A8AB 122.22%)",
                    color: '#fff',
                    fontWeight: 'bold'
                },
                '&.no-border-chip': {
                    border: 'none'
                }
            },
            colorPrimary: {
                '&.custom-chip': {
                    background: "linear-gradient(0deg, #60DD8B -59.14%, #0BB68C 122.22%);",
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
                boxShadow: "0 0 25px rgb(0 0 0 / 8%)",
                borderRadius: '10px'
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


