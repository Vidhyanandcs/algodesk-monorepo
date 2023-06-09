import './CompanyDetails.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {Link} from "@material-ui/core";

function getLink(url): JSX.Element {
    if (url) {
        return (<Link href={url} target="_blank" style={{color: '#000'}}>{url}</Link>);
    }

    return (<span>(Empty)</span>);
}

function CompanyDetails(): JSX.Element {
    const poolDetails = useSelector((state: RootState) => state.pool);
    const {pool} = poolDetails;
    const {metadata} = pool;

  return (
      <div className="company-details-wrapper">
          <div className="company-details-container">
                <div className="tile-name">Company details</div>
              <div className="data">
                  <div className="pair">
                      <div className="key">Website</div>
                      <div className="value">{getLink(metadata.website)}</div>
                  </div>
                  <div className="pair">
                      <div className="key">Whitepaper</div>
                      <div className="value">{getLink(metadata.whitePaper)}</div>
                  </div>
                  <div className="pair">
                      <div className="key">Tokenomics</div>
                      <div className="value">{getLink(metadata.tokenomics)}</div>
                  </div>
                  <div className="pair">
                      <div className="key">Github</div>
                      <div className="value">{getLink(metadata.github)}</div>
                  </div>
                  <div className="pair">
                      <div className="key">Twitter</div>
                      <div className="value">{getLink(metadata.twitter)}</div>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default CompanyDetails;
