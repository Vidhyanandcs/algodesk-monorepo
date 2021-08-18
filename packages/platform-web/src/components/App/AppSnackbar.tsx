import {Snackbar} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {hideSnack} from '../../redux/actions/snackbar';
import Alert from "@material-ui/lab/Alert";

function AppSnackbar(): JSX.Element {
    const snackbar = useSelector((state: RootState) => state.snackbar)
    const dispatch = useDispatch();

    return (<Snackbar
        open={snackbar.show}
        anchorOrigin={{ vertical: 'top',
            horizontal: 'center' }}
        autoHideDuration={5000} onClose={() => {dispatch(hideSnack())}}>
        <Alert
            icon={false}
            severity={snackbar.severity}
            onClose={() => {dispatch(hideSnack())}}>
            {snackbar.message}
        </Alert>
    </Snackbar>);
}

export default AppSnackbar;
