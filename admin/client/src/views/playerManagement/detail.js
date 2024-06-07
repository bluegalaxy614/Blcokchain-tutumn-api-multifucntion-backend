import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import parser from 'query-string';
import { useEffect, useState, useContext } from "react";
import { bonusUser, getPlayerDetail } from "redux/action/report";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { LoadingContext } from "layout/Context/loading";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

const CHEF_FOODS = [
	'Burger',
	'Taco',
	'Salad',
	'Hotdog',
	'Chicken',
	'Pancakes',
	'French',
	'Sausage',
	'Spaghetti'
];

const CUSTOMER_FOOD = [
	'Sushi',
	'Pizza',
	'Icecream'
];

const useStyles = makeStyles(() => ({
	DetailContainer: {
		width: '100%',
		height: 'auto',
		display: 'flex',
		flexDirection: 'column',
		gap: '20px'
	},
	InfoContainer: {
		width: '100%',
		borderTop: '3px solid #d2d6de',
		background: '#FFF',
		padding: '10px'
	},
	InfoHeaderBox: {
		width: '100%',
		padding: '10px',
		fontSize: '18px',
		fontWeight: '800'
	},
	GridKeyItem: {
		padding: '8px',
		fontSize: '14px',
		color: '#000',
		fontWeight: '600',
		backgroundColor: '#f9f9f9',
		borderRight: '1px solid #dee2e6'
	},
	GridValueItem: {
		padding: '8px',
		fontSize: '14px',
		color: '#000',
		fontWeight: '200',
		borderLeft: 'none'
	},
	MainGrid: {
		border: '1px solid #dee2e6',
		"&>$RowGrid:last-child": {
			borderBottom: 'none'
		}
	},
	RowGrid: {
		borderBottom: '1px solid #dee2e6'
	},
	HistoryDetailContainer: {
		width: '100%',
		borderTop: '3px solid #00a65a',
		background: '#FFF',
		padding: '10px'
	},
	TextAlignCenter: {
		textAlign: 'center'
	},
	TextAlignRight: {
		textAlign: 'right'
	},
	TextAlignLeft: {
		textAlign: 'left'
	},
	BonusContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: 8
	}
}));

const PlayerDetail = () => {
	const classes = useStyles();
	const userAuth = useSelector((state) => state.userAuth);
	const [playerDetail, setPlayerDetail] = useState(null);
	const [bonusAmount, setBonusAmount] = useState(0);

	const { addToast } = useToasts();
	const { showLoading, hideLoading } = useContext(LoadingContext);

	useEffect(() => {
		initFunc();
	}, []);

	const initFunc = async () => {
		const queryData = parser.parse(window.location.search);
		const userId = userAuth?.userData?._id;
		if (queryData?.id) {
			showLoading();
			const requestData = {
				id: userId,
				user_id: queryData.id
			};
			const response = await getPlayerDetail(requestData);
			if (response.status)
				setPlayerDetail(response.data);
			hideLoading();
		}
	};

	const handleBonusAmount = (e) => {
		setBonusAmount(e.target.value.replace(/[^0-9]/g, ""))
	}

	const handleSubmit = async () => {
		const userId = userAuth?.userData?._id;
		if (bonusAmount === 0)
			return;

		showLoading();
		const requestData = {
			id: userId,
			user_id: playerDetail?._id,
			bonus: Number(bonusAmount)
		};
		const response = await bonusUser(requestData);
		if (response.status) {
			addToast('Successfully submitted.', { appearance: 'success', autoDismiss: true });
			setPlayerDetail(response.data);
			let playerData = {...playerDetail};
			playerData.balance = response.balance;
			setPlayerDetail({ ...playerData });
		}
		hideLoading();
	}

	return (
		<Box className={classes.DetailContainer}>
			<Box className={classes.InfoContainer}>
				<Box className={classes.InfoHeaderBox}>
					Player Detail: {playerDetail?._id}
				</Box>
				<Grid container m={0}>
					<Grid item md={6} xs={12} p={2}>
						<Grid container m={0} className={classes.MainGrid}>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Player Wallet
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{playerDetail?.address}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Pump Address
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{playerDetail?.pumpAddress}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid item md={6} xs={12} p={2}>
						<Grid container m={0} className={classes.MainGrid}>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Balance
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{Number(playerDetail?.balance).toString()}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Currency
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										$FOOD
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Register Date
									</Grid>
									<Grid item xs={8} className={clsx(classes.GridValueItem)}>
										{playerDetail !== null ? new Intl.DateTimeFormat('en-US').format(new Date(playerDetail?.createdAt)) : ''}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Box>
			<Box className={classes.InfoContainer}>
				<Box className={classes.BonusContainer}>
					<Typography>Bonus</Typography>
					<TextField id="bonus-label" label="Input Bonus" variant="outlined" type="number" value={bonusAmount} onChange={(e) => handleBonusAmount(e)} />
					<Button onClick={handleSubmit} variant="contained">Submit</Button>
				</Box>
			</Box>
			<Box className={classes.HistoryDetailContainer}>
				<Box className={classes.InfoHeaderBox}>
					Game History
				</Box>
				<Box>
					<table className="table table-bordered table-hover">
						<thead>
							<tr>
								<td className={classes.TextAlignCenter}><strong>Game Number</strong></td>
								<td className={classes.TextAlignCenter}><strong>Chef Food</strong></td>
								<td className={classes.TextAlignCenter}><strong>Customer Food</strong></td>
								<td className={classes.TextAlignCenter}><strong>Customer Amount</strong></td>
								<td className={classes.TextAlignCenter}><strong>Customer Profit</strong></td>
								<td className={classes.TextAlignCenter}><strong>Game Result</strong></td>
								<td className={classes.TextAlignCenter}><strong>Game State</strong></td>
								<td className={classes.TextAlignCenter}><strong>Game Date</strong></td>
							</tr>
						</thead>
						<tbody>
							{
								playerDetail?.histories?.map((row, index) => (
									<tr key={index}>
										<td className={classes.TextAlignCenter} style={{ textTransform: 'uppercase' }}>{row.round_number}</td>
										<td className={classes.TextAlignCenter}>{CHEF_FOODS[row.chef_food]}</td>
										<td className={classes.TextAlignCenter}>{CUSTOMER_FOOD[row.customer_food]}</td>
										<td className={classes.TextAlignCenter}>{row.bet_amount}</td>
										<td className={classes.TextAlignCenter}>{row.bet_amount * (row.customer_payout - 1).toFixed(2)}</td>
										<td className={classes.TextAlignCenter} style={row.result === 'win' ? { color: 'green' } : { color: 'red' }}>{row.result}</td>
										<td className={classes.TextAlignCenter}>{row.round_state}</td>
										<td className={classes.TextAlignCenter}>{new Intl.DateTimeFormat('en-US', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).format(new Date(row.round_date))}</td>
									</tr>
								))
							}
						</tbody>
					</table>
				</Box>
			</Box>
		</Box>
	);
};

export default PlayerDetail;