import { Box, Table, TableHead, TableRow, TableSortLabel, TableCell, TableBody, IconButton, TablePagination, Select, MenuItem } from "@mui/material";
import PropTypes from 'prop-types';
import { useState, useContext, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { LoadingContext } from "layout/Context/loading";
import { useDispatch, useSelector } from "react-redux";
import { loadDashBoardData, getRoundData, deleteRoundData } from "redux/action/report";
import { Delete, Visibility } from '@mui/icons-material';
import { useToasts } from 'react-toast-notifications';
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";

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

const useStyles = makeStyles(() => ({
    GameContainer: {
        background: '#fff',
        borderRadius: '3px',
        borderTop: '3px solid #d2d6de',
        boxShadow: '0 1px 1px rgb(0 0 0 / 10%)',
        marginBottom: '20px',
        position: 'relative',
        width: '100%',
    },
    TableTitleBox: {
        color: '#444',
        padding: '10px',
        position: 'relative',
        display: 'inline-block',
        fontSize: '18px',
        lineHeight: '1',
    },
    TableMainBox: {
        padding: '10px',
        width: '100%'
    },
    TableHeaderCell: {
        background: 'rgb(231, 235, 240)',
        padding: '8px'
    },
    ActionButton: {
        padding: '3px'
    },
    TableRow: {
        "&>.MuiTableCell-root": {
            padding: '6px'
        }
    },
    ActionCell: {
        width: '25px'
    }
}));

const headCells = [
    { value: 'Number', label: 'Number', ischeck: true },
    { value: 'result', label: 'Chef Food', ischeck: true },
    { value: 'players', label: 'Players', ischeck: true },
    { value: 'profit', label: 'Chef Profit', ischeck: true },
    { value: 'state', label: 'State', ischeck: true },
    { value: 'detail', label: 'Detail', ischeck: false },
    { value: 'delete', label: 'Delete', ischeck: false }
];

const EnhancedTableHead = (props) => {
    let { order, orderBy, onRequestSort } = props;
    const classes = useStyles();

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell, key) => (
                    <TableCell key={key} className={classes.TableHeaderCell}>
                        {
                            headCell.ischeck ?
                                <TableSortLabel
                                    active={orderBy === headCell.value}
                                    direction={orderBy === headCell.value ? order : 'asc'}
                                    onClick={() => onRequestSort(headCell.value)}
                                >
                                    {headCell.label}
                                </TableSortLabel>
                                :
                                <>{headCell.label}</>
                        }
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

const GameManagement = () => {
    const classes = useStyles();
    const { showLoading, hideLoading } = useContext(LoadingContext);
    const userAuth = useSelector((state) => state.userAuth);
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('createdAt');
    const [data, setData] = useState([]);

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        init()
    }, [dispatch, rowsPerPage, page]);

    const init = async () => {
        showLoading();
        const userId = userAuth?.userData?._id;
        const response = await loadDashBoardData({ id: userId });
        if (response.status) {
            setTotalRows(Number(response.round_count));
            const requestData = {
                id: userId,
                offset: page,
                count: rowsPerPage
            }
            const response1 = await getRoundData(requestData);
            if (response1.status) {
                setData(response1.round_data);
            }
        }
        hideLoading();
    };

    const handleRequestSort = (property) => {
        let tempProperty = property;
        const isAsc = orderBy === tempProperty && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(tempProperty);
    };

    const handlePageChange = (value) => {
        setPage(value - 1)
    };

    const changePerPage = (value) => {
        setRowsPerPage(value);
    };

    const handleDelete = async (id) => {
        confirmAlert({
            title: '',
            message: 'Do you really want to remove this game?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        showLoading();
                        const userId = userAuth?.userData?._id;
                        const response = await deleteRoundData({ id: userId, round_uuid: id });
                        if (response.status) {
                            addToast(response.message, { appearance: 'success', autoDismiss: true });
                            init();
                        }
                        else {
                            addToast(response.message, { appearance: 'error', autoDismiss: true });
                        }
                        hideLoading();
                    }
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    const handleDetail = () => {
        dispatch({ type: 'SET_MENU_PATH', data: '/game/game-detail' });
    };

    return (
        <Box className={classes.GameContainer}>
            <Box className={classes.TableTitleBox}>
                All Games
            </Box>
            <Box className={classes.TableMainBox}>
                <Table>
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {
                            data?.map((item) => (
                                <TableRow key={item.uuid} className={classes.TableRow}>
                                    <TableCell>
                                        {item.number.toString()}
                                    </TableCell>
                                    <TableCell>
                                        {CHEF_FOODS[item.result]}
                                    </TableCell>
                                    <TableCell>
                                        {item.players.toString()}
                                    </TableCell>
                                    <TableCell>
                                        {Number(item.profit).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {item.state}
                                    </TableCell>
                                    <TableCell className={classes.ActionCell}>
                                        <Link to={`/game/game-detail?id=${item.uuid}`}>
                                            <IconButton onClick={handleDetail} color="primary" aria-label="upload picture" component="span" className={classes.ActionButton}>
                                                <Visibility />
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                    <TableCell className={classes.ActionCell}>
                                        <IconButton onClick={() => handleDelete(item.uuid)} color="primary" aria-label="upload picture" component="span" className={classes.ActionButton}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalRows}
                    onPageChange={(e, v) => handlePageChange(v + 1)}
                    onRowsPerPageChange={(e) => changePerPage(e.target.value)}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10, 25, 50]}
                />
            </Box>
        </Box>
    );
};

export default GameManagement;