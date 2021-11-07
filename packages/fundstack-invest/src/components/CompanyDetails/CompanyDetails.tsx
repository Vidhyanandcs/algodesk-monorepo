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
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const {company} = fund;

  return (
      <div className="company-details-wrapper">
          <div className="company-details-container">
                <div className="tile-name">Company details</div>
              <div className="data">
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
              </div>
          </div>
      </div>
  );
}

export default CompanyDetails;
