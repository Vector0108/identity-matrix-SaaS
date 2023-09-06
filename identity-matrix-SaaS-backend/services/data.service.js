const fetch = require('node-fetch');
const csv = require('csvtojson');
const { v4: uuidv4, validate } = require('uuid');
const { Transaction } = require('../models/transaction');
const {
	BlobServiceClient,
	StorageSharedKeyCredential,
} = require('@azure/storage-blob');
require('dotenv').config();
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

const { Data } = require('../models/data');
const { List } = require('../models/list');
const createError = require('../utils/createError');
const contants = require('../utils/constants');
const constants = require('../utils/constants');
const { hasValue } = require('../utils/helpers');
const { getUsersLeadLists } = require('../repositories/leadListRepository');
const { getUserFromJwt } = require('../helpers/authenticationHelper');
const { enrichLeadBasedOnLinkedInProfile, enrichLeadBasedOnNameAndAddress, enrichLeadBasedOnEmail, enrichLeadUsingApollo } = require('./leadEnricherService');
const { toMAP } = require('../mappers/leadMapper');
const { sendUploadFinishMessage } = require('../apis/emailAgent');

function validateEntryToEnrich(entry) {
    const isEmailPresent = hasValue(entry.email);
    const isNamePresent = hasValue(entry.firstName) && hasValue(entry.lastName);
    const isLinkedInURLPresent = hasValue(entry.linkedInURL)


    if (!isEmailPresent && !isNamePresent && !isLinkedInURLPresent) {
        return false;
    }

    return true;
}

function prepareGetSingleLeadForm(form, userId) {
    const email = form.email?.trim();
    const firstName = form.firstName?.trim();
    const lastName = form.lastName?.trim();
    const linkedInURL = form.linkedInURL?.trim();
    const address = form.address?.trim();
    const city = form.city?.trim();
    const state = form.state?.trim();
    const zip = form.zip?.trim();
    const country = 'US';   // NOTE: Only US is supported by Versium. We are focusing on US atm

    return {
        owner: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        linkedInURL: linkedInURL,
        address: address,
        city: city,
        state: state,
        zip: zip,
        country: country,
    };
}

function prepareSheetEntryToEnrich(entry, list) {
    return {
        listId: list._id,
        owner: list.owner,
        companyName: entry['Company'] || '',
        firstName: entry['First Name'] || '',
        lastName: entry['Last Name'] || '',
        currentPositionTitle: entry['Title'] || '',
        linkedInURL: entry['LinkedIn Profile'] || '',
        phone: entry['Phone'] || '',
        email: entry['Email'] || '',
        address: entry['Address'] || '',
        city: entry['City'] || '',
        state: entry['State'] || '',
        zip: entry['Zip'] || '',
        country: entry['Country'] || '',
    }
}

async function enrichLead(initialLeadData) {
    let leadDto = null;
    if (hasValue(initialLeadData.firstName) && hasValue(initialLeadData.lastName) && 
        (hasValue(initialLeadData.zip) || (hasValue(initialLeadData.city) && hasValue(initialLeadData.state)))) {
        leadDto = await enrichLeadBasedOnNameAndAddress(initialLeadData);
    } else if (initialLeadData.email) {
        leadDto = await enrichLeadBasedOnEmail(initialLeadData.email);
    } else if (hasValue(initialLeadData.linkedInURL)) {
        leadDto = await enrichLeadBasedOnLinkedInProfile(initialLeadData.linkedInURL);
    } else if (hasValue(initialLeadData.firstName) && hasValue(initialLeadData.lastName) && hasValue(initialLeadData.companyName)) {
        leadDto = {...initialLeadData, personalEmail: initialLeadData.email};   // TODO: considering email from form, if any, as personal

        await enrichLeadUsingApollo(leadDto);
        return leadDto;
    }

    if (leadDto === null) {
        leadDto = {...initialLeadData};
    }

    // if we already have a validated cell phone, do not go to Apollo
    if (hasValue(leadDto.cellPhone)) {
        return leadDto;
    }

    await enrichLeadUsingApollo(leadDto);
    return leadDto;
}

