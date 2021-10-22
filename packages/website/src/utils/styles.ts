import {Theme} from "@material-ui/core";

export function getCommonStyles(theme: Theme) {
    return {
        primaryText: {
            color: theme.palette.primary.main
        },
        secondaryText: {
            color: theme.palette.secondary.main
        },
        primaryBorder: {
            borderColor: theme.palette.primary.main + " !important",
            '&:before': {
                borderColor: "#fff !important"
            }
        }
    };
}