import './AssetDetailsTile.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Tab, Tabs} from "@material-ui/core";
import {useState} from "react";
import {globalStateKeys} from "@algodesk/fundstack-sdk";
import {A_Asset, ellipseAddress} from "@algodesk/core";
import {microalgosToAlgos} from "algosdk";
import fundstackSdk from "../../utils/fundstackSdk";

interface AssetDetailsTileState{
    tab: string
}

const initialState: AssetDetailsTileState = {
    tab: "pool_information"
};

function getValueInAssetDecimalsWithTicker(value: number, asset: A_Asset): string {
    return (value / Math.pow(10, asset.params.decimals)) + " " + asset.params["unit-name"];
}

function AssetDetailsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const {globalState} = fund;

    const [
        { tab },
        setState
    ] = useState(initialState);

  return (
      <div className="asset-details-tile-wrapper">
          <div className="asset-details-tile-container">
                <div className="tile-name">Asset details</div>
              <div className="data">
                  <Tabs value={tab} className="tabs" onChange={(event, newValue) => {
                      setState(prevState => ({ ...prevState, tab: newValue }));
                  }} indicatorColor="primary">
                      <Tab label="Pool information" value="pool_information"/>
                      <Tab label="Asset information" value="asset_information"/>
                  </Tabs>
                  {tab === 'pool_information' ? <div className="tab-content">
                      <div className="pair">
                          <div className="key">Total allocation</div>
                          <div className="value">{getValueInAssetDecimalsWithTicker(globalState[globalStateKeys.total_allocation], fund.asset)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Min allocation</div>
                          <div className="value">{getValueInAssetDecimalsWithTicker(globalState[globalStateKeys.min_allocation], fund.asset)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Max allocation</div>
                          <div className="value">{getValueInAssetDecimalsWithTicker(globalState[globalStateKeys.max_allocation], fund.asset)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Price</div>
                          <div className="value">1 {fund.asset.params["unit-name"]} = {microalgosToAlgos(globalState[globalStateKeys.price])} Algos</div>
                      </div>
                  </div> : ''}
                  {tab === 'asset_information' ? <div className="tab-content">
                      <div className="pair">
                          <div className="key">Asset ID</div>
                          <div className="value clickable" onClick={() => {
                              fundstackSdk.explorer.openAsset(fund.asset.index);
                          }}>{fund.asset.index}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Name</div>
                          <div className="value">{fund.asset.params.name}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Total supply</div>
                          <div className="value">{getValueInAssetDecimalsWithTicker(fund.asset.params.total, fund.asset)}</div>
                      </div>
                      <div className="pair">
                          <div className="key">Creator</div>
                          <div className="value">{ellipseAddress(fund.asset.params.creator, 8)}</div>
                      </div>
                  </div> : ''}
              </div>
          </div>
      </div>
  );
}

export default AssetDetailsTile;
