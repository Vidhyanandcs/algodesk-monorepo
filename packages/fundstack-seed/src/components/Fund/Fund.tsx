import './Fund.scss';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import React, {useEffect} from "react";
import {loadFund} from "../../redux/actions/fund";
import {Alert} from "@material-ui/lab";
import {Button, Grid, makeStyles} from "@material-ui/core";
import {globalStateKeys} from "@fundstack/sdk";
import loadingLogo from '../../assets/images/logo-loading.gif';
import {getCommonStyles} from "../../utils/styles";
import fundstackSdk from "../../utils/fundstackSdk";


const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function Fund(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    const params = useParams();
    const dispatch = useDispatch();
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const classes = useStyles();
    console.log(fund);
    console.log(account);

    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(loadFund(id));
    }, [dispatch, id]);

  return (
      <div className="fund-wrapper">
          <div className="fund-container">


              {fundDetails.loading ? <div className="loading-fund">
                  <img src={loadingLogo} alt="loading ..."></img>
                  <div className="text">loading ...</div>
              </div> : <div>
                  {fund ? <div>
                      {!fund.valid ? <div>
                          <Alert color={"success"} icon={false} style={{borderRadius: 10}}>
                              Invalid fund
                          </Alert>
                      </div> : ''}
                      {fund.valid ? <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="fund-header">
                                  <section>
                                      <div className={classes.primaryText + " fund-name"}>
                                          {fund.globalState[globalStateKeys.name]}
                                      </div>
                                      <div className={"fund-id"} onClick={() => {
                                          fundstackSdk.explorer.openApplication(fund.id);
                                      }
                                      }>
                                          ID: {fund.id}
                                      </div>
                                  </section>
                                  <section>
                                      <Button
                                          color={"primary"}
                                          variant={"contained"}
                                          size={"large"}
                                          className="custom-button"
                                          onClick={() => {

                                          }}
                                      >Publish</Button>
                                  </section>

                              </div>

                          </Grid>
                      </Grid> : ''}
                  </div> : ''}

              </div>}


          </div>
      </div>
  );
}

export default Fund;
