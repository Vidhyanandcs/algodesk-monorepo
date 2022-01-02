import './MyFundActivity.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {getAccountActivity} from "../../redux/actions/fund";
import {ellipseAddress} from "@algodesk/core";
import fundstackSdk from "../../utils/fundstackSdk";
import regNormal from '../../assets/images/resistered-normal.png';
import invNormal from '../../assets/images/invested-normal.png';
import claimNormal from '../../assets/images/claim-normal.png';


function MyFundActivity(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const account = useSelector((state: RootState) => state.account);
    const {activity} = fundDetails.account;

    let {list: activityList} = activity;

    if (!activityList) {
        activityList = [];
    }
    const dispatch = useDispatch();

    const params = useParams();
    // @ts-ignore
    const id: number = params.id;

    useEffect(() => {
        dispatch(getAccountActivity(id));
    }, [dispatch, id, account]);

  return (
      <div className="my-fund-activity-wrapper">
          <div className="my-fund-activity-container">
                <div className="tile-name">My activity</div>
              {account.loggedIn ? <div>
                  {activity.loading ? <div className="loading">loading ...</div> : <div>
                      {activityList.length === 0 ? <div className="no-activity">Your wallet doesn't have any activity for this fund</div> : ''}
                      <div className="activity-list">
                          {activityList.map((item) => {
                              return (<div className="activity" key={item.id}>
                                  {item.label === 'Registered' ? <img src={regNormal} alt={item.label}/> : ''}
                                  {item.label === 'Invested' ? <img src={invNormal} alt={item.label}/> : ''}
                                  {item.label === 'Claimed' || item.label === 'Withdrawn'? <img src={claimNormal} alt={item.label}/> : ''}
                                  <div className="title">
                                      {item.label}
                                  </div>
                                  <div className="txn-id" onClick={() => {
                                      fundstackSdk.explorer.openTransaction(item.id);
                                  }}>
                                      Txn ID: {ellipseAddress(item.id, 8)}
                                  </div>
                              </div>);
                          })}
                      </div>

                  </div>}

              </div> : <div className="not-connected-message">Wallet not connected</div>}

          </div>
      </div>
  );
}

export default MyFundActivity;
