import { errorHandler } from './middlewares/errorHandler';
import express from "express"
import cors from "cors"
import mongoose from 'mongoose';
import dotenv from "dotenv"
dotenv.config();
import userRoutes from "./routes/UserRouter"
import hostelRoutes from "./routes/HostelRouter"
import chatRoutes from "./routes/ChatRoutes"
import inspectionRoutes from "./routes/inspectionRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import reviewRoutes from "./routes/ReviewRoutes";
import SocketServices from './services/SocketServices';
import { initSocket } from './config/socket';
import { createServer } from "http";
import Container from 'typedi';

const app = express();
// Create HTTP server
const httpServer = createServer(app);

// Configure Socket.IO
initSocket(httpServer); // Initialize Socket.IO with the server
// Initialize SocketServices after Socket.IO
const socketServices = Container.get(SocketServices)
socketServices.initialize();

const port = process.env.PORT || 3050;

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
app.use("/hostels", hostelRoutes)
app.use("/chats", chatRoutes)
app.use("/inspections", inspectionRoutes);
app.use("/notifications", notificationRoutes);
app.use("/reviews", reviewRoutes);

// Run Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});