import './NftMetaData.scss';
import {
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, Grid,
    IconButton, makeStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {setAction} from "../../redux/actions/nftActions";
import {CancelOutlined} from "@material-ui/icons";
import React from "react";
import {getCommonStyles} from "../../utils/styles";

const useStyles = makeStyles((theme) => {
    return {
        ...getCommonStyles(theme),
        customDialog: {
            position: "absolute",
            top: 100
        }
    };
});

function NftMetaData(): JSX.Element {

    const dispatch = useDispatch();

    const nftActions = useSelector((state: RootState) => state.nftActions);
    const {selectedNft} = nftActions;
    const show = nftActions.action === 'nft_meta_data';

    const classes = useStyles();
    
    return (<div>
        {show && selectedNft ? <Dialog
            fullWidth={true}
            maxWidth={"xs"}
            open={show}
            classes={{
                paper: classes.customDialog
            }}
        >
            <DialogTitle >
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>

                    </div>
                    <IconButton color="primary" onClick={() => {
                        dispatch(setAction(''));
                    }}>
                        <CancelOutlined />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className="nft-meta-data-wrapper">
                    <div className="nft-meta-data-container">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="asset-details">
                                    <div className="name">
                                        {selectedNft.asset.params.name}
                                    </div>
                                    <div className="id">
                                        ID: {selectedNft.asset.index}
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div>
                                    <pre>{JSON.stringify(selectedNft.metadata, null, 8) }</pre>
                                </div>
                            </Grid>
                        </Grid>


                    </div>
                </div>
            </DialogContent>
            <DialogActions>

            </DialogActions>
        </Dialog> : ''}
    </div>);
}

export default NftMetaData;
