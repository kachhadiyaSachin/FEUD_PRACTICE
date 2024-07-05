import express, { Request, Response } from "express";
import {connectDB, dbSignals} from '../src/db/db';
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import routes from "../src/routes/index.route";
import ValidationErrorHandler from "../src/middleware/errorHandler";

const startServer = async () => {
  await connectDB();
  dbSignals();
};

startServer();
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use(ValidationErrorHandler);

routes(app);


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server is running on port:", port);
});

export default app;
