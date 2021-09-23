import './Logo.scss';
import {Category} from "@material-ui/icons";

function Logo(): JSX.Element {
  return (
      <div>
        <div className="logo-icon">
            <Category color={"primary"}></Category>
        </div>
        <div className="logo-text">Algodesk</div>
      </div>
  );
}

export default Logo;
