import {createTheme, Tooltip, withStyles} from "@material-ui/core";

export const theme = createTheme({
    typography: {
        button: {
            textTransform: 'none',
            fontFamily: 'SourceSansPro'
        }
    },
    palette: {
        primary: {
            main: '#3f51b5'
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
