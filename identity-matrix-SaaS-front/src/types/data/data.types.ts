export interface ISearchDataForm {
	firstName?: string;
	lastName?: string;

	businessEmail?: string;
	personalEmail?: string;

	cellPhone?: string;
	altPhone?: string;
	companyPhone?: string;
	businessPhone?: string;

	linkedInLocation?: string;
	linkedInURL?: string;
	facebookURL?: string,

	companyIndustry?: string,
	companyName?: string,
	currentPositionTitle?: string,
	companyWebsiteURL?: string,

	address?: string;
	city?: string;
	state?: string;
	zip?: string;
	country?: string;
}

export interface ISearchData {
	status: boolean;
	message: string;
	data: ISearchDataForm;	
}

export interface ISearchDataState {
	isLoading: boolean;
	searchData:{
		data: ISearchData;
		isSuccess: boolean;
		isLoading: boolean;
		errorMessage: string | unknown;
	}
	datas: ISearchDataForm[];
	isSuccess: boolean;
	errorMessage: string | unknown;
}