const Axios = require('axios');
const Tatum = require('@tatumio/tatum');
const config = require('../../config');
const models = require('../../models/index');
const SocketManager = require('../../lib/manager/SocketManager');

const TatumAxios = Axios.create();
TatumAxios.defaults.timeout = 20000;
TatumAxios.defaults.baseURL = 'https://api.tatum.io/v3';
TatumAxios.defaults.headers.common['x-api-key'] = config.TATUM_OPTION[config.NETWORK].apikey;
TatumAxios.defaults.headers.common['Content-Type'] = 'application/json';
TatumAxios.defaults.headers.post['Content-Type'] = 'application/json';

const tokenAddress = '0xF3E80013E679Be2702A9A45d88D411593824D496';

const NativeData = {
    'erc-20': 'ETH',
    'bep-20': 'BNB',
    'trc-20': 'TRX'
};

exports.initTatumETH = async() => {
    try {
        let ethSetting = await models.SettingModel.exists({key: 'ETHWalletInfo'});
        if(ethSetting)
            return;

        let ethWallet = await createEthereumWallet();
        if(ethWallet === null) {
            console.error('tatumController => initTatumETH: createEthereumWallet Error');
            return;
        }

        let virtualAccount = await createVirtualAccount({xpub: ethWallet.xpub, coinType: 'ETH'});
        if(virtualAccount === null) {
            console.error('tatumController => initTatumETH: createVirtualAccount Error');
            return;
        }

        let ownerWalletAddress = await getOwnerAddressFromAccount({
            coinType: 'ETH',
            accountInfo: {
                virtualAccount: virtualAccount,
                mnemonic: ethWallet.mnemonic
            }
        });
        if(ownerWalletAddress === null) {
            console.error('tatumController => initTatumETH: ownerWalletAddress Error');
            return;
        }

        models.SettingModel.create({ 
            key: 'ETHWalletInfo', 
            dataObject: { 
                mnemonic: ethWallet.mnemonic, 
                xpub: ethWallet.xpub, 
                virtualAccount: virtualAccount, 
                ownerWalletAddress: ownerWalletAddress 
            } 
        });
        console.log('ETHWalletInfo setting firstly saved');
    }
    catch(err) {
        console.error({title: 'tatumController => initTatumETH', message: err.message});
    }
}

exports.createGasPumpAddress = async(data) => {
    try {
        const create_request = {
            chain: 'ETH',
            owner: data.ownerAddress,
            from: data.index,
            to: data.index
        }

        const approve_request = {
            chain: 'ETH',
            owner: data.ownerAddress,
            from: data.index,
            to: data.index,
            fromPrivateKey: data.privateKey
        }

        const create_response = await TatumAxios.post(`/gas-pump`, JSON.stringify(create_request));
        if(!create_response) {
            console.log({ title: 'tatumController => createGasPumpAddress', message: 'Gas Pump not created' });
            return null;
        }

        const activate_response = await TatumAxios.post(`/gas-pump/activate`, JSON.stringify(approve_request));
        if (!activate_response) {
            console.log({title: 'tatumController => CreateGasPumpAddress', message: 'Gas Pump Address not Activated'})
            return null;
        }

        const subscription_response = await createSubscription({ url: config.SUBSCRIBE_URL, chain: 'ETH', address: create_response.data[0] });
        if (subscription_response === null) {
            console.log("tatumController => createGasPumpAddress: Subscription Error");
            return null;
        }

        return create_response.data[0];
    }
    catch(err) {
        console.error({title: 'tatumController => createGasPumpAddress', message: err.message});
        return null;
    }
}

exports.tatumWebhook = async(req, res) => {
    try {
        let { address, amount, counterAddress, blockNumber, txId, type, subscriptionType } = req.body;

        // const setting = await models.SettingModel.findOne({key: 'ETHWalletInfo'});
        // if(counterAddress === setting.dataObject.ownerWalletAddress.address)
        //     return console.log({title: 'tatumController => tatumWebhook', message: 'Transaction Saved, Balance Changed.'});

        if(type === 'native') 
            return console.error({title: 'tatumController => tatumWebhook', message: 'Native Token is not supported.'});

        let txData = await models.TransactionModel.findOne({txId});
        if(txData)
            return console.log({title: 'tatumController => tatumWebhook', message: 'Transaction already saved.'});

        await new models.TransactionModel({txId, amount, from: address, to: counterAddress, date: new Date(), blockNumber, subscriptionType}).save();

        let userData = await models.UserModel.findOne({pumpAddress: counterAddress});
        if(!userData) 
            return console.error({title: 'tatumController => tatumWebhook', message: 'User pump address is not existed.'});

        let newBalanceData = Number(userData.balance) + Number(amount);
        userData.balance = newBalanceData;
        await userData.save();

        SocketManager.getInstance().broadCast('update_balance', {userId: userData._id.toString(), balance: newBalanceData});

        const transfer_response = await BalanceMove({
            custodialAddress: counterAddress,
            tokenAddress: tokenAddress,
            amount: amount.toString(),
            contractType: 0
        });
        if (!transfer_response) {
            SocketManager.getInstance().broadCast('deposit_result', {userId: userData._id.toString(), result: false});
            return console.error({title : 'tatumController => tatumWebhook', message: 'Balance Move Error"'});
        }

        SocketManager.getInstance().broadCast('deposit_result', {userId: userData._id.toString(), result: true});
        return console.log({title: 'tatumController => tatumWebhook', message: 'Transaction Saved, Balance Changed'});
    }
    catch(err) {
        console.error({title: 'tatumController => tatumWebhook', message: err.message});
        return res.json({status: false, data: null, message: err.message});
    }
}

