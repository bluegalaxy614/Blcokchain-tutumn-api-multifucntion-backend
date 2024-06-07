import Config from 'config/index';

export const insertGame = async (data) => {
	const response = await Config.Api.insertGame(data);
	return response.data;
}

export const updateGame = async (data) => {
	const response = await Config.Api.updateGame(data);
	return response.data;
}

export const removeGame = async (data) => {
	const response = await Config.Api.removeGame(data);
	return response.data;
}

export const readGame = async (data) => {
	const response = await Config.Api.readGame(data);
	return response.data;
}

export const adminBetResult = async (data) => {
	const response = await Config.Api.adminBetResult(data);
	return response.data
}