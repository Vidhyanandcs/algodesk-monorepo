import './AssetDetailsTile.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Link, makeStyles, Tab, Tabs, Tooltip} from "@material-ui/core";
import React, {useState} from "react";
import {ellipseAddress, formatNumWithDecimals} from "@algodesk/core";
import fSdk from "../../utils/fSdk";
import {InfoOutlined} from "@material-ui/icons";
import {getCommonStyles} from "../../utils/styles";
import algoLogo from '../../assets/images/algo-logo.png';

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        tabLabel: {
            fontSize: 18,
            lineHeight: 1,
            fontWeight: 600
        }
    };
});

interface AssetDetailsTileState{
    tab: string
}

const initialState: AssetDetailsTileState = {
    tab: "pool_information"
};

function getLink(url): JSX.Element {
    if (url) {
        return (<Link href={url} target="_blank" style={{color: '#000'}}>{url}</Link>);
    }

    return (<span>(Empty)</span>);
}

function AssetDetailsTile(): JSX.Element {
    const poolDetails = useSelector((state: RootState) => state.pool);
    const {pool} = poolDetails;
    const {asset, company} = pool;
    const {params} = asset;
    const {decimals} = params;
    const classes = useStyles();

    const [
        { tab },
        setState
    ] = useState(initialState);

  return (
      <div className="asset-details-tile-wrapper">
          <div className="asset-details-tile-container">
              <div className="data">
                  <Tabs
                      value={tab}
                      TabIndicatorProps={{style: {background: '#666'}}}
                      className="tabs"
                        onChange={(event, newValue) => {
                            setState(prevState => ({ ...prevState, tab: newValue }));
                        }}
                      >
                      <Tab label="Pool information" value="pool_information" className={classes.tabLabel}/>
                      <Tab label="Asset information" value="asset_information" className={classes.tabLabel}/>
                      <Tab label="Company information" value="company_information" className={classes.tabLabel}/>
                  </Tabs>
                  {tab === 'pool_information' ? <div className="tab-content">
                      <div className="pair">
                          <div className="key">
                              Total allocation
                              <Tooltip title="Total assets sold in this sale">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{formatNumWithDecimals(fSdk.fs.getTotalAllocationInDecimals(pool), decimals) + " " + pool.asset.params["unit-name"]}</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Min allocation
                              <Tooltip title="Minimum allocation for each investor">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{formatNumWithDecimals(fSdk.fs.getMinAllocationInDecimals(pool), decimals) + " " + pool.asset.params["unit-name"]}</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Max allocation
                              <Tooltip title="Maximum allocation for each investor">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{formatNumWithDecimals(fSdk.fs.getMaxAllocationInDecimals(pool), decimals) + " " + pool.asset.params["unit-name"]}</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Success criteria
                              <Tooltip title="Successful only if this percent of tokens are sold">
                                  <InfoOutlined fontSize={"small"}></InfoOutlined>
                              </Tooltip>
                          </div>
                          <div className="value">{fSdk.fs.getSuccessCriteriaPercentage(pool)}%</div>
                      </div>
                      <div className="pair">
                          <div className="key">
                              Price
                          </div>
                          <div className="value">1 {pool.asset.params["unit-name"]} = {fSdk.fs.getPrice(pool)}
                              <img src={algoLogo} alt="Algo" className="algo-logo"/>
                          </div>
                      </div>
                  </div> : ''}
                  {tab === 'asset_information' ? <div className="tab-content">
                      <div className="pair">
                          <div className="key">Asset ID</div>
                          <div className="value clickable" onClick={() => {
                              fSdk.explorer.openAsset(pool.asset.index);
                          }}>{pool.asset.index}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Name</div>
                          <div className="value">{pool.asset.params.name}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Total supply</div>
                          <div className="value">{fSdk.fs.algodesk.assetClient.getTotalSupplyWithTicker(asset)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Creator</div>
                          <div className="value clickable" onClick={() => {
                              fSdk.explorer.openAccount(pool.asset.params.creator);
                          }}>{ellipseAddress(pool.asset.params.creator, 8)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Decimals</div>
                          <div className="value">{pool.asset.params.decimals}</div>
                      </div>
                  </div> : ''}
                  {tab === 'company_information' ? <div className="tab-content">
                      <div className="pair">
                          <div className="key">Website</div>
                          <div className="value">{getLink(company.website)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Whitepaper</div>
                          <div className="value">{getLink(company.whitePaper)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Tokenomics</div>
                          <div className="value">{getLink(company.tokenomics)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Github</div>
                          <div className="value">{getLink(company.github)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Twitter</div>
                          <div className="value">{getLink(company.twitter)}</div>
                      </div>
                  </div> : ''}
              </div>
          </div>
      </div>
  );
}

export default AssetDetailsTile;
