const Mail = require('./mailConfig');

'use strict'

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(Mail);

const mailOptions = {
    from: `loving official<${Mail.auth.user}`,
    to: 'jessty@foxmial.com',
    subject: '公司',
    html: 'testing'
};

transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
})