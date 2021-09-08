import './Body.scss';
import React from "react";
import {Button, Grid} from "@material-ui/core";
import {ArrowRightAlt, Twitter} from "@material-ui/icons";
import background from '../../assets/images/hero-img.png';

function Body(): JSX.Element {
    return (<div className={"body-wrapper"}>
        <div className={"body-container"}>
            <Grid container spacing={2}>
                <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                </Grid>
                <Grid item xs={10} sm={8} md={8} lg={8} xl={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            <div className="title">
                                Create, Configure and Manage your Assets on Algorand Blockchain
                            </div>

                            <div className="subtitle">
                                Supported Wallets
                            </div>

                            <div className="signer">
                                <img alt="myalgo wallet" src='data:image/svg+xml;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIj4KICAgIDxwYXRoIGlkPSJwcmVmaXhfX1N1YnRyYWN0aW9uXzExIiBmaWxsPSIjMjQ1ZWM3IiBkPSJNMTUgMzBBMTUgMTUgMCAwIDEgNC4zOTIgNC4zOTMgMTUgMTUgMCAxIDEgMjUuNiAyNS42MDYgMTQuOSAxNC45IDAgMCAxIDE1IDMwem0zLjk5MS0xOS41MDhsLjEyMi40NjggMi40NTkgOC45MWgyTDIwLjIxNCA4LjMxNCAyMC4xMzIgOGgtMS43NDVsLS4wNC4wNjMtMS42MzMgMi45LTEuNjc0IDIuOTc0LS4wNC4wNzEtLjAxOS0uMDcxLS4yLS43NjQtLjU3MS0yLjIxLS4wNjEtLjIyLS42MzMtMi40MjlMMTMuNDMgOGgtMS43NDVsLS4wNDEuMDYzLTEuNjMzIDIuOS0xLjY3MyAyLjk3NEw2LjY3MyAxNi45IDUgMTkuODczaDJMOC42NzQgMTYuOWwxLjY3NC0yLjk2MyAxLjY2My0yLjk3NC4yNzUtLjQ3MS4xMjIuNDcxLjUxIDEuOTU4LjYzNCAyLjQzOS4yMi44MzItLjQuNzA3LTEuNjcyIDIuOTc0aDJsLjcwNy0xLjI1NSAxLjIyOC0yLjE3OSAxLjQxNC0yLjUgMS42NjMtMi45NzQuMjc0LS40Njl6IiBkYXRhLW5hbWU9IlN1YnRyYWN0aW9uIDExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSguMDAyKSIvPgo8L3N2Zz4K'/>
                                <div className="name">MyAlgo Wallet</div>
                            </div>
                            <div className="signer">
                                <img alt="algosigner" src='data:image/jpeg+xml;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMCAggICggICAgICAgNCAgICAgICAgICAgICAgICQgICAgICAgICAgICAgJCAoICAgICgoKCQgLDQoIGAgICggBAwQEBgUGCgYGCg0NCw0OCg4ODQ0KDQ0NDhAQCg4NCw0ODg0NDQ0NDQ8QChAODw0OCA4NDQ0NDQ4NCA8NDQ0OCP/AABEIAIAAgAMBEQACEQEDEQH/xAAcAAEAAwEBAQEBAAAAAAAAAAAABwgJBgMFAgH/xAA1EAACAQMCBAMHAwMFAQAAAAABAgMABBEFEgYHCCETMUEJFBUiIzJRM0JSJWKBVHKSstIZ/8QAHAEBAAICAwEAAAAAAAAAAAAAAAUGBAcCAwgB/8QAQhEAAgECAwUEBAsECwAAAAAAAAECAxEEBSEGEjFBURMiYYFxkaHRMkJSU2KiscHS4fAWFzPTBxQVI2Nyc4KjssL/2gAMAwEAAhEDEQA/ANU6AUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAec86oGZiFUAszMQFVQMlmJ7AAdyT2AoDnuFOZenX7SJZX9neOn6i21zDO0eCB86xOxUZIGSMZrtnSnDWUWvSrHFST4HS11HIUAoCOuYfP7S9NFwJ7qJriJFZrRHU3DM+NiKmfubcpIJ+VDvbA71CY3OcJhFNVJreivgJ97XgrddfJavQsmXbPY7HuDpU2oTbW+09xW4tvoreb0WpzvTz1HRa4J4zEYLiPDsnmjRMcKytuY7lPZwcea4zk7cLJc8hmW9Hd3ZR1tya6r7/1aR2j2anlDhNS3oS0vzTS1T09XnfxmerQUoUAoBQCgFAKAUAoCgntU+dbwQWeh28pRp83d6EYgm2RilvE2POOaYSOV/NunnmrFlFC7dV8tF6ef68TEry+KZ7cruY1xpN7a6jauyzQzJIAGKiRAfqQvjzjmTdG6+qsasdWlGrBwlwZiRluu6N7+FeJYr23t7yBt8E0EVxC35jmRXQn8HawyPQ9q17OLhJxfFXRKp3Vz6tcD6cDzd5imxiSKDY1/OXjs0kYLGpVd011Of22tpHmaVsYwAvbfkQ+ZY54aCjTs6k7qCfDh3pS6RitW/LmWDJ8tWLqOdW6o07ObSu3d2jCPWc33Yrz5a5zcztejvLhYbRTOqs0a3JixdalcSybpbubsZWa4lP0oWJMcfhpjO8tpHH1o16qhRW9a63rd6pJvvTfO8nwXJWXG9/SOV4eeFoOpiHutpNw3u5Sio2jCPJKKXel8aV3e1rX16Z+Ra6LafUAN9MFe6cYOzA+S3QjttiyckZ3uWOSNgXcGQ5Qsvod7+JKzk+nSK8F7XfW1raA2nz55rie5/ChdQXXrN+L9isrXveYqsxTRQCgFAKAUAoBQH5kkABJIAAJJJwAB5kk+QH5oDCXqc5tHW9X1DUAxMLTGO1HftawfSt8A/aXjUSsP5u59a2BhaPY0ow58/TzIuct6TZFtZZ1msHsvebvvulS6ZI2ZrKbEYPmbO5LyRdz3bw5hMnbsqeCO2VFVDNqO5VU1wl9qM+hK6t0Lb8W8VQWME13cvshjQvI3mcDsFUerOxCKvqxA9arWJxEMNSlWqO0Yq7/XV8F4krg8JVxdaGHoq8pOyX65Li3yRn5zt50Sz+Kcsl5dIFulxj3HTg++20uNj826XC3d44Ee92jj2rtlU6azXNJ1N7lOou99CF7wpL0/Cm9LtpW0aPQ2R5JTo7q0dKk+5/iVLWqVmui1hTV3ZJyvrFkqdFPIDAXWbxO5BFhG48h5NdEH891hz6bpMHMLCw7K5Na2NrL/ACJ/9vd6+jKntvtDe+XYd/6jXsh98vKN/hIuNWzTTIoBQCgFAKAUAoBQFcuvrm78J0O72Ntubr+n2+PMeOre8OMdxstllw4+2Ro/LIqTy6j2tZX4LV/d7Tpqy3YmN/DmgS3c8FrAu+eWaKCFP5SzOqRr/lmAq6ykopyfBakclfQt31z9Gdrw9aaZeaf4rRk+537SOX33Ph74p1U/pibZMGUEIpWIADccw2Ax0q8pRn6V6OhkVaaik0Rr0K84Bo+uWckj7La4zYXRJwoS4ZRFIxPZRFcLE7MfJBJ5ZNZWYUe1otLitV5fkcKUt2Rp/wBU3PCPSLQxpskvZgVgjdVkWNR91xIjAqVjPZFcEPJj5WCSY05tDm0cDQ3Y2dSekU1e3WTT6cr8XysmbK2UyKeZ4nfldUoWcmm02+UE1rd82npHmm1eovTRyPk1y7MtxvNlE4lu5GJzO7HcIA/mXlOWkYHKpuOVLx51tkWUyzGvv1L9nF3k+r+Tfq+fRc7tX3BtPnscowqhRt2slaC+SuG9bouS5vlZO2kdvbqgVEUKoAVVUBVVVGAqgYAAAwAOwFbyjFRSSVkuR5plJyblJ3b1bfF9T0r6cRQCgFAKAUAoBQCgMlvadc3vftWTTo2zBZReGwByDd3AWS4OR57EEMJB7q8cg9TVwyqjuUt98ZfYuBgV5XlboeXsyOUnv+sNfyLmCxhM2SMqbucNFbKR/aommB9GiSvua1tyluLjL7OZ8oRvK/Q0k6kOVQ1rSdQ07AMkkDNbk9tt1CRLbHP7QZkVWI/YzD1NVjC1uxqxn46+jmZs470WjN/ou5BQRxycU63HjTrZm9xtnXvfX0bFVwrffHDKNij7WmB3EC3mVpTP85p4ChKTfBa24+CXi/YtfE78oyurmOIhQpLWT8kucn4L28FqzoZ5dQ4n1P8AlPNJgDv4Vrbr/wBYYI+57ZY5PzNJ83mBvEZxjPpTflFe5L1+l6+pksJs/l/SEF/unJ/bKT8l4RWmkPLXl7b6Xaw2VsPkRfmcgb5ZD+pLJ+Xc9/wo2qMBVA3lgcFTwVGNClwXPm3zb8X+XBHmnM8xq5jiZYms9XwXKK5RXgva7t6tnUVnkWKAUAoBQCgFAKAUBy3NLj+LSrG91GbHhwW8kxXON7Kv04gf5SyFYl/uYV20qbqTUFzZxk7K5gXxHr8t3NPdTtvnlmlnmc/ulmdnkb/LMTWw4xUUorgtCKbvqbB+zz5S/C9DtpJF23F4x1CXI7iOUAWq589vu6pLg+TSyf5pmZVu0rNLhHT3+0kKMbRLNVFHeZs9S3OL4rci0s12afBI0dtDEoVZpmYh7jw0GCZGJEYxkKc4UyyA6Q2hzeWYYjcg3uRdo/SfDe+5dF6WeldlMhjlWF7WrbtZpOT+SuKj5cZdXzaSJ06Y49N0W9i0Wdg2v3Nk15cAbWW1jTa8VgWDZE7RF7l0UHIj3EkC3LbN2e2flgMJ/Wai78rX8FyXlz6y01sjUO1m0X9qYrsaT/uoX3fpPnP8N+EddHJotlViKQKAUAoBQCgFAKAUBxXMLnLpulGJb+48AyBzEPCmk3BCob9KN8Y3D7sZz2z3qKxuaYbBOKxE93evbut8OPBPqTeXZLjMxUnhae9u2v3oq172+E10K7dTXMXQuI7EaavEB0+IzxyzsunXdwZ0i3FISCsO1RLsmyCTujQfnPVhNrcsw899zvpp3Zq31GSdTYvOJqyo/Xp/jRVex6RuFldGk4teSMMpdF0e6QugILIH8RthYZAba2M5wcYqZe32W20l7J/yzHWwuc/M/Xp/zC/tp1Z8NxqqJfKqKoRFW1uwqqoAVQBb9gAAAPxVae02XPV1fqT/AAmb+x2b/Mf8lP8AEf296jtPv457XSJ3u9Qe3mW1hSC4j+oY2Cu8ksUcUaISGZ5HUYGM5IB4SzzD4mEqWDk51XGW6lGS1to22kkl1bRzhs1i8HUhXzCChRjKG/Jzg9N7VJRk5Nvgkov1EHXPJNOEtOueILqP4jqNvGr29vGD7rbzSMsUcsndXlWF5BI8ny7VBKqCqyDo2d2Tp0q0J4iV53ukvgx05dZdHwT4K6TJPaPbWrjac8PhFuUno2/hSX/mL5pO7WjlZtGdXCXOm9t9Vg12SV57xb1buZ2ODNl/rRnGAqSxlodqgBUbaAuABvKdCMqTpcrW9xqBSs7m73D+uxXUMFzAweGWGOeFx5PFKivGw/3KwNa/lFxbi+K0JVO59CuJ9FAKAUAoBQCgFARHzz6drfXWtnnuJoPBWVV8IIQwkKElt4OMbB5VXM2ySnmTg5ycd2/C3O3X0FvyHaSrk8akacIy33Fveb0tfp6ShV3xNwMjMnxfVmwzLuSyVkbaSNyHaMq2Mg4GRjsKx1/Rumr9q/Z7ixfvLr/MR9b95MfJTpx0HiCCS706/wBSMCTGAvPbRxBpAiuwQMPmCh1yfQnFYOI2DpUJbs6sr8dLe47If0j4mauqEPNy95IX/wA+rD/X3f8Awh/81i/sZh/nZ+pe45/vDxXzNP1y95MfJbkNZaHHItvulmc5luJQviMo+2MbQAsa+e0ebZJJ+ULZsryehl0Wqd3J8ZPj4LwX69FNzvP8Tm84yrWUY8IRvZdXrxb68loud+y4v4Xivra5s513QzQS28o9THMjI2PwQGyD6HB9KsEJuElJcU0ysNXVjAbj3g2bTru7sJxiaC4lt5O2AWicruX8o4G9T6qQfWtiU5qpFTXBpMiWrOxqf7Mnm97/AKQ2nyPm4sZfCAJyTaT7pLZiT/FhNCAPtSKP81Us1o7lXfXCX28zPoSvG3QuDUKZAoBQCgFAKAUAoCv/AFz83vg+h3siNtubgfD7bBwRJcqwkcEdwYrdZZFb0dUHbNSOX0e1rJPgtX5fmdVWW7ExUiiLEKoJJIAAGSSewAA7kk9gKvJGG7/TZypGi6Tp+nYAlSAPckY73UxMtx3/AHASuyKT+xUHoK1/iq3bVZT9Xo5ErCO7FIkysU5igFAZWe1N5S+66lbarGuIruHZMQPK7tAqEn0HiW5h2jzJjlPfvi25TW3qbpv4v2P8zBrxs7ka9AHN74Trlqrtttrv+nz5PYGdl92f8ArcrGpc/ajyfk1lZjR7Wi7cVqvv9h10pWkbO1SCSFAKAUAoBQCgFAZf+0o4hv8AVdQgsbSzvZbSzjcM6W0xSS8mIMxVghV1jjSJFb0Yy4+7va8rjCnTc5NXl48uRg1m27IjXoj6cby81uya8s7iG1tyb+Vp4ZI1Y25UwRgyKFYtcNFuTvmMSduxrKx+JjCi91q700fXj7DhSg3LU2KqlEiKAUAoCA+uHlAdZ0S9hjTfcwgX1qAMsZbYMXRQO7NLbtNEqjzdl88VI4Ct2VZN8Ho/P8zqqx3omPkXKnVlIZdOvwQQQRa3AII7gghMgg9wRV07Wn8petEduvobe9P/AB9Lqel6feXEUkNy8CrdRyxtE63MJMU52MAVV5UaRO32MtUPE01TqSiuF9PRyJODurkhVjHMUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQH//2Q==' />
                                <div className="name">AlgoSigner</div>
                            </div>
                            <div className="signer">
                                <img alt="algorand wallet" src='data:image/svg+xml;base64, PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMTIiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTE3IDE3Ljk5ODdIMTUuMjc1TDE0LjE1NDcgMTMuNDU5NUwxMS43NDczIDE3Ljk5ODdIOS44MjE5MUwxMy41NDMgMTAuOTczNEwxMi45NDUyIDguNTM0MDJMNy45MjY1OSAxOEg2TDEyLjM2MDIgNkgxNC4wNDU4TDE0Ljc4NDkgOC45ODIwMkgxNi41MjVMMTUuMzM2NCAxMS4yMzIxTDE3IDE3Ljk5ODdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'/>
                                <div className="name">Algorand Mobile Wallet</div>
                            </div>
                            <div className="open-app">
                                <Button color={"primary"}
                                        startIcon={<Twitter></Twitter>}
                                        variant={"outlined"}
                                        size={"large"}
                                        style={{marginRight: 20}}
                                        onClick={() => {
                                            window.open("https://twitter.com/algodeskio", "_blank");
                                        }}
                                >Twitter</Button>

                                <Button color={"primary"}
                                        className="open-app-button"
                                        endIcon={<ArrowRightAlt></ArrowRightAlt>}
                                        variant={"contained"} size={"large"}
                                        onClick={() => {
                                            window.open("https://app.algodesk.io", "_blank");
                                        }}
                                >Try Application</Button>

                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                            {/*<img alt="background" src="https://bootstrapmade.com/demo/templates/FlexStart/assets/img/hero-img.png"/>*/}
                            <img alt="background" src={background}/>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={1} sm={2} md={2} lg={2} xl={2}>
                </Grid>
            </Grid>

        </div>
    </div>);
}

export default Body;
