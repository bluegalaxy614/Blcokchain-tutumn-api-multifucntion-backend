const JWT = require('jsonwebtoken');
const config = require('../../config');
const models = require('../../models/index');
const tatumController = require('./tatumController');
const SocketManager = require('../../lib/manager/SocketManager');

exports.walletLogin = async(req, res) => {
    try {
        const { address } = req.body;
        if(!address)
            return res.json({status: false, message: 'Invalid Request'});

        const socket = SocketManager.getInstance().getServerSocket().getBestService();

        let user = await models.UserModel.findOne({address: address.toLowerCase()});
        if(user)
            return res.json({status: true, userid: user._id, address: user.address, pumpaddress: user.pumpAddress, balance: user.balance, socket: socket});

        let walletSetting = await models.SettingModel.findOne({ key: 'ETHWalletInfo' });
        if(!walletSetting)
            return res.json({ status: false, message: "Wallet info no exist."});

        let index = await models.UserModel.countDocuments();
        let data = {
            ownerAddress: walletSetting.dataObject.ownerWalletAddress.address,
            privateKey: walletSetting.dataObject.ownerWalletAddress.key,
            index: index
        }
        let pumpAddress = await tatumController.createGasPumpAddress(data);
        if (pumpAddress === null)
            return res.json({ status: false, message:  "Pump Address Null"});
        
        const token = JWT.sign({ address: address }, config.JWT.secret, { expiresIn: config.JWT.expire });
        let new_user = await new models.UserModel({
            address: address.toLowerCase(),
            pumpAddress: pumpAddress.toString().toLowerCase(),
            type: 'user',
            token: token
        }).save();

        return res.json({ status: true, userid: new_user._id, address: new_user.address, pumpaddress: pumpAddress, balance: new_user.balance, socket: socket});
    }
    catch(err) {
        console.error({title: 'walletController => walletLogin', message: err.message});
        return res.json({status: false, message: err.message});
    }
}

exports.Withdraw = async (req, res) => {
    try {
        const { userid, address, amount } = req.body;
        if(!userid || !address || !amount) {
            console.log({title: 'walletController => Withdraw', message: 'Invalid Input'});
            return res.json({ status: false, message: 'Invalid Input' });
        }

        let user = await models.UserModel.findOne({ _id: userid });
        if (!user)
            return res.json({ status: false, message: 'Cannot find User' })
        
        if (user.balance < amount)
            return res.json({ status: false, message: 'Balance is not enough' });
        
        const setting = await models.SettingModel.findOne({key: 'ETHWalletInfo'});
        const request_data = {
            withdrawAddress: address,
            amount: amount,
            derivationKey: setting.dataObject.ownerWalletAddress.key,
        }

        const withdraw_response = await tatumController.withdrawERC20Token(request_data);
        if(!withdraw_response)
            return res.json({status: false, message: 'withdraw failed'});

        user.balance -= amount;
        await user.save();

        return res.json({ status: true, balance: user.balance});
    } 
    catch (err) {
        console.error({ title: 'walletController => Withdraw', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}