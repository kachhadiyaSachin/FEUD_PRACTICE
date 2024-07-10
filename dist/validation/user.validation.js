"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.default = {
    login: {
        body: joi_1.default.object({
            countrycode: joi_1.default.string().required(),
            phonenumber: joi_1.default.string().required()
        })
    },
    OTPcompare: {
        body: joi_1.default.object({
            phonenumber: joi_1.default.string().required(),
            phoneOTP: joi_1.default.string().required()
        })
    },
    signup: {
        body: joi_1.default.object({
            first_name: joi_1.default.string().required(),
            last_name: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            phonenumber: joi_1.default.string().required(),
            dob: joi_1.default.string().required()
        })
    },
    UPGRADEbadge: {
        body: joi_1.default.object({
            isSkip: joi_1.default.boolean().optional(),
            is2FA: joi_1.default.boolean().required(),
            isQA: joi_1.default.boolean().required(),
            securityQA: joi_1.default.array().required()
        })
    },
    greenBADGE: {
        body: joi_1.default.object({
            greenBADGE: {
                verifiedSM: joi_1.default.string().required(),
                featureinVIDEO: joi_1.default.string().required()
            }
        })
    },
    UPGRADEbluebadge: {
        body: joi_1.default.object({
            blueBADGE: {
                feudMedialink: joi_1.default.array().required(),
                verifiedSMLink: joi_1.default.array().required()
            }
        })
    },
    userProfile: {
        body: joi_1.default.object({
            username: joi_1.default.string().required(),
            profilepic: joi_1.default.string().allow("").optional(),
            gender: joi_1.default.string().required(),
            country: joi_1.default.string().required(),
            state: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
            bio: joi_1.default.string().required(),
        })
    }
};
