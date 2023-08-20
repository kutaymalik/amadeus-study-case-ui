import express from "express";
import dotenv from 'dotenv';
import db from "./config/database.js";
import cors from 'cors';
import bodyParser from "body-parser";
import { flightRoute } from "./routes/flightRoutes.js";
import { pageRoute } from "./routes/pageRoute.js";

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({limit: '30mb', extended: true}));
app.use(express.urlencoded({limit: '30mb', extended: true}));

// Routers
app.use('/', pageRoute);
app.use('/flights', flightRoute);

const PORT = process.env.PORT;

db();

app.listen(PORT, () => {
    console.log(`server is runing on port: ${PORT}`);
})