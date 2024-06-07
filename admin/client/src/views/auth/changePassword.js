import { Box, Button, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState, useContext } from "react";
import { changePassword } from "redux/action/auth";
import { useSelector } from "react-redux";
import { useToasts } from 'react-toast-notifications';
import { LoadingContext } from "layout/Context/loading";

const useStyles = makeStyles(() => ({
    ChangePassContainer: {
        width: '100%',
        padding: '10px',
        borderTop: 'solid 3px #3c8dbc',
        backgroundColor: '#FFF'
    },
    InputContainer: {
        width: '100%',
        marginBottom: '10px',
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
    }
}));

const ChangePassword = () => {
    const classes = useStyles();
    const userAuth = useSelector((state) => state.userAuth);
    const { addToast } = useToasts();
    const { showLoading, hideLoading } = useContext(LoadingContext);

    const [formData, setFormData] = useState({
        oldPass: '',
        newPass: '',
        conPass: ''
    });

    const handleInputFormData = (value, key) => {
        let tempData = formData;
        tempData[key] = value;
        setFormData({ ...tempData });
    }

    const handleSubmit = async () => {
        showLoading();

        if(formData.newPass === formData.conPass) {
            if(formData.newPass !== formData.oldPass) {
                const requestData = {
                    id: userAuth.userData._id,
                    old_pwd: formData.oldPass,
                    new_pwd: formData.newPass
                };
                const response = await changePassword(requestData);
                if(response.status === 'fail') {
                    addToast(response.message, { appearance: 'error', autoDismiss: true });
                }
                else {
                    addToast('Congratulation. Password successfully changed!', { appearance: 'success', autoDismiss: true });
                }
            }
            else {
                addToast('New password should be different with old password', { appearance: 'error', autoDismiss: true });
            }
        }
        else {
            addToast('Please confirm new password again.', { appearance: 'error', autoDismiss: true });
        }

        hideLoading();
    };

    return (
        <Grid container className={classes.ChangePassContainer}>
            <Box className={classes.InputContainer}>
                <input className={classes.FormInput} type='password' value={formData.oldPass} onChange={(e) => handleInputFormData(e.target.value, 'oldPass')} placeholder="Old Password" />
            </Box>
            <Box className={classes.InputContainer}>
                <input className={classes.FormInput} type='password' value={formData.newPass} onChange={(e) => handleInputFormData(e.target.value, 'newPass')} placeholder="New Password" />
            </Box>
            <Box className={classes.InputContainer}>
                <input className={classes.FormInput} type='password' value={formData.conPass} onChange={(e) => handleInputFormData(e.target.value, 'conPass')} placeholder="Confirm Password" />
            </Box>
            <Grid item>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </Grid>
        </Grid>
    );
};

export default ChangePassword;