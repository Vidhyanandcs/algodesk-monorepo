import {Button, ButtonGroup, Card, createTheme, Tooltip, withStyles} from "@material-ui/core";

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

export const CustomTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: '#333',
        color: '#fff',
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #333',
    },
    arrow: {
        color: '#000',
    },
}))(Tooltip);

export const CustomCard = withStyles((theme) => ({
    root: {
        boxShadow: "0 0 25px rgb(0 0 0 / 8%)",
        borderRadius: '10px'
    }
}))(Card);

export const CustomButton = withStyles((theme) => ({
    containedPrimary: {
        boxShadow: "none",
        background: "linear-gradient(56.21deg, #0BB68C -43.1%, #60DD8B 132.97%)",
        padding: "12px 24px",
        borderRadius: 10,
        '&:hover': {
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
            background: 'linear-gradient(247.73deg, #60DD8B -15.43%, #1B733B 125.76%)'
        }
    },
    containedSecondary: {
        boxShadow: "none",
        background: "linear-gradient(247.73deg, #FF0000 -15.43%, #F7931E 125.76%)",
        padding: "12px 24px",
        '&:hover': {
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
            background: 'linear-gradient(247.73deg, #C1272D -15.43%, #FF0000 125.76%)'
        }
    }
}))(Button);

export const CustomButtonGroup = withStyles((theme) => ({
    outlined: {
        boxShadow: 'none'
    },
    groupedOutlinedPrimary: {
        boxShadow: 'none'
    }
}))(ButtonGroup);

