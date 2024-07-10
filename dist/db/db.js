"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbSignals = exports.closeDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const DB_URL = process.env.MONGO_URL;
    if (!DB_URL) {
        console.error('MongoDB URI is not defined in environment variables');
        return;
    }
    try {
        yield mongoose_1.default.connect(DB_URL);
        console.log('MongoDB connected');
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
exports.connectDB = connectDB;
const closeDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connection.close();
        console.log('MongoDB connection closed.');
    }
    catch (err) {
        console.error('Error closing MongoDB connection:', err);
    }
});
exports.closeDB = closeDB;
const dbSignals = () => {
    const cleanUp = (signal) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`${signal} received. Closing MongoDB connection.`);
        yield closeDB();
        process.exit(0);
    });
    process.on('SIGINT', () => cleanUp('SIGINT'));
};
exports.dbSignals = dbSignals;