exports.withdrawERC20Token = async (data) => {
    try {
        let { withdrawAddress, derivationKey, amount } = data;

        const request = {
            chain: "ETH",
            to: withdrawAddress,
            contractAddress: tokenAddress,
            amount: amount.toString(),
            digits: 18,
            fromPrivateKey: derivationKey
        }

        return await TatumAxios.post('/blockchain/token/transaction', JSON.stringify(request));
    } 
    catch (error) {
        console.error({ title: 'tatumController => withdrawerc20token', message: error.message });
        return null;
    }
}

const createEthereumWallet = async() => {
    try {
        const response = await TatumAxios.get('/ethereum/wallet');
        const {mnemonic, xpub} = response.data;
        return {mnemonic, xpub};
    }
    catch(err) {
        console.error({title: 'tatumController => createEthereumWallet', message: err.message});
        return null;
    }
}

const createVirtualAccount = async(data) => {
    try {
        const {xpub, coinType} = data;
        const request = {
            currency: coinType,
            xpub: xpub,
            customer: {
                accountingCurrency: 'USD',
                customerCountry: 'US',
                externalId: config.TATUM_OPTION[config.NETWORK].virtualAccount,
                providerCountry: 'US'
            },
            compliant: true,
            accountCode: config.TATUM_OPTION[config.NETWORK].virtualAccount,
            accountingCurrency: 'USD',
            accountNumber: config.TATUM_OPTION[config.NETWORK].virtualAccount
        };
        const response = await TatumAxios.post('/ledger/account', JSON.stringify(request));
        return response.data;
    }
    catch(err) {
        console.error({title: 'tatumController => createVirtualAccount', message: err.message});
        return null;
    }
}

const getOwnerAddressFromAccount = async(data) => {
    try {
        const {coinType, accountInfo} = data;
        const chain = getNetworkFromCoinType(coinType);
        const addressData = await TatumAxios.post(`/offchain/account/${accountInfo.virtualAccount.id}/address`);
        const privateKey = await generatePrivateKey({ index: addressData.data.derivationKey, chain, mnemonic: accountInfo.mnemonic });
        return { ...addressData.data, ...privateKey };
    }
    catch(err) {
        console.error({title: 'tatumController => getOwnerAddressFromAccount', message: err.message});
        return null;
    }
}

const getNetworkFromCoinType = (coinType) => {
    if(coinType.toUpperCase() === 'BTC') return 'bitcoin';
    else if(coinType.toUpperCase() === 'ETH') return 'ethereum';
    else if(coinType.toUpperCase() === 'TRX') return 'tron';
    else if(coinType.toUpperCase() === 'BNB') return 'bsc';
} 

const generatePrivateKey = async(data) => {
    try {
        const {mnemonic, index, chain} = data;
        const response = await TatumAxios.post(`/${chain}/wallet/priv`, JSON.stringify({ index, mnemonic }));
        return response.data;
    }
    catch(err) {
        console.error({title: 'tatumController => generatePrivateKey', message: err.message});
        return '';
    }
}

const createSubscription = async(data) => {
    try {
        const { address, chain, url } = data;
        const request = {
            type: 'ADDRESS_TRANSACTION',
            attr: {
                address,
                chain,
                url
            }
        };

        const response = await TatumAxios.post('/subscription', JSON.stringify(request));
        return response.data;
    }
    catch(err) {
        console.error({title: 'tatumController => createSubscription', message: err.message});
        return null;
    }
}

const BalanceMove = async(data) => {
    try {
        let { custodialAddress, tokenAddress, amount, contractType } = data;

        const setting = await models.SettingModel.findOne({key: 'ETHWalletInfo'});

        const move_request = {
            chain: "ETH",
            custodialAddress: custodialAddress,
            recipient: setting.dataObject.ownerWalletAddress.address,
            contractType: contractType,
            tokenAddress: tokenAddress,
            amount: amount,
            fromPrivateKey: setting.dataObject.ownerWalletAddress.key
        }

        const move_response = await TatumAxios.post('/blockchain/sc/custodial/transfer', JSON.stringify(move_request));
        if(!move_response) {
            console.error({title: 'tatumController => BalanceMove', message: 'Balance Moving failed.'});
            return null;
        }

        return move_response;
    }
    catch(err) {
        console.error({title: 'tatumController => BalanceMove', message: err.message});
        return null;
    }
}