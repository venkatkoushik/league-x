import {
    Avatar,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AlertContext } from "../../contexts/index";
import Popover from "@material-ui/core/Popover";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import { Routes } from "../../router/routes";
import RemoveIcon from "@material-ui/icons/Remove";
function filterResult(data = [], key = "", value = "") {
    return data?.filter((v) => v?.[key] === value) ?? [];
}

const useStyles = makeStyles((theme) => ({
    divcard: {
        display: "inline-block",
        padding: "3px",
    },
    divparent: {
        border: "2px solid black",
        width: "400px",
        display: "flex",
    },
    divi: {
        backgroundColor: "black",
        width: "2px",
    },
    grid: {
        display: "grid",
        gridTemplateRows: "0.7fr 3.9fr 3.9fr 0.5fr",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        padding: "10px"
    },
    heading: {
        gridColumn: "1/3",
        // placeSelf: "center"
    },
    inline: {
        display: "block",
    },
}));

const rules = {
    Batsmans: { min: 3, max: 7 },
    WicketKeepers: { min: 1, max: 5 },
    AllRounders: { min: 0, max: 4 },
    Bowlers: { min: 3, max: 7 },
};
function msgtell(num, type, more) {
    let msg = "";
    if (!more) {
        msg = `There is must be minimum of ${num} from the ${type}`;
    } else {
        msg = ` minimum of ${num} from the ${type}`;
    }
    return msg;
}

function errormsggiver(valid) {
    let totalmsg = "";
    let bool = 0;
    Object.keys(rules).forEach((v, i) => {
        if (!valid[v]) {
            bool = bool + 1;
            totalmsg =
                totalmsg + (totalmsg ? "," : "") + msgtell(rules[v]?.min, v, bool > 1);
        }
    });
    return totalmsg;
}
function valuescreator(value) {
    let data = {};
    for (let i = 1; i <= value; i++) {
        data[`player${i}`] = { key: `player${i}` };
    }
    return data;
}

