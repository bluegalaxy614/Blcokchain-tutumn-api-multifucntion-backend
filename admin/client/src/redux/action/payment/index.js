import Config from 'config/index';

export const insertCurrency = async (data) => {
	const response = await Config.Api.insertCurrency(data);
	return response.data;
}

export const updateCurrency = async (data) => {
	const response = await Config.Api.updateCurrency(data);
	return response.data;
}

export const removeCurrency = async (data) => {
	const response = await Config.Api.removeCurrency(data);
	return response.data;
}

export const readCurrency = async (data) => {
	const response = await Config.Api.readCurrency(data);
	return response.data;
}