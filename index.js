import express from "express";
import dotenv from "dotenv";
dotenv.config();
const server = express();

import router from "./src/routes/index.js";

import DBConnection from './src/config/DBConfig.js'

DBConnection();

server.use(express.json())
server.use("/api", router);



server.listen(process.env.PORT, () => {
  console.log("... Server is started ...");
});
   