import './Funds.scss';
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Button, Grid, makeStyles} from "@material-ui/core";
import {getCommonStyles} from "../../utils/styles";
import noFundsImg from '../../assets/images/no-funds.png';

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function Funds(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    const {funds} = account;
    const classes = useStyles();

  return (
      <div className="funds-wrapper">
          <div className="funds-container">
              <header>
                  My funds
              </header>
              {funds.length === 0 ? <div className="no-funds">
                  <img alt="no-funds" src={noFundsImg}/>
                  <div>
                      <Button variant={"contained"}
                              color={"primary"}
                              size={"large"}
                              className={"custom-button"}
                              onClick={() => {

                              }}
                      >Deploy</Button>
                  </div>
              </div> : ''}
              <Grid container spacing={2}>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1} className={classes.primaryText}>
                  </Grid>
                  <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                      <div className="funds">
                          <Grid container spacing={2}>
                              {funds.map((fund) => {
                                  return <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={fund.id}>
                                      <div className="fund">
                                          <div className="fund-name">
                                              {fund.id}
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
                                                      Total allocation
                                                  </div>
                                                  <div>

                                                  </div>
                                              </div>
                                              <div className="detail">
                                                  <div>
                                                      Price
                                                  </div>
                                                  <div>

                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </Grid>
                              })}

                          </Grid>

                      </div>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                  </Grid>
              </Grid>
          </div>
      </div>
  );
}

export default Funds;
