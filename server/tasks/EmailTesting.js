const purchaseEmailTemplate = require("../src/utils/purchaseEmailTemplate")
const nodemailer = require("nodemailer")
require("dotenv").config()

const emailTesting = template => {
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.eu",
        port: 465,
        secure: true, 
        auth: {
            user: process.env.EMAIL_USER, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });

    const mailData = {
        from: process.env.EMAIL_USER,  
        to: "javier.arancibia.reyes@hotmail.com", 
        bcc: "info@ciudad-comercial.cl",
        subject: 'Tu compra está lista Numero de Orden',
        html: template
    };  

    transporter.sendMail(mailData, function (err, info) {
        if(err)
        console.log(err)
        else
        console.log(info);
    });
}

emailTesting(purchaseEmailTemplate("wsrtjkhrt"))
