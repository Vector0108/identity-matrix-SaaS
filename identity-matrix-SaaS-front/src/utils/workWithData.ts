import { ISearchDataForm } from "types/data/data.types";

export const prepareForTable = (data: ISearchDataForm) => {
    return {
      Name: data.firstName || "-",
      "Last Name": data.lastName || "-",
      "Business Email": data.businessEmail || "-",
      "Personal Email": data.personalEmail || "-",

      "Cell Phone": data.cellPhone || "-",
      "Alternative Phone": data.altPhone || "-",
      "Business Phone": data.businessPhone || "-",
      "Company Phone": data.companyPhone || "-",
    
      "LinkedIn Profile": data.linkedInURL || "-",
      "Facebook Profile": data.facebookURL || "-",

      "Location from LinkedIn": data.linkedInLocation || "-",
      Address: data.address || "-",
      City: data.city || "-",
      Zip: data.zip || "-",
      State: data.state || "-",
      Country: data.country,

      Industry: data.companyIndustry || "-",
      "Company Name": data.companyName || "-",
      "Current Title": data.currentPositionTitle || "-",
      "Company Website": data.companyWebsiteURL || "-",
    };
  };