import {Card, Chip, createTheme, Tooltip, withStyles} from "@material-ui/core";

export const theme = createTheme({
    typography: {
        button: {
            textTransform: 'none',
            fontFamily: 'SourceSansPro'
        }
    },
    palette: {
        primary: {
            main: '#5052bd'//5052bd//3f51b5
        },
        secondary: {
            main: '#f44336'
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
    }
}))(Card);

export const BlackChip = withStyles((theme) => ({
    root: {
        background: '#000',
        color: '#fff'
    },
    icon: {
        color: '#fff'
    }
}))(Chip);

