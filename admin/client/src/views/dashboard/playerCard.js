import { Box, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { GroupRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowCircleRight } from "@mui/icons-material";
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    DashBox: {
        borderRadius: '6px',
        boxShadow: '0 1px 1px rgb(0 0 0 / 10%)',
        display: 'block',
        marginBottom: '20px',
        position: 'relative',
        backgroundColor: '#00c0ef'
    },
    TextBox: {
        padding: '10px',
        color: '#FFF',
        "& > h3": {
            color: '#FFF',
            fontSize: '38px',
            fontWeight: '700',
            margin: '0px 0px 10px',
            padding: '0px',
            whiteSpace: 'nowrap'
        }
    },
    IconBox: {
        color: 'rgba(0,0,0,.15)',
        position: 'absolute',
        right: '10px',
        top: '0px',
        "&>*": {
            fontSize: '90px'
        }
    },
    ActionBox: {
        background: 'rgba(0,0,0,.1)',
        color: 'hsla(0,0%,100%,.8)',
        display: 'block',
        padding: '3px 0px',
        position: 'relative',
        textAlign: 'center',
        "&>*": {
            fontSize: '20px'
        },
        "&:hover": {
            color: 'hsla(0,0%,100%,.8)'
        }
    }
}));

const PlayerCard = ({ count = 0 }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch({type: 'SET_MENU_PATH', data: '/player/player-list'});
    };

    return (
        <Grid item xs={12} md={6} lg={3}>
            <Box className={classes.DashBox}>
                <Box className={classes.TextBox}>
                    <h3>{count}</h3>
                    <p>Total Players</p>
                </Box>
                <Box className={classes.IconBox}>
                    <GroupRounded />
                </Box>
                <Box onClick={handleClick}>
                    <Link to='/player/player-list' className={classes.ActionBox}>
                        More info &nbsp;
                        <ArrowCircleRight />
                    </Link>
                </Box>
            </Box>
        </Grid>
    );
};

PlayerCard.propTypes = {
    count: PropTypes.number.isRequired
}

export default PlayerCard;