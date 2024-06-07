import Config from 'config/index';

export const loadDashBoardData = async (data) => {
	const response = await Config.Api.loadDashBoardData(data);
	return response.data;
}

export const getPlayerdata = async (data) => {
	const response = await Config.Api.getPlayerdata(data);
	return response.data;
}

export const deletePlayerData = async (data) => {
	const response = await Config.Api.deletePlayerData(data);
	return response.data;
}

export const getPlayerDetail = async (data) => {
	const response = await Config.Api.getPlayerDetail(data);
	return response.data;
}

export const getRoundData = async(data) => {
	const response = await Config.Api.getRoundData(data);
	return response.data;
}

export const deleteRoundData = async(data) => {
	const response = await Config.Api.deleteRoundData(data);
	return response.data;
}

export const getRoundDetail = async(data) => {
	const response = await Config.Api.getRoundDetail(data);
	return response.data;
}

export const bonusUser = async(data) => {
	const response = await Config.Api.bonusUser(data);
	return response.data;
}