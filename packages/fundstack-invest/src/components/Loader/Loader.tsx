import './Loader.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import loaderGif from '../../assets/images/loading.gif';

function Loader(): JSX.Element {
    const loader = useSelector((state: RootState) => state.loader);

  return (
      <div>
          {loader.count ? <div>
              <div className="loading-box">
                  <img src={loaderGif} alt="loading"/>
                  <div className="message">
                      {loader.message}
                  </div>
              </div>
              <div className="loader-wrapper">
              </div>
          </div> : ''}
      </div>
  );
}

export default Loader;
