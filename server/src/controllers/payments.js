const nodemailer = require("nodemailer")
const htmlTemplate = require("../utils/purchaseEmailTemplate")
const mercadopago = require("mercadopago")
const Report = require("../models/Report")

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_TOKEN
});

const createOrder = async (req, res) => {
    console.log("create order body", req.body)
    const productDetails = {
        id: req.body.id,
        title: "Tasación 100% Online Departamento",
        unit_price: 4990,
        quantity: 1,
        currency_id: "CLP"
    };

    try {
        const preference = await mercadopago.preferences.create({
        items: [productDetails],
        payer: { 
            email: req.body.email,
        },
        back_urls: {
            success: `${process.env.CLIENT_URL}/pago-exitoso/${req.body.id}`,
            failure: `${process.env.CLIENT_URL}/error-pago/${req.body.id}`,
            pending: "",
        },
        auto_return: "approved",
        });

        const data = preference.body;
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        res.status(401).json({ success: false, message: "Error al crear la preferencia de pago", error: error })
    }

}

// Function after succesul payment from Front End
const succesfullPayment = async (req, res) => {
    try {
        // Find report by Id sent in request body from the succesful interface
        const userData = req.body
        const reportUpdated = await Report.findOneAndUpdate({_id: userData.reportId}, { purchased: true}, { new: true });

        // Generate email to send confirmation to user
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
            to: reportUpdated.personalData.email, 
            bcc: process.env.EMAIL_USER,
            subject: 'La compra del informe está lista!',
            html: htmlTemplate(reportUpdated._id)
        };  

        transporter.sendMail(mailData, function (err, info) {
            if(err)
            console.log(err)
            else
            console.log(info);
        });
        // Response to success interface to display to user
        res.status(200).json({ message: `El link al informe se ha enviado al correo ${reportUpdated.personalData.email}` })
    
    }   catch (error) {
            res.status(401).json({ success: false, error: error })
    }
}

const paymentOrderChecker = async (req, res) => {
    try {
        const payment = req.query
        // Mercadopago WEBhook is "Payment Creation" and url is URL/api/v1/payments/check_order?token=PAYMENT_SECRET_TOKEN   
        if (payment.token !== process.env.PAYMENT_SECRET_TOKEN) {
            console.error('Invalid security token');
            return res.status(401).send('Unauthorized');
        }

        if (payment.type === "payment") {
            const data = await mercadopago.payment.findById(payment["data.id"])
            return console.log("mercadoo data", data)
        }
    } catch (error) {
        res.status(401).json({ success: false, error: error })
    }
}


module.exports = { succesfullPayment, createOrder, paymentOrderChecker }