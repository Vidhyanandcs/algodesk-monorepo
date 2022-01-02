import './RegistrationConfirmation.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {register, setAction} from "../../redux/actions/fund";
import {CancelOutlined} from "@material-ui/icons";
import React from "react";
import {getCommonStyles} from "../../utils/styles";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function RegistrationConfirmation(): JSX.Element {

    const dispatch = useDispatch();

    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const {action} = fundDetails;
    const show = action === 'registration_confirmation';
    const classes = useStyles();

    return (<div>
        {show ? <Dialog
            fullWidth={true}
            maxWidth={"xs"}
            open={show}
            classes={{
                paper: classes.customDialog
            }}
        >
            <DialogTitle >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>

                    </div>
                    <IconButton color="primary" onClick={() => {
                        dispatch(setAction(''));
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="registration-confirmation-wrapper">
                    <div className="registration-confirmation-container">


                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className='message'>
                                    Are you sure, you want to register ?
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div style={{marginTop: 10, marginBottom: 5}}>
                                    <Button color={"primary"}
                                            className="custom-button"
                                            variant={"contained"} size={"large"}
                                            onClick={() => {
                                                dispatch(register(Number(fund.id)));
                                            }}
                                    >Yes</Button>
                                </div>
                            </Grid>
                        </Grid>


                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default RegistrationConfirmation;
