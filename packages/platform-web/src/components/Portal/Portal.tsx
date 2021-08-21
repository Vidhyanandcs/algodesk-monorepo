import './Portal.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Redirect} from "react-router-dom";
import Header from "../Header/Header";

function Portal(): JSX.Element {

    const account = useSelector((state: RootState) => state.account);
    if (!account.loggedIn) {
        return (<Redirect to='/login'></Redirect>);
    }

  return (
      <div className="portal-wrapper">
          <div className="portal-container">
            <Header></Header>
          </div>
      </div>
  );
}

export default Portal;
