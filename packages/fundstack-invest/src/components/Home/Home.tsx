import './Home.scss';
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadFunds} from "../../redux/actions/funds";
import {RootState} from "../../redux/store";
import {Grid, makeStyles} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {microalgosToAlgos} from "algosdk";
import {getCommonStyles} from "../../utils/styles";


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme)
    };
});


function Home(): JSX.Element {

    const funds = useSelector((state: RootState) => state.funds);
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        dispatch(loadFunds());
    }, [dispatch]);

  return (
      <div className="home-wrapper">
          <div className="home-container">
              <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                      <div className={"headline " + classes.primaryText}>Welcome to the future of fundraising.</div>
                  </Grid>
              </Grid>

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

                                  <div className="footer">
                                      <div className="detail">
                                          <div>
                                              Total allocation
                                          </div>
                                          <div>
                                              {fund.total_allocation} ${fund.asset_unit}
                                          </div>
                                      </div>
                                      <div className="detail">
                                          <div>
                                              Price
                                          </div>
                                          <div>
                                              {microalgosToAlgos(fund.price)} $algo
                                          </div>
                                      </div>
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