async function getSingleLead(req, res, next) {
    const user = await getUserFromJwt(req.userId);
    if (!user.verifiedEmail) return next(createError(400, 'Please verify your account'));
    if (!user.unlimitedCredits && user.credits < contants.SINGLE_LEAD_ENRICHMENT_CREDIT_COST)
		return next(createError(400, "You don't have enough credits"));

    const formInputData = prepareGetSingleLeadForm(req.body, req.userId);
    const isEntryReadyForEnriching = validateEntryToEnrich(formInputData);
    if (!isEntryReadyForEnriching) {
        next(createError(400, 'Please insert an email, a linkedin profile, or a name and an address'));
    }

    try {
        const enrichedLeadDto = await enrichLead(formInputData);

		if (enrichedLeadDto.enriched) {
            // this should all be one transaction
            const enrichedLead = await toMAP(enrichedLeadDto);
            await enrichedLead.save();

			if (!user.unlimitedCredits) {
				user.credits -= contants.SINGLE_LEAD_ENRICHMENT_CREDIT_COST;
				await user.save();

				const transaction = new Transaction({
					userId: req.userId,
					type: false,
					note: 'Searching single data',
					amount: contants.SINGLE_LEAD_ENRICHMENT_CREDIT_COST,
				});
				await transaction.save();
			}

			res.status(200).send({
				status: true,
				data: enrichedLead,
			});
		} else {
			res.status(200).send({
				status: false,
				message: 'Data not found',
			});
		}
	} catch (e) {
		next(e);
	}
};

async function getLeadLists(userId) {
    const leadLists = getUsersLeadLists(userId);
    // TODO: maybe transform entries in these lists into DTOs

    return leadLists;
}

async function convertCsv(array) {
	const csvString = [
		[
			'First Name',
			'Last Name',
			'Company',
            'Title',
            'Cell Phone',
			'Alternative Phone',
            'Business Phone',
            'Company Phone',
            'Personal Email',
            'Business Email',
            'LinkedIn Profile',
            'Facebook Profile',
            'LinkedIn Location',
            'Address',
			'City',
			'State',
            'Zip',
			'Country',
		],
		...array.map((item) => [
			item.firstName,
			item.lastName,
			item.company,
            item.title,

            item.cellPhone,
            item.altPhone,
            item.businessPhone,
            item.companyPhone,
            item.personalEmail,
            item.businessEmail,

            item.linkedInURL,
            item.facebookURL,
            `"${item.linkedInLocation}"`,
            item.address,
			item.city,
			item.state,
            item.zip,
			item.country,
		]),
	]
		.map((e) => e.join(','))
		.join('\n');

	const blockBlobClient = await containerClient.getBlockBlobClient(
		`export_${uuidv4().replaceAll('.', '')}.csv`
	);
	const data = csvString;
	await blockBlobClient.upload(data, data.length);
	if (blockBlobClient.url) {
		return blockBlobClient.url;
	} else {
		return '';
	}
}

async function uploadLeadSheet(req, res, next) {
    const user = await getUserFromJwt(req.userId);
    if (!user.verifiedEmail) return next(createError(400, 'Please verify your account'));

    const string = req.file['buffer'].toString();
    const rows = string.split('\n');
    const index = rows[0].split(',').indexOf('Website', 2);
    const csvString = rows
        .map((row) => {
            let row2 = row.split(',');
            row2.splice(index, 1);
            return row2.join(',');
        })
        .join('\n');

    const json = await csv().fromString(csvString);
    if (!user.unlimitedCredits && user.credits < json.length)
		return next(createError(400, "You don't have enough credits"));

    const newList = await List.create({
        owner: req.userId,
        name: req.file.originalname,
        downloadURL: 'some url',
        loading: true
    });

    const enrichedLeads = [];
    for (let i = 0; i < json.length; i++) {
        const entryToEnrich = prepareSheetEntryToEnrich(json[i], newList);
        const isEntryReadyForEnriching = validateEntryToEnrich(entryToEnrich);
        if (!isEntryReadyForEnriching)
            continue;

        const enrichedLeadDto = await enrichLead(entryToEnrich);
        if (enrichedLeadDto.enriched) {
            const enrichedLead = await toMAP(enrichedLeadDto);
            enrichedLeads.push(enrichedLead);
        }
    }

    const leadEnrichmentCost = enrichedLeads.length * constants.SINGLE_LEAD_ENRICHMENT_CREDIT_COST;
    if (leadEnrichmentCost) {
        const transaction = new Transaction({
            userId: req.userId,
            type: false,
            note: 'Enriching data',
            amount: leadEnrichmentCost,
        });
        await transaction.save();

        user.credits -= leadEnrichmentCost;
        await user.save();

        await Data.bulkSave(enrichedLeads);
    }
    const downloadUrl = await convertCsv(enrichedLeads);
    if (downloadUrl) {
        newList.downloadURL = downloadUrl;
        newList.loading = false
        await newList.save();
    }
    await sendUploadFinishMessage({email: user.email})
    res.status(200).send(enrichedLeads);
}

module.exports = {
	getSingleLead: getSingleLead,
    getLeadLists: getLeadLists,
    uploadLeadSheet: uploadLeadSheet
};
