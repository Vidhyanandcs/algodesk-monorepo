import './Home.scss';
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadFunds} from "../../redux/actions/funds";
import {RootState} from "../../redux/store";

function Home(): JSX.Element {

    const funds = useSelector((state: RootState) => state.funds);
    console.log(funds);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadFunds(""));
    }, [dispatch]);

  return (
      <div className="home-wrapper">
          <div className="home-container">

This is home page

          </div>
      </div>
  );
}

export default Home;
