import './AssetDetailsTile.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Tab, Tabs} from "@material-ui/core";
import {useState} from "react";

interface AssetDetailsTileState{
    tab: string
}

const initialState: AssetDetailsTileState = {
    tab: "pool_information"
};

function AssetDetailsTile(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    console.log(fundDetails);

    const [
        { tab },
        setState
    ] = useState(initialState);

  return (
      <div className="asset-details-tile-wrapper">
          <div className="asset-details-tile-container">
                <div className="title">Asset details</div>
              <div className="data">
                  <Tabs value={tab} onChange={(event, newValue) => {
                      setState(prevState => ({ ...prevState, tab: newValue }));
                  }} indicatorColor="primary">
                      <Tab label="Pool information" value="pool_information"/>
                      <Tab label="Asset information" value="asset_information"/>
                  </Tabs>
              </div>
          </div>
      </div>
  );
}

export default AssetDetailsTile;
