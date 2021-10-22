import './Logo.scss';
import logo from "../../assets/images/logo.png";

function Logo(): JSX.Element {
  return (
      <div>
          <img src={logo} className="logo-img" alt="logo"/>
      </div>
  );
}

export default Logo;
