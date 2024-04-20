import express from 'express';
// import session from "express-session"
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import { env } from "process";
require("dotenv").config();
import './db';
import router from "./routes/routes";
const PORT = process.env.PORT || 4000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
	  origin: ['http://localhost:5173', 'https://yourfrontenddomain.com'],
	  credentials: true, 
	})
  );

app.use(router);




app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});