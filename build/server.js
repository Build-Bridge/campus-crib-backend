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
const app = (0, express_1.default)();
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
// Run Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
