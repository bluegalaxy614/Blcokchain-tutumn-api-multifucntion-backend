const config = require('../../config');
const models = require('../../models/index');

exports.getLeaderBoardData = async (req, res) => {
    try {
        const userData = await models.UserModel.find().sort({ balance: '-1' });
        return res.json({ status: true, data: userData });
    }
    catch (err) {
        console.error({ title: 'userController => getLeaderBoardData', message: err.message });
        return res.json({ status: false, message: err.message });
    }
}