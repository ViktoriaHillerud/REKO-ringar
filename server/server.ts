import express from 'express';
// import session from "express-session"
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
import './db';
import router from "./routes/routes";
const PORT = process.env.PORT || 4000;

const allowedOrigins = ['http://127.0.0.1:5173'];

app.use(cookieParser());
app.use(
    cors<express.Request>({
        origin: 'https://rekoringar.netlify.app/', // Replace this with your React app's URL
        credentials: true,
    })
)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);


app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});