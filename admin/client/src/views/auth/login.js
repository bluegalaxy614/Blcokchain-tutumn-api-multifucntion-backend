import { Box, Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState, useContext } from "react";
import { userLogin } from "redux/action/auth";
import { useToasts } from 'react-toast-notifications';
import { LoadingContext } from "layout/Context/loading";
import Config from "config/index";

const useStyles = makeStyles(() => ({
    LoginContainer: {
        display: 'flex',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f5'
    },
    FormBox: {
        width: '360px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: '#FFF',
        boxShadow: '0 0 4px #a3a3a3'
    },
    InputContainer: {
        width: '100%',
        marginBottom: '10px'
    },
    FormInput: {
        width: '100%',
        height: '34px',
        color: '#555',
        fontSize: '14px',
        padding: '6px 12px',
        border: 'solid 1px #d2d6de',
        "&:focus": {
            outline: 'none'
        }
    },
    ActionBox: {
        alignItems: 'center'
    },
    CenterText: {
        textAlign: 'center'
    }
}));

const Login = () => {
    const classes = useStyles();
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [rememberMe, setRemeberMe] = useState(1);

    const handleFormData = (data, field) => {
        let tempData = formData;
        tempData[field] = data;
        setFormData({ ...tempData });
    };

    const handleSignin = async () => {
        showLoading();
        if (formData.userName !== '') {
            if (formData.password !== '') {
                const requestData = {
                    admin_id: formData.userName,
                    admin_pwd: formData.password
                };

                const response = await userLogin(requestData);
                if (response.status) {
                    Config.Api.setToken(response.data.token);
                    addToast('Login success', { appearance: 'success', autoDismiss: true });
                    setTimeout(() => {
                        window.location.assign('/')
                    }, 500);
                }
                else {
                    addToast(response.message, { appearance: 'error', autoDismiss: true });
                }
            }
            else {
                addToast('Please input password', { appearance: 'error', autoDismiss: true });
            }
        }
        else {
            addToast('Please input userName', { appearance: 'error', autoDismiss: true });
        }

        hideLoading();
    }

    return (
        <Box className={classes.LoginContainer}>
            <Box className={classes.FormBox}>
                <Box className={classes.InputContainer}>
                    <p className={classes.CenterText}>Sign in to start your session</p>
                </Box>
                <Box className={classes.InputContainer}>
                    <input type='text' placeholder='User Name' value={formData.userName} onChange={(e) => handleFormData(e.target.value, 'userName')} className={classes.FormInput} />
                </Box>
                <Box className={classes.InputContainer}>
                    <input autoComplete="off" type='password' placeholder='Password' value={formData.password} onChange={(e) => handleFormData(e.target.value, 'password')} className={classes.FormInput} />
                </Box>
                <Grid container className={classes.ActionBox}>
                    <Grid item xs={8}>
                        <label>
                            <input type='checkbox' value={rememberMe} onChange={(e) => setRemeberMe(e.target.value)} /> Remember Me
                        </label>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justifyContent="flex-end">
                            <Button variant="contained" onClick={handleSignin}>Sign In</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Login;