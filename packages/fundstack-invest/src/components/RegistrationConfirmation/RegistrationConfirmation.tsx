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
import {register, setAction} from "../../redux/actions/pool";
import {CancelOutlined} from "@material-ui/icons";
import React from "react";
import {getCommonStyles} from "../../utils/styles";
import {microalgosToAlgos} from "algosdk";
import {globalStateKeys} from "@fundstack/sdk";
import algoLogo from '../../assets/images/algo-logo.png';

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

    const poolDetails = useSelector((state: RootState) => state.pool);
    const {pool} = poolDetails;
    const {action} = poolDetails;
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
                                <div className='fee'>
                                    Registration fee
                                    <div className="value">
                                        {microalgosToAlgos(pool.globalState[globalStateKeys.platform_registration_fee])}
                                        <img src={algoLogo} alt="Algo"/>
                                    </div>

                                </div>
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
                                                dispatch(register(Number(pool.id)));
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
