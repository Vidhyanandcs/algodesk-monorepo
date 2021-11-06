import './Header.scss';
import {Grid} from "@material-ui/core";
import Logo from "../Logo/Logo";

function Header(): JSX.Element {
    return (<div className={"header-wrapper"}>
        <div className={"header-container"}>
            <Grid container spacing={2}>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                </Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                    <div className={"logo "}>
                        <Logo></Logo>
                    </div>
                </Grid>
                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                </Grid>
            </Grid>
        </div>
    </div>);
}

export default Header;
