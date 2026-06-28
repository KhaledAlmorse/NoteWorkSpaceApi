import express from "express";
import chalk from "chalk";
import dotenv from "dotenv";
import DBConnection from "./src/DB/dbConnection.js";
import bootstrap from "./src/app.controller.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

await bootstrap(app, express);

app.listen(port, () => console.log(chalk.blue(`App Running on Port ${port}`)));
