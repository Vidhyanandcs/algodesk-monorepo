import {Theme} from "@material-ui/core";

export function getCommonStyles(theme: Theme) {
    return {
        blackButton: {
            background: '#000',
            '&:hover': {
                background: '#000 !important',
            },
            '&:focus': {
                background: '#000 !important',
            }
        },
        customCard: {
            boxShadow: 'none',
            border: '1px solid #f2f2f2'
        },
        blackChip: {
            background: 'black',
            color: '#fff',
            borderColor: 'black',
            '&:hover': {
                background: 'black !important',
            },
            '&:focus': {
                background: 'black !important',
            }
        },
        primaryText: {
            color: theme.palette.primary.main
        },
        secondaryText: {
            color: theme.palette.secondary.main
        }
    };
}