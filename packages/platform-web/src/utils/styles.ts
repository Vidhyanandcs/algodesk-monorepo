import {Theme} from "@material-ui/core";

export function getCommonStyles(theme: Theme) {
    return {
        primaryText: {
            color: theme.palette.primary.main
        },
        secondaryText: {
            color: theme.palette.secondary.main
        },
        primaryBackground: {
            background: theme.palette.primary.main
        },
        primaryColorOnHover: {
            '&:hover': {
                color: theme.palette.primary.main + ' !important'
            }
        },
        primaryBorderOnHover: {
            '&:hover': {
                borderColor: theme.palette.primary.main + ' !important'
            }
        },
        secondaryColorOnHover: {
            '&:hover': {
                color: theme.palette.secondary.main + ' !important'
            }
        },
        secondaryBorderOnHover: {
            '&:hover': {
                borderColor: theme.palette.secondary.main + ' !important'
            }
        },
    };
}