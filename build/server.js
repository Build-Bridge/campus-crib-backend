"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("./middlewares/errorHandler");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const UserRouter_1 = __importDefault(require("./routes/UserRouter"));
const HostelRouter_1 = __importDefault(require("./routes/HostelRouter"));
const ChatRoutes_1 = __importDefault(require("./routes/ChatRoutes"));
const inspectionRoutes_1 = __importDefault(require("./routes/inspectionRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const ReviewRoutes_1 = __importDefault(require("./routes/ReviewRoutes"));
const roommateRequestRoutes_1 = __importDefault(require("./routes/roommateRequestRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const SocketServices_1 = __importDefault(require("./services/SocketServices"));
const socket_1 = require("./config/socket");
const http_1 = require("http");
const typedi_1 = __importDefault(require("typedi"));
const CronService_1 = require("./services/CronService");
const app = (0, express_1.default)();
// Create HTTP server
const httpServer = (0, http_1.createServer)(app);
// Configure Socket.IO
(0, socket_1.initSocket)(httpServer); // Initialize Socket.IO with the server
// Initialize SocketServices after Socket.IO
const socketServices = typedi_1.default.get(SocketServices_1.default);
socketServices.initialize();
// Initialize CronService for subscription management
const cronService = typedi_1.default.get(CronService_1.CronService);
cronService.startCronJobs();
const port = process.env.PORT || 3050;
// Set up your routes and middleware here
app.use((0, cors_1.default)({ origin: "*" }));
app.use(errorHandler_1.errorHandler);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
// Run MongoDB
mongoose_1.default.connect(process.env.MONGODB_URI);
const connection = mongoose_1.default.connection;
connection.once('open', () => { console.log('Database running Successfully'); });
app.use("/auth", UserRouter_1.default);
app.use("/hostels", HostelRouter_1.default);
app.use("/chats", ChatRoutes_1.default);
app.use("/inspections", inspectionRoutes_1.default);
app.use("/notifications", notificationRoutes_1.default);
app.use("/reviews", ReviewRoutes_1.default);
app.use("/roommate-requests", roommateRequestRoutes_1.default);
app.use("/subscriptions", subscriptionRoutes_1.default);
app.use("/payments", paymentRoutes_1.default);
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
