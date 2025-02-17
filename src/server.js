import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from './config/conectDB';
import cors from 'cors';
import jwt from "jsonwebtoken";
import paypal from "paypal-rest-sdk";
import cloudinary from "cloudinary";
import multer from "multer";

require('dotenv').config();

let app = express();
app.use(cors({ origin: true }));
app.use(express.json());

//config app
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


const storage = multer.memoryStorage(); // Lưu ảnh vào bộ nhớ dưới dạng Buffer
const upload = multer({ storage: storage });

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 8080;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRECT,
});

//congif paypal
paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_SECRET,
});

app.listen(port, () => {
    //callback
    console.log("Backend Nodejs is running on the port: " + port);
})