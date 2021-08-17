import {createTheme} from "@material-ui/core";

export const theme = createTheme({
    typography: {
        button: {
            textTransform: 'none',
            fontFamily: 'SourceSansPro'
        }
    },
    palette: {
        primary: {
            main: '#558B2F'
        },
        secondary: {
            main: '#AD1457'
        }
    }
});
