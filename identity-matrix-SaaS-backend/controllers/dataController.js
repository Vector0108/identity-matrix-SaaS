const { Data } = require('../models/data');
const { User } = require('../models/user');
const createError = require('../utils/createError');
const { getSingleLead, uploadLeadSheet } = require('../services/data.service');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const { ConversationListInstance } = require('twilio/lib/rest/conversations/v1/conversation');

const storageAccountName = process.env.AZURE_ACCOUNT_NAME;
const storageAccessKey = process.env.AZURE_ACCOUNT_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(
	storageAccountName,
	storageAccessKey
);
const blobServiceClient = new BlobServiceClient(
	`https://${storageAccountName}.blob.core.windows.net`,
	sharedKeyCredential
);
const containerClient = blobServiceClient.getContainerClient(containerName);
require('dotenv').config();

// TODO: remove this function? It seems not to be in use
const getData = async (req, res, next) => {
	try {
		const data = await Data.find({ list: req.params.id });
		if (!data.length) return next(createError(404, 'Data not found'));

		res.status(200).send(data);
	} catch (e) {
		next(e);
	}
};

const uploadData = async (req, res, next) => {
	try {
		await uploadLeadSheet(req, res, next);
	} catch (error) {
		next(error);
	}
};

const downloadBlob = async (req, res, next) => {
	const { blobName } = req.body;
	const blobClient = containerClient.getBlobClient(blobName);

	try {
		const response = await blobClient.download();

		res.setHeader('Content-disposition', `attachment; filename=${blobName}`);
		res.setHeader('Content-type', response.contentType);

		response.readableStreamBody.pipe(res);
	} catch (error) {
		console.error('Error accessing Blob:', error);
		res.status(500).send('Error fetching the file.');
	}
};

const getSingleData = async (req, res, next) => {
	await getSingleLead(req, res, next);
};

const getSingleDatas = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.userId });
		if (!user) return next(createError(404, 'User not found'));

		const q = req.query;
		const filters = {
			...(q.search && {
				$or: [
					{ email: { $regex: `^${q.search}`, $options: 'i' } },
					{ firstName: { $regex: `^${q.search}`, $options: 'i' } },
					{ lastName: { $regex: `^${q.search}`, $options: 'i' } },
					{ phone: { $regex: `^${q.search}`, $options: 'i' } },
					{ altPhone: { $regex: `^${q.search}`, $options: 'i' } },
				],
			}),
		};

		const data = await Data.find({
			owner: req.userId,
			enriched: true,
			...filters,
		})

		console.log("data", data);

		if (!data.length) return res.status(200).send([]);

		res.status(200).send(data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
	} catch (e) {
		next(e);
	}
};

module.exports = {
	uploadData,
	getData,
	downloadBlob,
	getSingleData,
	getSingleDatas,
};
