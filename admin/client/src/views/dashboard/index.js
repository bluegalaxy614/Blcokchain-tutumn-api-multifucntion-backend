import { Grid } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import { loadDashBoardData } from "redux/action/report";
import { useSelector } from "react-redux";
import PlayerCard from "./playerCard";
import RoundCard from "./RoundCard";
import { LoadingContext } from "layout/Context/loading";


const Dashboard = () => {
    const userAuth = useSelector((state) => state.userAuth);
    const [playerCount, setPlayerCount] = useState(0);
    const [roundCount, setRoundCount] = useState(0);
    const { showLoading, hideLoading } = useContext(LoadingContext);

    useEffect(() => {
        if (userAuth.isAuth) {
            initFunc();
        }
    }, [userAuth]);

    const initFunc = async () => {
        showLoading();
        const userId = userAuth.userData._id;
        const response = await loadDashBoardData({ id: userId });
        if (response.status) {
            setPlayerCount(response.user_count);
            setRoundCount(response.round_count);
        }
        hideLoading();
    }

    return (
        <Grid container spacing={1}>
            <PlayerCard count={playerCount} />
            <RoundCard count={roundCount} />
        </Grid>
    );
};

export default Dashboard;