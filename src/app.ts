import express, { Request, Response, NextFunction } from "express";
import {connectDB, dbSignals} from './DB/db';
import dotenv from "dotenv";
import cors from "cors";
import routes from "./Routes/index.route";
import {validationErrorHandler} from "./Middleware/errorHandler";
import { Analytics } from "@vercel/analytics/react"

const startServer = async () => {
  await connectDB();
  dbSignals();
};

startServer();
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(Analytics);
routes(app);

app.use(validationErrorHandler);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
      message: err.message,
      error: err
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port:", port);
});

export default app;
