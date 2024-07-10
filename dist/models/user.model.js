"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    _id: { type: mongodb_1.ObjectId, auto: true },
    email: { type: String, default: "" },
    phonenumber: { type: String, unique: false, required: true },
    phoneOTP: { type: String, default: 1234 },
    emailOTP: { type: String, default: 1234 },
    phoneOTPtimestamp: { type: Date },
    emailOTPtimestamp: { type: Date },
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    dob: { type: String, default: "" },
    username: { type: String },
    profilepic: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    badge: { type: Number, default: 1 },
    gender: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    bio: { type: String },
    isUsername: { type: Boolean, default: false },
    countrycode: { type: String },
    phoneVerify: { type: Boolean, default: false },
    emailVerify: { type: Boolean, default: false },
    is2FA: { type: Boolean, default: false },
    is2FAverify: { type: Boolean, default: false },
    isQA: { type: Boolean, default: false },
    otp2FA: { type: String, default: 1234 },
    OTP2FAtimestamp: { type: Date },
    securityQA: [{
            question: { type: String },
            answer: { type: String },
        }],
    greenBADGE: {
        verifiedSM: { type: String },
        featureinVIDEO: { type: String },
    },
    blueBADGE: {
        feudMedialink: [
            { type: String },
            { type: String },
            { type: String, default: "" },
        ],
        verifiedSMLink: [
            { type: String, default: "" }
        ],
    },
}, {
    versionKey: false
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
