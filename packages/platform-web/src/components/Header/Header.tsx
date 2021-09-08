import './Header.scss';
import {Box, Chip, Grid, Menu, MenuItem} from "@material-ui/core";
import {ArrowDropDown, PowerSettingsNew, OpenInNew, FileCopy, Power} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {logout} from "../../redux/actions/account";
import {useState} from "react";
import sdk from 'algosdk';
import {ellipseAddress} from "@algodesk/core";
import {openAccountInExplorer} from "../../utils/core";
import copy from 'copy-to-clipboard';
import {CustomTooltip} from '../../utils/theme';
import {showSnack} from "../../redux/actions/snackbar";
import Logo from "../Logo/Logo";


function Header(): JSX.Element {
    const account = useSelector((state: RootState) => state.account);
    const network = useSelector((state: RootState) => state.network);

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
                                <Logo></Logo>
                            </div>
                        </Box>
                        <Box p={1}>
                            <div>
                                <CustomTooltip title={"Connected to " + network.name}>
                                    <div className="network">
                                        <Chip
                                            color={"secondary"}
                                            label={network.name}
                                            size={"small"}
                                            variant={"default"}
                                            icon={<Power></Power>}
                                        />
                                    </div>
                                </CustomTooltip>
                                <CustomTooltip title="Account balance">
                                    <div className="balance">
                                        <img alt="bal" src='data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMTIiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTE3IDE3Ljk5ODdIMTUuMjc1TDE0LjE1NDcgMTMuNDU5NUwxMS43NDczIDE3Ljk5ODdIOS44MjE5MUwxMy41NDMgMTAuOTczNEwxMi45NDUyIDguNTM0MDJMNy45MjY1OSAxOEg2TDEyLjM2MDIgNkgxNC4wNDU4TDE0Ljc4NDkgOC45ODIwMkgxNi41MjVMMTUuMzM2NCAxMS4yMzIxTDE3IDE3Ljk5ODdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'/>
                                        {sdk.microalgosToAlgos(amount) + ""}
                                    </div>
                                </CustomTooltip>

                                <div className="address" onClick={(event) => {
                                    updateAnchorEl(event.currentTarget);
                                }}>
                                    <CustomTooltip title="Copy address">
                                        <FileCopy fontSize={"small"} className="copy-icon" onClick={(ev) => {
                                            copy(address, {
                                                message: 'Press #{key} to copy',
                                            });
                                            ev.preventDefault();
                                            ev.stopPropagation();
                                            dispatch(showSnack({
                                                severity: 'success',
                                                message: 'Address copied'
                                            }));
                                        }}></FileCopy>
                                    </CustomTooltip>
                                    {ellipseAddress(address)}
                                    <ArrowDropDown className="drop-icon"></ArrowDropDown>
                                </div>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => {updateAnchorEl(null)}}
                                    PaperProps={{
                                        style: {
                                            transform: 'translateX(0px) translateY(47px)',
                                        }
                                    }}
                                >
                                    <MenuItem onClick={() => {
                                                openAccountInExplorer(address);
                                                updateAnchorEl(null);
                                          }}
                                    >
                                        <OpenInNew fontSize={"small"} className="menu-icon"></OpenInNew>
                                        View in explorer
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        updateAnchorEl(null);
                                        dispatch(logout());
                                    }}
                                    >
                                        <PowerSettingsNew fontSize={"small"} className="menu-icon"></PowerSettingsNew>Disconnect</MenuItem>
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
