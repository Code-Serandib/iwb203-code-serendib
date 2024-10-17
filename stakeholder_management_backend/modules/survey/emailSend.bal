import ballerina/email;
import ballerina/io;

public configurable string SMTP_EMAIL = ?;
public configurable string SMTP_USERNAME = ?;
public configurable string SMTP_PASSWORD = ?;

// Function to send an email
 function sendEmailSetOfStakeholders(EmailDetails emailDetails) returns error? {

    email:SmtpConfiguration smtpConfig = {
        port: 587, 
        security: email:START_TLS_AUTO
    };

    email:SmtpClient smtpClient = check new email:SmtpClient(
        host = SMTP_EMAIL,
        username = SMTP_USERNAME,
        password = SMTP_PASSWORD,
        clientConfig = smtpConfig
    );

    email:Message emailMessage = {
        'from: "codeserandib@gmail.com",
        to: [emailDetails.recipient],
        subject: emailDetails.subject,
        htmlBody: emailDetails.bodyHtml
    };

    check smtpClient->sendMessage(emailMessage);
}

// Function to send an email
function sendEmailToStakeholder(string recipientEmail, string subject, string messageBody) returns error? {
    email:SmtpClient smtpClient = check new (host = SMTP_EMAIL,
        port = 465,
        username = SMTP_USERNAME,
        password = SMTP_PASSWORD, 
        security = email:SSL
        // auth = true,
    );

    email:Message emailMessage = {
        'from: "codeserandib@gmail.com",
        to: recipientEmail,
        subject: subject,
        htmlBody: messageBody
    };

    check smtpClient->sendMessage(emailMessage);
    io:println("Email sent successfully to " + recipientEmail);
}
