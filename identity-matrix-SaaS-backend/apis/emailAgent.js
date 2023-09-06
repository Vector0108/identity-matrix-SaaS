const nodemailer = require("nodemailer");
const handlebars = require('handlebars')
const path = require('path');
const fs = require('fs')
const { promisify } = require('util');
const constants = require("../utils/constants");

async function sendEmailVerification(user, jwtToken) {
    const emailContent = {
        name: user.first,
        verificationLink: `${process.env.ORIGIN}/auth/verifyEmail/${jwtToken}`,
        subject: constants.EMAIL_MESSAGE_WELCOME
    }

    const htmlContent = await getHtmlEmailContent(emailContent);
    if (htmlContent === null) {
        return null;
    }

    const emailObject = {
        from: process.env.EMAIL_USERNAME,
        to: user.email,
        subject: emailContent.subject,
        html: htmlContent,
    };
   
    return await sendEmail(emailObject);
}

async function sendResetPassword(email, newPassword) {
    const emailObject = {
        from: process.env.EMAIL_USERNAME,
        to: `<${email}>`,
        subject: constants.EMAIL_SUBJECT_PASSWORD_RESET,
        text: `Your new password is ${newPassword}`,
    }
    
    return await sendEmail(emailObject);
}

async function sendEmail(emailObject) {
    try {
        const transporter = nodemailer.createTransport({
            host: constants.EMAIL_AGENT_SMTP_HOST,
            port: constants.EMAIL_AGENT_SMTP_HOST_PORT,
            auth: {
                user: constants.EMAIL_AGENT_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        return await transporter.sendMail(emailObject);
    } catch (error) {
        console.log(`An error has occurred while attempting to send an email to ${emailObject.to}. Error - [${JSON.stringify(error)}]`);
        return null;
    }
}

async function getHtmlEmailContent(emailContent) {
    try {
        const emailTemplatePath = path.join(__dirname, '../templates/views/email/index.handlebars');
        const readFileAsync = promisify(fs.readFile);
        const templateContent = await readFileAsync(emailTemplatePath, constants.UTF8);
    
        const compiledTemplate = handlebars.compile(templateContent);
        const htmlContent = compiledTemplate(emailContent);

        return htmlContent;
    } catch (error) {
        console.log(`An error has ocurred while preparing a welcome email to be sent. Error - [${JSON.stringify(error)}]`);
        return null;
    }
}

const sendRegistrationMessage = async ({email}) => {
    try {
        const transporter = nodemailer.createTransport({
            host: constants.EMAIL_AGENT_SMTP_HOST,
            port: constants.EMAIL_AGENT_SMTP_HOST_PORT,
            auth: {
                user: constants.EMAIL_AGENT_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    
    
        const emailOptions = {
            from: process.env.EMAIL_USERNAME,
            to:"sales@revenueinstitute.com",
            subject: "New User is sign up",
            text: `User with mail ${email} is successfully signed in`,
        }
    
        transporter.sendMail(emailOptions)
    }catch(err) {
        throw new Error(JSON.stringify(err));
    }
}

const sendUploadFinishMessage = async ({email}) => {
    try {
        const transporter = nodemailer.createTransport({
            host: constants.EMAIL_AGENT_SMTP_HOST,
            port: constants.EMAIL_AGENT_SMTP_HOST_PORT,
            auth: {
                user: constants.EMAIL_AGENT_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    
    
        const emailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: `<${email}>`,
            subject: "Your uploading was finished",
            text: `Your upload process was finished, please check in our service`,
        }
    
        transporter.sendMail(emailOptions)
    }catch(err) {
        throw new Error(JSON.stringify(err));
    }
}

module.exports = {
    sendResetPassword: sendResetPassword,
    sendEmailVerification: sendEmailVerification,
    sendRegistrationMessage,
    sendUploadFinishMessage
}
