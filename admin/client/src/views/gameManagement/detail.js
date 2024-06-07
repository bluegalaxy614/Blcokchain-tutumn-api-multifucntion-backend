import { Box, Grid } from "@mui/material";
import parser from 'query-string';
import { useEffect, useState, useContext } from "react";
import { getPlayerDetail, getRoundDetail } from "redux/action/report";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { LoadingContext } from "layout/Context/loading";
import { useSelector } from "react-redux";

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
	}
}));

const GameDetail = () => {
	const classes = useStyles();
	const userAuth = useSelector((state) => state.userAuth);
	const [roundDetail, setRoundDetail] = useState(null);
	const [totalPayout, setTotalPayout] = useState(0);
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
				round_uuid: queryData.id
			};
			const response = await getRoundDetail(requestData);
			if (response.status) {
				setRoundDetail(response.data);
				let payout = 0;
				response.data.players.map((item) => {
					payout += item.customer_amount * (1 - item.customer_payout);
				});
				setTotalPayout(payout);
			}
			hideLoading();
		}
	};

	return (
		<Box className={classes.DetailContainer}>
			<Box className={classes.InfoContainer}>
				<Box className={classes.InfoHeaderBox}>
					Game Number: {roundDetail?.number}
				</Box>
				<Grid container m={0}>
					<Grid item md={6} xs={12} p={2}>
						<Grid container m={0} className={classes.MainGrid}>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Chef Food
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{CHEF_FOODS[roundDetail?.result.dealer]}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Chef Profit
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{Number(totalPayout).toFixed(2)}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Curency
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										$FOOD
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
										State
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{roundDetail?.state}
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} className={classes.RowGrid}>
								<Grid container m={0}>
									<Grid item xs={4} className={classes.GridKeyItem}>
										Date
									</Grid>
									<Grid item xs={8} className={classes.GridValueItem}>
										{roundDetail !== null ? new Intl.DateTimeFormat('en-US', { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" }).format(new Date(roundDetail?.date)) : ''}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Box>
			<Box className={classes.HistoryDetailContainer}>
				<Box className={classes.InfoHeaderBox}>
					Player History
				</Box>
				<Box>
					<table className="table table-bordered table-hover">
						<thead>
							<tr>
								<td className={classes.TextAlignCenter}><strong>Address</strong></td>
								<td className={classes.TextAlignCenter}><strong>Pump Address</strong></td>
								<td className={classes.TextAlignCenter}><strong>Customer Food</strong></td>
								<td className={classes.TextAlignCenter}><strong>Customer Amount</strong></td>
								<td className={classes.TextAlignCenter}><strong>Customer Profit</strong></td>
								<td className={classes.TextAlignCenter}><strong>Player Result</strong></td>
							</tr>
						</thead>
						<tbody>
							{
								roundDetail?.players?.map((row, index) => (
									<tr key={index}>
										<td className={classes.TextAlignLeft}>{row.address}</td>
										<td className={classes.TextAlignLeft}>{row.pumpAddress}</td>
										<td className={classes.TextAlignCenter}>{CUSTOMER_FOOD[row.customer_food]}</td>
										<td className={classes.TextAlignCenter}>{row.customer_amount.toString()}</td>
										<td className={classes.TextAlignCenter}>{Number(row.customer_amount * (row.customer_payout - 1)).toFixed(2)}</td>
										<td className={classes.TextAlignCenter} style={row.result === 'win' ? { color: 'green' } : { color: 'red' }}>{row.result}</td>
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

export default GameDetail;