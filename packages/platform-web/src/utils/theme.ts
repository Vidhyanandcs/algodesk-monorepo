import {Button, Card, Chip, createTheme, Tooltip, withStyles} from "@material-ui/core";

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
        background: "linear-gradient(56.21deg, #60DD8B -43.1%, #0BB68C 132.97%)"
    }
}))(Button);

export const BlackChip = withStyles((theme) => ({
    root: {
        color: '#000',
        border: '1px solid #000',
        background: '#fff'
    },
    icon: {
        color: '#000'
    }
}))(Chip);

