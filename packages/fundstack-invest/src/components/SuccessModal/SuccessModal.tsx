import './successModal.scss';
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {CheckCircleOutline, CancelOutlined} from "@material-ui/icons";
import React from "react";
import {hideSuccessModal} from "../../redux/actions/successModal";
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

function SuccessModal(): JSX.Element {

    const dispatch = useDispatch();
    const successModal = useSelector((state: RootState) => state.successModal);
    const {show, message} = successModal;
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
                        dispatch(hideSuccessModal());
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="success-modal-wrapper">
                    <div className="success-modal-container">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div>
                                    <div>
                                        <CheckCircleOutline fontSize={"large"} className="success-icon" color={"primary"}></CheckCircleOutline>
                                    </div>
                                    <div className="message">
                                        {message}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div style={{marginTop: 20, marginBottom: 20}}>
                                    <Button color={"primary"} variant={"contained"} size={"large"}
                                            onClick={() => {
                                                dispatch(hideSuccessModal());
                                            }}
                                    >Close</Button>
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

export default SuccessModal;
