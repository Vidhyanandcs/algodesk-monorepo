import './Loader.scss';
import {CircularProgress} from "@material-ui/core";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

function Loader(): JSX.Element {
    const loader = useSelector((state: RootState) => state.loader);

  return (
      <div className={"loader-wrapper " + (loader.count ? 'open' : 'close')}>
          <div className='loading-icon'>
              <CircularProgress color="primary" />
          </div>
          <div className='loading-message'>
              {loader.message}
          </div>
      </div>
  );
}

export default Loader;
