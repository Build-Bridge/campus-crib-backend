import { errorHandler } from './middlewares/errorHandler';
import express from "express"
import cors from "cors"
import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config();
import userRoutes from "./routes/UserRouter"

const app = express();
const port = process.env.PORT || 3000;

// Set up your routes and middleware here
app.use(cors({origin: "*"}));
app.use(errorHandler);
app.use(express.json())
app.use(express.urlencoded())

// Run MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
const connection = mongoose.connection
connection.once('open', () => { console.log('Database running Successfully') });

app.use("/auth", userRoutes)

// Run Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
