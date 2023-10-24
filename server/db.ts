import mongoose, { ConnectOptions } from "mongoose";
import { env } from "process";
require("dotenv").config();

const db = process.env.MONGO_DB_URI;

if (!db) {
	throw new Error("MONGO_DB_URI environment variable is not defined.");
  }

mongoose.connect(db, { useNewUrlParser: true } as ConnectOptions);

const conn = mongoose.connection;

conn.on('error', (err) => {
	console.log(`Error: ${err}`)
});
conn.on('connected', (err,res) => {
	console.log('Connected to database')
})

export default db;