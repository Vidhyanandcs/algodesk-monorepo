import {Button, createTheme, withStyles} from "@material-ui/core";

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
    }
});

export const CustomButton = withStyles((theme) => ({
    root: {
        borderRadius: 15
    },
    containedPrimary: {
        boxShadow: "none",
        background: "linear-gradient(56.21deg, #60DD8B -43.1%, #0BB68C 132.97%)",
        padding: "12px 24px",
    },
    outlinedPrimary: {
        padding: "12px 24px",
    }
}))(Button);