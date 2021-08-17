import './Header.scss';
import {Snackbar} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {hideSnack} from '../../redux/actions/snackbar';
import Alert from "@material-ui/lab/Alert";

function Header(): JSX.Element {
    const snackbar = useSelector((state: RootState) => state.snackbar)
    const dispatch = useDispatch();

  return (
      <div className="header-wrapper">
          <div className="header-container">
            hello
          </div>
      </div>
  );
}

export default Header;
