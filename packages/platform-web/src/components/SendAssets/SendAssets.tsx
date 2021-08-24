import './SendAssets.scss';
import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/assetActions";
import {Close} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import {useState} from "react";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});


interface SendAssetState{

}
const initialState: SendAssetState = {

};

function SendAssets(): JSX.Element {

    const dispatch = useDispatch();

    const assetActions = useSelector((state: RootState) => state.assetActions);
    const show = assetActions.action === 'send';

    const classes = useStyles();
    const [
        {},
        setState
    ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    };

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
                        Send assets
                    </div>
                    <IconButton color="default" onClick={() => {
                        dispatch(setAction(''));
                        clearState();
                    }}>
                        <Close />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="send-assets-wrapper">
                    <div className="send-assets-container">
                       send assets
                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default SendAssets;
