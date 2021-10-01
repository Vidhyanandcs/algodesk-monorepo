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
            main: '#613ab7'//5052bd//3f51b5//663399//613ab7
        },
        secondary: {
            main: '#fa5c7c'//#fa5c7c//f44336
        }
    }
});