function Home() {
    const classes = useStyles();
    const alert = useContext(AlertContext);
    const [playerslist, setPlayersList] = useState([]);
    const [selectedPlayerslist, setselectedPlayersList] = useState([]);
    const history = useHistory();
    const [totalPlayertypes, setTotalPlayerTypes] = useState({
        totalBowlers: [],
        totalBatsmans: [],
        totalAllRounders: [],
        totalWicketKeepers: [],
    });
    const [selectedPlayertypes, setSelectedPlayerTypes] = useState({
        Bowlers: {},
        Batsmans: {},
        AllRounders: {},
        WicketKeepers: {},
    });
    const [teamPlayers, setTeamplayers] = useState({
        teamPlayersOf_PS: [],
        teamPlayersOf_MS: [],
        selectedTeamplayersOf_PS: [],
        selectedTeamplayersOf_MS: [],
    });

    const [credits, setCredits] = useState(0);
    const [creditsLeft, setCreditsLeft] = useState(100);

    async function Getplayers() {
        var config = {
            method: "get",
            maxBodyLength: Infinity,
            url: "https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_Players_of_match.json",
        };

        async function Dataspliting(data = []) {
            let totalBowlers = [],
                totalBatsmans = [],
                totalAllRounders = [],
                totalWicketKeepers = [],
                teamPlayersOf_MS = [],
                teamPlayersOf_PS = [];
            data.forEach(async (v) => {
                switch (v?.role) {
                    case "Batsman":
                        totalBatsmans.push(v);
                        break;
                    case "Bowler":
                        totalBowlers.push(v);
                        break;

                    case "All-Rounder":
                        totalAllRounders.push(v);
                        break;

                    case "Wicket-Keeper":
                        totalWicketKeepers.push(v);
                        break;
                }
                switch (v?.team_short_name) {
                    case "MS":
                        teamPlayersOf_MS.push(v);
                        break;
                    case "PS":
                        teamPlayersOf_PS.push(v);
                        break;
                }
            });
            setTotalPlayerTypes({
                totalBowlers,
                totalAllRounders,
                totalBatsmans,
                totalWicketKeepers,
            });
            setTeamplayers({ ...teamPlayers, teamPlayersOf_PS, teamPlayersOf_MS });
        }
        await axios(config)
            .then(async (res) => {
                Dataspliting(res?.data);
            })
            .catch(function (error) { });
    }
    const handleclick = (playertype) => { };
    React.useEffect(() => {
        Getplayers();
        let data = selectedPlayertypes;
        Object.keys(rules).map((v) => {
            let sampledata = valuescreator(rules?.[v]?.max);
            data[v] = sampledata;
        });
        setSelectedPlayerTypes({ ...selectedPlayertypes, ...data });
    }, []);
    const handlesubmit = () => {
        let mslength = selectedPlayerslist.filter(
            (v) => v?.team_short_name === "MS"
        );
        let pslength = selectedPlayerslist.filter(
            (v) => v?.team_short_name === "PS"
        );
        let valid = {
            Bowlers:
                selectedPlayerslist.filter((v) => v?.role === "Bowler")?.length >= 3,
            Batsmans:
                selectedPlayerslist.filter((v) => v?.role === "Batsman")?.length >= 3,
            WicketKeepers:
                selectedPlayerslist.filter((v) => v?.role === "Wicket-Keeper")
                    ?.length >= 1,
            AllRounders:
                selectedPlayerslist.filter((v) => v?.role === "All-Rounder")?.length >=
                0,
        };

        if (selectedPlayerslist.length === 11) {
            if (
                valid.AllRounders &&
                valid.Batsmans &&
                valid.Batsmans &&
                valid.Bowlers
            ) {
                if (mslength.length >= 7 || pslength?.length >= 7) {
                    history.push({
                        pathname: Routes.players,
                        state: selectedPlayerslist,
                    });
                } else {
                    alert.setSnack({
                        ...alert,
                        open: true,
                        msg: "There is must be 7 members from one of the team",
                        severity: "warning",
                    });
                }
            } else {
                alert.setSnack({
                    ...alert,
                    open: true,
                    msg: errormsggiver(valid),
                    severity: "warning",
                });
            }
        } else {
            alert.setSnack({
                ...alert,
                open: true,
                msg: "There is must be 11 members from the team",
                severity: "warning",
            });
        }
    };

    function Table(props) {
        let { key, type, data, player, wholedata } = props;
        const [anchorEl, setAnchorEl] = React.useState(null);

        const handleClick = (event, v) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const open = Boolean(anchorEl);

        const handleListCLick = (value, type) => {
            debugger;
            // for players state
            if (credits + Number(value?.event_player_credit) <= 100) {
                let final = JSON.parse(JSON.stringify(selectedPlayertypes));
                final[type][data] = { ...final[type][data], lock: true };
                final[type][data]["data"] = { ...value };

                // removing the player from type lis

                let typelist = JSON.parse(JSON.stringify(totalPlayertypes));
                let filterplayer = typelist?.[`total${type}`]?.filter((v) => {
                    return value?.id !== v?.id;
                });
                typelist[`total${type}`] = filterplayer;

                /// dashboard update
                // let cred = Number(credits) + Number(value?.event_player_credit)
                setCredits(Number(value?.event_player_credit) + credits);
                setCreditsLeft(creditsLeft - Number(value?.event_player_credit));
                setselectedPlayersList([...selectedPlayerslist, value]);
                //// setting the state
                setTotalPlayerTypes({ ...typelist });
                setSelectedPlayerTypes({ ...final });
            } else {
                alert.setSnack({
                    ...alert,
                    open: true,
                    msg: "Credit limit is exceeded.it must be below 100",
                    severity: "warning",
                });
            }
        };

        return (
            <div>
                <div style={{ borderBottom: "1px solid black" }}>
                    <span style={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            size="small"
                            variant="outlined"
                            onClick={(e) => handleClick(e, type)}
                        >
                            <AddIcon />
                        </IconButton>
                        <span
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: "15px",
                            }}
                        >
                            <Typography variant="caption">
                                <strong>{wholedata?.data?.name}</strong>
                            </Typography>
                            <Typography variant="caption">
                                <strong>
                                    {wholedata?.data?.team_name
                                        ? `Team Name-${wholedata?.data?.team_name}`
                                        : ""}
                                </strong>
                            </Typography>

                            <Typography variant="caption">
                                <strong>
                                    {wholedata?.data?.event_player_credit
                                        ? `credits - ${wholedata?.data?.event_player_credit}`
                                        : ""}
                                </strong>
                            </Typography>
                        </span>
                    </span>
                </div>
                <Popover
                    id={key}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                >
                    {" "}
                    <Typography variant="h6" align="center">
                        {type}
                    </Typography>
                    <List className={classes?.root}>
                        {totalPlayertypes[`total${type}`]?.map((v, i) => {
                            return (
                                <>
                                    <ListItem
                                        button
                                        onClick={() => handleListCLick(v, type)}
                                        alignItems="flex-start"
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp" src={v?.team_logo} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={v?.name}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        Role- {v?.role}
                                                    </Typography>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        className={classes.inline}
                                                        color="textPrimary"
                                                    >
                                                        Country- {v?.country}
                                                    </Typography>
                                                    Credits- {v?.event_player_credit}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </>
                            );
                        })}
                    </List>
                </Popover>
            </div>
        );
    }
    return (
        <div style={{}}>
            <div className={classes?.grid}>
                <div className={classes?.heading}>
                    <Typography align="center">Pick Players</Typography>
                    <div style={{ display: "flex", justifyContent: "right", gap: "15px" }}>
                        <Button color="secondary" size="small" variant="outlined" onClick={() => window.location.reload()}>Reset</Button>
                        <div className={classes?.divparent}>
                            <div className={classes?.divcard}>
                                <Typography variant="subtitle2">
                                    {selectedPlayerslist?.length} players
                                </Typography>
                            </div>
                            <Divider
                                orientation="vertical"
                                flexItem
                                className={classes?.divi}
                            />
                            <div className={classes?.divcard}>
                                <Typography variant="subtitle2">
                                    {
                                        selectedPlayerslist.filter(
                                            (v) => v?.team_short_name === "MS"
                                        )?.length
                                    }{" "}
                                    Melbourne Stars
                                </Typography>
                            </div>
                            <Divider
                                orientation="vertical"
                                flexItem
                                className={classes?.divi}
                            />

                            <div className={classes?.divcard}>
                                <Typography variant="subtitle2">
                                    {
                                        selectedPlayerslist.filter(
                                            (v) => v?.team_short_name === "PS"
                                        )?.length
                                    }{" "}
                                    Perth Scorchers
                                </Typography>
                            </div>
                            <Divider
                                orientation="vertical"
                                flexItem
                                className={classes?.divi}
                            />

                            <div className={classes?.divcard}>
                                <Typography variant="subtitle2">
                                    {creditsLeft} Cr left
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>

                {Object.keys(rules).map((v, i) => {
                    return (
                        <div style={{ border: "1px solid black" }}>
                            <Typography align="justify" variant="">
                                Pick {v} min-{rules[v]?.min} max-{rules[v]?.max}
                            </Typography>
                            <div>
                                {Object.keys(selectedPlayertypes?.[v])?.map((e, j) => {
                                    return (
                                        <Table
                                            key={`${i}table`}
                                            type={v}
                                            wholedata={selectedPlayertypes[v][e]}
                                            data={e}
                                            player={j + 1}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                <div style={{ gridColumn: "1/3", placeSelf: "center" }}>
                    <Button onClick={handlesubmit} variant="outlined" color="secondary">
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Home;
