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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userExample = void 0;
const user_service_1 = require("../service/user.service");
class userExample extends user_service_1.userService {
    constructor() {
        super();
    }
    loginVerify(req, res) {
        const _super = Object.create(null, {
            login: { get: () => super.login }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.login.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    OTPVerify(req, res) {
        const _super = Object.create(null, {
            OTPcompare: { get: () => super.OTPcompare }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.OTPcompare.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    OTPresend(req, res) {
        const _super = Object.create(null, {
            ResendOTP: { get: () => super.ResendOTP }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.ResendOTP.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    Signup(req, res) {
        const _super = Object.create(null, {
            signup: { get: () => super.signup }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.signup.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    EMAILOTPVerify(req, res) {
        const _super = Object.create(null, {
            EMAILOTPcompare: { get: () => super.EMAILOTPcompare }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.EMAILOTPcompare.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    EMAILOTPresend(req, res) {
        const _super = Object.create(null, {
            ResendEMAILOTP: { get: () => super.ResendEMAILOTP }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.ResendEMAILOTP.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    upgradeBADGE(req, res) {
        const _super = Object.create(null, {
            UPGRADEbadge: { get: () => super.UPGRADEbadge }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.UPGRADEbadge.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    otp2FAVerify(req, res) {
        const _super = Object.create(null, {
            OTP2FAverify: { get: () => super.OTP2FAverify }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.OTP2FAverify.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    upgradeGREENBADGE(req, res) {
        const _super = Object.create(null, {
            UPGRADEgreenbadge: { get: () => super.UPGRADEgreenbadge }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.UPGRADEgreenbadge.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    upgradeBLUEBADGE(req, res) {
        const _super = Object.create(null, {
            UPGRADEbluebadge: { get: () => super.UPGRADEbluebadge }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.UPGRADEbluebadge.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    userPROFILE(req, res) {
        const _super = Object.create(null, {
            userProfile: { get: () => super.userProfile }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.userProfile.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    usernameCHECK(req, res) {
        const _super = Object.create(null, {
            usernameCheck: { get: () => super.usernameCheck }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.usernameCheck.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    usernameSUGGESTION(req, res) {
        const _super = Object.create(null, {
            usernameSuggestion: { get: () => super.usernameSuggestion }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.usernameSuggestion.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    usernamePURCHASE(req, res) {
        const _super = Object.create(null, {
            usernamePurchase: { get: () => super.usernamePurchase }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.usernamePurchase.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
    getuserPROFILE(req, res) {
        const _super = Object.create(null, {
            getuserProfile: { get: () => super.getuserProfile }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.getuserProfile.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
}
exports.userExample = userExample;
