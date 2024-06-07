const JWT = require('jsonwebtoken');
const models = require('../../models/index');
const config = require('../../config');
const SocketManager = require('../../lib/manager/SocketManager');

exports.addAdminUser = async () => {
    try {
        let adminUser = await models.AdminUserModel.findOne({ name: config.ADMIN.name });
        if (adminUser)
            return;

        await new models.AdminUserModel({
            name: config.ADMIN.name,
            password: config.ADMIN.pass
        }).save();
    }
    catch (err) {
        console.error({ title: 'adminController => addAdminUser', message: err.message });
    }
}

exports.adminLogin = async (req, res) => {
    try {
        const { admin_id, admin_pwd } = req.body;

        if (!admin_id || !admin_pwd)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminUser = await models.AdminUserModel.findOne({ name: admin_id });
        if (!adminUser)
            return res.json({ status: false, message: 'Please input correct name.' });

        let passwordStatus = adminUser.comparePassword(admin_pwd);
        if (!passwordStatus)
            return res.json({ status: false, message: 'Please input correct password.' });

        const token = JWT.sign({ id: adminUser._id, username: adminUser.name }, config.JWT.secret, { expiresIn: config.JWT.expire });
        await adminUser.updateToken(token);

        return res.json({ status: true, data: adminUser });
    }
    catch (err) {
        console.error({ title: 'adminController => adminLogin', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.sessionCheck = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.json({ status: false, message: 'Invalid Request' });

        const adminData = await models.AdminUserModel.findOne({ token });
        if (adminData)
            return res.json({ status: true, data: adminData });
        else
            return res.json({ status: false, message: 'Incorrect Token' });
    }
    catch (err) {
        console.error({ title: 'adminController => sessionCheck', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.countData = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.AdminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let userCount = await models.UserModel.countDocuments();
        let roundCount = await models.RoundModel.countDocuments();

        return res.json({ status: true, message: '', user_count: userCount, round_count: roundCount });
    }
    catch (err) {
        console.error({ title: 'adminController => countData', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.getGameUsers = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.AdminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let userList = await models.UserModel.find().lean();
        let sendList = [];

        if (offset * count < userList.length) {
            let maxIndex = (offset + 1) * count;
            if (maxIndex > userList.length)
                maxIndex = userList.length;

            sendList = userList.slice(offset * count, maxIndex);
        }

        return res.json({ status: true, offset: offset, count: count, user_data: sendList });
    }
    catch (err) {
        console.error({ title: 'adminController => getGameUsers', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.deleteGameUser = async (req, res) => {
    try {
        const { id, user_id } = req.body;
        if (!id || !user_id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.AdminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let userDetail = await models.UserModel.findOne({ _id: user_id });
        if (!userDetail)
            return res.json({ status: false, message: 'That user deleted already.' });

        await models.UserModel.deleteOne({ _id: user_id });

        return res.json({
            status: true,
            message: 'Player successfully removed'
        });
    }
    catch (err) {
        console.error({ title: 'adminController => deleteGameUser', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.getGameUserDetail = async (req, res) => {
    try {
        const { id, user_id } = req.body;
        if (!id || !user_id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.AdminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let userDetail = await models.UserModel.findOne({ _id: user_id }).lean();
        if (!userDetail)
            return res.json({ status: false, message: 'That user is not existed.' });

        userDetail.histories = await models.HistoryModel.aggregate([
            {
                $match: {
                    userId: user_id
                }
            },
            {
                $lookup: {
                    from: 'rounds',
                    foreignField: 'uuid',
                    localField: 'round_uuid',
                    as: 'roundData'
                }
            },
            {
                $unwind: '$roundData'
            },
            {
                $project: {
                    _id: 0,
                    round_number: '$roundData.number',
                    chef_food: '$roundData.result.dealer',
                    round_state: '$roundData.state',
                    round_date: '$roundData.date',
                    customer_food: '$betFood',
                    bet_amount: '$betAmount',
                    customer_payout: '$payout',
                    result: '$result'
                }
            },
            {
                $sort: { round_date: -1 }
            }
        ]);

        return res.json({ status: true, data: userDetail });
    }
    catch (err) {
        console.error({ title: 'adminController => getGameUserDetail', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.getRounds = async (req, res) => {
    try {
        const { id, offset, count } = req.body;
        if (!id)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.AdminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let rounds = await models.RoundModel.aggregate([
            {
                $lookup: {
                    from: 'histories',
                    foreignField: 'round_uuid',
                    localField: 'uuid',
                    as: 'historyData',
                    pipeline: [
                        {
                            $addFields: {
                                payout: {$multiply: ['$betAmount', {$subtract: [1, '$payout']}]}
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    number: '$number',
                    uuid: '$uuid',
                    result: '$result.dealer',
                    state: '$state',
                    players: {$size: '$historyData'},
                    profit: {$sum: '$historyData.payout'},
                    date: '$date'
                }
            },
            {
                $sort: { date: -1 }
            }
        ]);

        let sendList = [];
        if(offset * count < rounds.length) {
            let maxIndex = (offset + 1) * count;
            if(maxIndex > rounds.length)
                maxIndex = rounds.length;

            sendList = rounds.slice(offset * count, maxIndex);
        }

        return res.json({status: true, offset: offset, count: count, round_data: sendList});
    }
    catch (err) {
        console.error({ title: 'adminController => getRounds', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.deleteRound = async (req, res) => {
    try {
        const { id, round_uuid } = req.body;
        if (!id || !round_uuid)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.AdminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let roundDetail = await models.RoundModel.findOne({ uuid: round_uuid });
        if (!roundDetail)
            return res.json({ status: false, message: 'That game deleted already.' });

        await models.RoundModel.deleteOne({ uuid: round_uuid });

        return res.json({
            status: true,
            message: 'Game successfully removed'
        });
    }
    catch (err) {
        console.error({ title: 'adminController => deleteRound', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.getRoundDetail = async (req, res) => {
    try {
        const { id, round_uuid } = req.body;
        if (!id || !round_uuid)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.AdminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let roundDetail = await models.RoundModel.findOne({ uuid: round_uuid }).lean();
        if (!roundDetail)
            return res.json({ status: false, message: 'That game is not existed.' });

        roundDetail.players = await models.HistoryModel.aggregate([
            {
                $match: {
                    round_uuid: round_uuid
                }
            },
            {
                $lookup: {
                    from: 'users',
                    let: {uId: '$userId'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', {$toObjectId: '$$uId'}]
                                }
                            }
                        }
                    ],
                    as: 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $project: {
                    _id: 0,
                    address: '$userData.address',
                    pumpAddress: '$userData.pumpAddress',
                    customer_food: '$betFood',
                    customer_amount: '$betAmount',
                    customer_payout: '$payout',
                    result: '$result',
                    game_date: '$date'
                }
            },
            {
                $sort: { game_date: -1 }
            }
        ]);

        return res.json({ status: true, data: roundDetail });
    }
    catch (err) {
        console.error({ title: 'adminController => getGameUserDetail', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}

exports.bonusUser = async(req, res) => {
    try {
        const { id, user_id, bonus } = req.body;
        if (!id || !user_id || !bonus)
            return res.json({ status: false, message: 'Invalid Request' });

        let adminData = await models.AdminUserModel.findOne({ _id: id });
        if (!adminData)
            return res.json({ status: false, message: 'Bad request from another user' });

        let userDetail = await models.UserModel.findOne({ _id: user_id });
        if (!userDetail)
            return res.json({ status: false, message: 'That user is not existed.' });

        userDetail.balance += bonus;
        await userDetail.save();

        SocketManager.getInstance().sendToServer('bonus_balance', {userId: user_id, bonus: bonus, balance: userDetail.balance});

        return res.json({ status: true, balance: userDetail.balance });
    }
    catch (err) {
        console.error({ title: 'adminController => bonusUser', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}