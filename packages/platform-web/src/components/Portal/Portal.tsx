import './Portal.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";

function Portal(): JSX.Element {
    const snackbar = useSelector((state: RootState) => state.snackbar)
    const dispatch = useDispatch();

  return (
      <div className="portal-wrapper">
          <div className="portal-container">
            hello
          </div>
      </div>
  );
}

export default Portal;
