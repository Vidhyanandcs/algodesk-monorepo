import './Header.scss';
import {Box, Chip, Grid, Menu, MenuItem} from "@material-ui/core";
import {ArrowDropDown, PowerSettingsNew, OpenInNew, GraphicEqSharp} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {logout} from "../../redux/actions/account";
import {useState} from "react";
import sdk from 'algosdk';
import {ellipseAddress} from "@algodesk/core";
import {openAccountInExplorer} from "../../utils/core";


function Header(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);

    const [anchorEl, updateAnchorEl] = useState<any>(null);
    const {address, amount} = account.information;
    const dispatch = useDispatch();

    return (<div className={"header-wrapper"}>
        <div className={"header-container"}>
            <Grid container spacing={2}>
                <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                </Grid>
                <Grid item xs={10} sm={8} md={8} lg={8} xl={8}>
                    <Box display="flex" p={1} alignItems="flex-start">
                        <Box p={1} flexGrow={1}>
                            <div className={"logo "}>
                                <GraphicEqSharp></GraphicEqSharp>
                                Algodesk
                            </div>
                        </Box>
                        <Box p={1}>
                            <div style={{marginTop: -6}}>
                                <Chip
                                    color={"primary"}
                                    icon={<div>
                                        <Chip
                                            color={"primary"}
                                            label={sdk.microalgosToAlgos(amount) + " Algos"}
                                            size={"small"}
                                        />
                                    </div>}
                                    label={ellipseAddress(address)}
                                    variant={"outlined"}
                                    onClick={(event) => {
                                        updateAnchorEl(event.currentTarget);
                                    }}
                                    style={{color: '#000', fontWeight: 'bold'}}
                                    deleteIcon={<ArrowDropDown />}
                                    onDelete={(event) => {
                                        updateAnchorEl(event.currentTarget.parentElement);
                                    }
                                    }
                                ></Chip>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => {updateAnchorEl(null)}}
                                    PaperProps={{
                                        style: {
                                            transform: 'translateX(30px) translateY(40px)',
                                        }
                                    }}
                                >
                                    <MenuItem onClick={() => {
                                                openAccountInExplorer(address);
                                                updateAnchorEl(null);
                                          }}
                                    >
                                        <OpenInNew fontSize={"small"} className="menu-icon"></OpenInNew>
                                        View account
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        updateAnchorEl(null);
                                        dispatch(logout());
                                    }}
                                    >
                                        <PowerSettingsNew fontSize={"small"} className="menu-icon"></PowerSettingsNew>Logout</MenuItem>
                                </Menu>
                            </div>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                </Grid>
            </Grid>
        </div>
    </div>);
}

export default Header;
