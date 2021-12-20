import './Home.scss';
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadFunds} from "../../redux/actions/funds";
import {RootState} from "../../redux/store";
import {Grid} from "@material-ui/core";
import {useHistory} from "react-router-dom";

function Home(): JSX.Element {

    const funds = useSelector((state: RootState) => state.funds);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(loadFunds());
    }, [dispatch]);

  return (
      <div className="home-wrapper">
          <div className="home-container">
              <div className="funds-header">Active projects</div>
              <div className="funds">
                  <Grid container spacing={2}>
                      {funds.list.map((fund) => {
                          return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={fund._id}>
                              <div className="fund" onClick={() => {
                                  history.push('/portal/fund/' + fund.app_id);
                                }
                              }>
                                  <div className="fund-name">
                                      {fund.name}
                                  </div>
                                  <div className="fund-id">
                                      ID: {fund.app_id}
                                  </div>
                              </div>
                          </Grid>
                      })}

                  </Grid>

              </div>
          </div>
      </div>
  );
}

export default Home;
