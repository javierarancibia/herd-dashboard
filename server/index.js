const express = require("express");
const connectDB = require("./src/db/connect")
const PORT = process.env.PORT || 5000;
const app = express();
require("dotenv").config()
const apiKeyChecker = require("./src/middlewares/apiKeyCheck")
const bodyParser = require('body-parser') 
const cors = require("cors")
const multer = require("multer")
const aws = require("@aws-sdk/client-s3");
// const lambda = require("@aws-sdk/client-lambda")
const textract = require("@aws-sdk/client-textract")
const textractTableHandler = require("./src/utils/TextractTableHandler")

const awsConfig= {
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_OCR_TEST,
        secretAccessKey: process.env.SECRET_KEY_OCR_TEST,
    },
    region: process.env.S3_REGION_OCR_TEST,
}

// Storage function with Multer for PDF storage in Root Upload Folder
const upload = multer({ storage: multer.memoryStorage() })

// Routes Required 
const payments = require("./src/routes/payments")
const properties = require("./src/routes/properties")
const reports = require("./src/routes/reports")
const dbTasks = require("./src/routes/dbTasks")
const admin = require("./src/routes/admin")
const blog = require("./src/routes/blog")
const pdfReader = require("./src/routes/pdfReader")

app.use(cors({ origin: "*" }))

// Upload PDF file to Upload folder in Root
app.post('/api/v1/upload', upload.single('file'), async (req, res) => {
    // S3 Function
    try {
        const s3Client = new aws.S3Client(awsConfig);
        const params = {
            Bucket: process.env.BUCKET_NAME_OCR_TEST,
            Key: req.file.originalname,
            Body: req.file.buffer,
        };
        await s3Client.send( new aws.PutObjectCommand(params) );
    } catch (error) {
        const { requestId, cfId, extendedRequestId } = error.$metadata;
        console.log("Store in S3 Function", { requestId, cfId, extendedRequestId });
    }

    try {
        // Textract Function
        const textractClient = new textract.TextractClient(awsConfig);
        const command = new textract.AnalyzeDocumentCommand({
            Document: { 
                S3Object: { 
                    Bucket: process.env.BUCKET_NAME_OCR_TEST,
                    Name: req.file.originalname,
                },
            },
            FeatureTypes: [ 
                "TABLES" || "FORMS" || "LAYOUT",
            ],
        });
        const data = await textractClient.send(command);
        const handledTable = textractTableHandler(data)
        res.status(200).json({ data, handledTable });
    } catch (error) {
        console.log("Textract Function", error)
    }
})

// Middleware for each query
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Routes without API Key
app.use("/api/v1/payments", payments)
app.use("/api/v1/pdfReader", pdfReader)

// Middleware to check for API Keys
app.use(apiKeyChecker)
// Routes with API Key
app.use("/api/v1/properties", properties)
app.use("/api/v1/reports", reports)
app.use("/api/v1/tasks", dbTasks)
app.use("/api/v1/admin", admin)
app.use("/api/v1/blog", blog)

// Connection to MongoDB and Server connection
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
}
start()

// Lambda Function
// const lambdaClient = new lambda.LambdaClient(awsConfig);
// const command = new lambda.InvokeCommand({
//     FunctionName: "textract-ocr-test",
//     InvocationType: "RequestResponse",
//     Payload: JSON.stringify({ inputString: "It's Lambda Motherfucker" }),
//     LogType: "Tail",
// });

// const lambdaResponse = await lambdaClient.send(command);
// const asciiDecoder = new TextDecoder('ascii');
// const data = asciiDecoder.decode(lambdaResponse.Payload);