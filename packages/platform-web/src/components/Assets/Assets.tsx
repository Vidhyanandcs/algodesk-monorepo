import './Assets.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Grid, Card, CardHeader, IconButton, makeStyles, CardContent} from "@material-ui/core";
import {ArrowRightAlt} from '@material-ui/icons';
import {commonStyles} from "../../utils/styles";


const useStyles = makeStyles({
    ...commonStyles,
    customDialog: {
        position: "absolute",
        top: 100
    }
});


function Assets(): JSX.Element {

    const account = useSelector((state: RootState) => state.account);
    const {information} = account;
    const createdAssets = information["created-assets"];
    console.log(createdAssets);
    const classes = useStyles();
  return (
      <div className="assets-wrapper">
          <div className="assets-container">
              <div className="title">My Assets</div>
              <Grid container spacing={2}>
                  {createdAssets.map((asset) => {
                      return (<Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={asset.index}>

                          <Card className={classes.customCard + ' asset'}>
                              <CardHeader
                                  action={
                                      <div>
                                          <IconButton color={"primary"} onClick={() => {

                                          }}>
                                              <ArrowRightAlt />
                                          </IconButton>
                                      </div>
                                  }
                                  avatar={<div>
                                      <span className='asset-name'>{asset.params.name}</span>
                                      <div className='asset-id'>ID: {asset.index}</div>
                                  </div>}
                                  subheader=""
                                  variant="outlined"
                              />
                              <CardContent>
                                  <div className="params">
                                      <div className="param">
                                          <div className="key">
                                            Manager
                                          </div>
                                          <div className="value">
                                              {asset.params.manager}
                                          </div>
                                      </div>
                                      <div className="param">
                                          <div className="key">
                                              Reserve
                                          </div>
                                          <div className="value">
                                              {asset.params.reserve}
                                          </div>
                                      </div>
                                      <div className="param">
                                          <div className="key">
                                              Freeze
                                          </div>
                                          <div className="value">
                                              {asset.params.freeze}
                                          </div>
                                      </div>
                                      <div className="param">
                                          <div className="key">
                                              Clawback
                                          </div>
                                          <div className="value">
                                              {asset.params.clawback}
                                          </div>
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>
                      </Grid>);
                  })}
              </Grid>
          </div>
      </div>
  );
}

export default Assets;
