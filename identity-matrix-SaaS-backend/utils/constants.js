module.exports = {
    DEBOUNCE_BASE_URL: 'https://api.debounce.io/v1/',
    APOLLO_PEOPLE_API: 'https://api.apollo.io/v1/people/match',
    SNOV_GENERATE_ACCESS_TOKEN_URL: 'https://api.snov.io/v1/oauth/access_token',
    SNOV_ADD_PROSPECT_URL: 'https://api.snov.io/v1/add-url-for-search',
    SNOV_GET_PROSPECT_URL: 'https://api.snov.io/v1/get-emails-from-url',

    SINGLE_LEAD_ENRICHMENT_CREDIT_COST: 1,
    NEW_USER_CREDITS: 10,
    
    EMAIL_AGENT_SMTP_HOST: 'smtp.sendgrid.net',
    EMAIL_AGENT_SMTP_HOST_PORT: 587,
    EMAIL_AGENT_USERNAME: 'apikey',
    EMAIL_NOT_SENT_CODE: 'EMESSAGE',
    EMAIL_MESSAGE_WELCOME: 'Welcome to Our Service',

    EMAIL_SUBJECT_PASSWORD_RESET: 'Here is your new password',

    UTF8: 'utf8',

    MESSAGE_ACCOUNT_ALREADY_EXISTS: 'User can not be created using these credentials',
    MESSAGE_CREDENTIALS_NOT_PROVIDED: 'Please input your credentials',
    MESSAGE_UNSUCCESSFUL_LOGIN_ATTEMPT: 'Please try to login again',
    MESSAGE_PASSWORD_RESET_FAILED: 'The password could not be changed',
    MESSAGE_EMAIL_NOT_SENT: 'We can not send you an email at this time',
    MESSAGE_LOGOUT: 'User has been logged out',
    MESSAGE_NOT_AUTHENTICATED: 'Log in to proceed',
    MESSAGE_ACCOUNT_ACTIVATED: 'Your account is now active',
    MESSAGE_ACCOUNT_NOT_ACTIVATED: 'Account could not be activated',
    MESSAGE_VALIDATION_EMAIL_SENT: 'An email has been sent to you',

    PARTNERS: ['qualigence.com', 'poweronpro.com'],
    REVENUE_INSTITUTE_DOMAIN: 'revenueinstitute.com',

    FLAG_APOLLO_MOBILE: 'mobile',
    FLAG_APOLLO_WORKHQ: 'work_hq',
    FLAG_DEBOUNCE_INVALID_EMAIL: 'Invalid',

    REVERSECONTACT_EMAIL_TYPE_PROFESSIONAL: 'professional',
    REVERSECONTACT_EMAIL_TYPE_PERSONAL: 'personal',

    SNOV_PROPERTY_CLIENT_CREDENTIALS: 'client_credentials'


}
