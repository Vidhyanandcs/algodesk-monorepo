import './Funds.scss';
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Button, Grid} from "@material-ui/core";
import noFundsImg from '../../assets/images/no-funds.png';
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import CreateFund from "../CreateFund/CreateFund";
import {Fund, globalStateKeys} from "@fundstack/sdk";

function Funds(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    const network = useSelector((state: RootState) => state.network);
    const {funds} = account;
    const history = useHistory();
  return (
      <div className="funds-wrapper">
          <div className="funds-container">

              <header>
                  My funds
              </header>

              <Switch>

                  <Route exact path="/portal/dashboard/funds/home">
                      {funds.length === 0 ? <div className="no-funds">
                          <img alt="no-funds" src={noFundsImg}/>
                          <div>
                              <Button variant={"contained"}
                                      color={"primary"}
                                      size={"large"}
                                      className={"custom-button"}
                                      onClick={() => {
                                          history.push('/portal/dashboard/funds/create');
                                      }}
                              >Deploy</Button>
                          </div>
                      </div> : ''}
                      <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="funds">
                                  <Grid container spacing={2}>
                                      {funds.map((fund) => {
                                          const fundInstance = new Fund(fund, network.name);
                                          return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={fund.id}>
                                              <div className="fund">
                                                  <div className="fund-name">
                                                      {fundInstance.globalState[globalStateKeys.name]}
                                                  </div>
                                                  <div className="fund-id">
                                                      ID: {fund.id}
                                                  </div>
                                                  <div className="fund-status">
                                                      <Button variant={"contained"}
                                                              color={"primary"}
                                                              size={"small"}
                                                              onClick={() => {
                                                                  // history.push('/portal/fund/' + fund.app_id);
                                                              }}
                                                      >View</Button>
                                                  </div>

                                                  <div className="footer">
                                                      <div className="detail">
                                                          <div>
                                                              Published
                                                          </div>
                                                          <div>
                                                              {fundInstance.isPublished() ? 'Yes' : 'No'}
                                                          </div>
                                                      </div>
                                                      <div className="detail">
                                                          <div>
                                                              Asset ID
                                                          </div>
                                                          <div>
                                                              {fundInstance.getAssetId()}
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </Grid>
                                      })}

                                  </Grid>

                              </div>
                          </Grid>
                      </Grid>
                  </Route>
                  <Route exact path="/portal/dashboard/funds/create">
                      <CreateFund></CreateFund>
                  </Route>
                  <Route path="/portal/dashboard/funds" render={() => <Redirect to="/portal/dashboard/funds/home" />} />
              </Switch>

          </div>
      </div>
  );
}

export default Funds;
