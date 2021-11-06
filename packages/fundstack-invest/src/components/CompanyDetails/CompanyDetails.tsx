import './CompanyDetails.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

function CompanyDetails(): JSX.Element {
    const fundDetails = useSelector((state: RootState) => state.fund);
    const {fund} = fundDetails;
    const {company} = fund;

  return (
      <div className="company-details-wrapper">
          <div className="company-details-container">
                <div className="title">Company details</div>
              <div className="data">
                  <div className="pair">
                      <div className="key">Website</div>
                      <div className="value">{company.website}</div>
                  </div>
                  <div className="pair">
                      <div className="key">Whitepaper</div>
                      <div className="value">{company.whitePaper}</div>
                  </div>
                  <div className="pair">
                      <div className="key">Tokenomics</div>
                      <div className="value">{company.tokenomics}</div>
                  </div>
                  <div className="pair">
                      <div className="key">Github</div>
                      <div className="value">{company.github}</div>
                  </div>
                  <div className="pair">
                      <div className="key">Twitter</div>
                      <div className="value">{company.twitter}</div>
                  </div>
              </div>
          </div>
      </div>
  );
}

export default CompanyDetails;
