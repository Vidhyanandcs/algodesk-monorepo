import './Pools.scss';
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Button, Grid} from "@material-ui/core";
import noPoolsImg from '../../assets/images/no-pools.png';
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import CreatePool from "../CreatePool/CreatePool";
import {Pool, globalStateKeys} from "@fundstack/sdk";
import PoolPage from '../Pool/Pool';
import fSdk from "../../utils/fSdk";

function Pools(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    const network = useSelector((state: RootState) => state.network);
    const {pools} = account;
    const history = useHistory();
  return (
      <div className="pools-wrapper">
          <div className="pools-container">

              <header>
                  My Pools
              </header>

              <Switch>

                  <Route exact path="/portal/dashboard/pools/home">
                      {pools.length === 0 ? <div className="no-pools">
                          <img alt="no-pools" src={noPoolsImg}/>
                          <div>
                              <Button variant={"contained"}
                                      color={"primary"}
                                      size={"large"}
                                      className={"custom-button"}
                                      onClick={() => {
                                          history.push('/portal/dashboard/pools/create');
                                      }}
                              >Create pool</Button>
                          </div>
                      </div> : ''}

                      {pools.length > 0 ? <div>
                          <Button variant={"contained"}
                                  color={"primary"}
                                  size={"large"}
                                  className="custom-button"
                                  onClick={() => {
                                      history.push('/portal/dashboard/pools/create');
                                  }}
                          >Create pool</Button>
                      </div> : ''}


                      <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="pools">
                                  <Grid container spacing={2}>
                                      {pools.map((pool) => {
                                          const poolInstance = new Pool(pool, network.name);
                                          return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={pool.id}>
                                              <div className="pool">
                                                  <img src={fSdk.fs.getIpfsLink(poolInstance.globalState[globalStateKeys.logo])} alt="pool-logo"/>
                                                  <div className="pool-name">
                                                      <div>{poolInstance.globalState[globalStateKeys.name]}</div>
                                                      <div className="pool-id" onClick={() => {
                                                          fSdk.explorer.openApplication(pool.id);
                                                      }}>
                                                          ID: {pool.id}
                                                      </div>
                                                  </div>

                                                  <div className="pool-status">
                                                      <Button variant={"outlined"}
                                                              color={"primary"}
                                                              size={"small"}
                                                              onClick={() => {
                                                                  history.push('/portal/dashboard/pools/' + pool.id);
                                                              }}
                                                      >Open</Button>
                                                  </div>

                                                  <div className="footer">
                                                      <div className="detail">
                                                          <div>
                                                              Published
                                                          </div>
                                                          <div>
                                                              {poolInstance.isPublished() ? 'Yes' : 'No'}
                                                          </div>
                                                      </div>
                                                      <div className="detail">
                                                          <div>
                                                              Asset
                                                          </div>
                                                          <div className="clickable" onClick={() => {
                                                              fSdk.explorer.openAsset(poolInstance.getAssetId());
                                                          }}>
                                                              {poolInstance.getAssetId()}
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
                  <Route exact path="/portal/dashboard/pools/create">
                      <CreatePool></CreatePool>
                  </Route>
                  <Route path="/portal/dashboard/pools/:id">
                      <PoolPage></PoolPage>
                  </Route>
                  <Route path="/portal/dashboard/pools" render={() => <Redirect to="/portal/dashboard/pools/home" />} />
              </Switch>

          </div>
      </div>
  );
}

export default Pools;
