const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = ({ email, name }) => {
  sgMail.send({
    to: email,
    from: 'darren.bridenbeck@gmail.com',
    subject: "Welcome to the Task App!",
    text: `${name}, you're now part of the team. Woo hoo!`
  });
}

const sendDeleteAccountEmail = ({ email, name }) => {
  sgMail.send({
    to: email,
    from: 'darren.bridenbeck@gmail.com',
    subject: "Sad to see you leave the Task App!",
    text: `${name}, sorry to see you leave! Is there anything I could have done?`
  });
}

module.exports = {
  sendWelcomeEmail,
  sendDeleteAccountEmail
}