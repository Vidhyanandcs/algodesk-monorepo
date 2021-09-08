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
            main: '#3f51b5'//5052bd//3f51b5
        },
        secondary: {
            main: '#fa5c7c'//#fa5c7c//f44336
        }
    }
});