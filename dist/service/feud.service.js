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
exports.feudService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const feuds_model_1 = __importDefault(require("../models/feuds.model"));
const feudsOptionscount_model_1 = __importDefault(require("../models/feudsOptionscount.model"));
const createfeudmessage_model_1 = __importDefault(require("../models/createfeudmessage.model"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class feudService {
    createFeud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, pollquestion, options, rules, feudNow, feudLater, FeudDate, FeudTime, JoinFeud, individual, externalEmail, phoneNumber, inviteModerator } = req.body;
            try {
                let user = yield user_model_1.default.findOne({ _id: req.uId });
                let feudUser = yield feuds_model_1.default.findOne({ userId: req.uId });
                if (!user) {
                    return res.status(400).json({ message: "User is not exists" });
                }
                if (rules.length > 3) {
                    return res.status(400).json({ message: "Rules should not exceed 3" });
                }
                if (options.length < 2) {
                    return res.status(400).json({ message: "Options should be atlease 2" });
                }
                if (JoinFeud.length > 4) {
                    return res.status(400).json({ message: "Join Feud should not exceed 4" });
                }
                if (JoinFeud[0] === 4 || JoinFeud.length > 3) {
                    if (individual.length < 1 || individual == undefined) {
                        return res.status(400).json({ message: "Individual invite should not be empty!" });
                    }
                }
                if (externalEmail.length < 0 && phoneNumber.length < 0) {
                    return res.status(400).json({ message: "External email or phone number should not be empty" });
                }
                if (inviteModerator.length < 1 || inviteModerator == undefined) {
                    return res.status(400).json({ message: "Invite moderator should not be empty" });
                }
                feudUser = yield feuds_model_1.default.create({
                    userId: req.uId,
                    title: title,
                    pollquestion: pollquestion,
                    options: options,
                    rules: rules,
                    feudNow: feudNow,
                    feudLater: feudLater,
                    FeudDate: FeudDate,
                    FeudTime: FeudTime,
                    JoinFeud: JoinFeud,
                    inviteModerator: inviteModerator
                });
                if (JoinFeud[0] === 4 || JoinFeud.length > 3) {
                    feudUser.individual = individual;
                    feudUser.externalEmail = externalEmail;
                    feudUser.phoneNumber = phoneNumber;
                    yield feudUser.save();
                }
                for (let index = 0; index < feudUser.options.length; index++) {
                    yield feudsOptionscount_model_1.default.create({
                        feudId: feudUser._id,
                        optionId: feudUser.options[index]._id,
                    });
                }
                const feudsmessage = yield createfeudmessage_model_1.default.create({
                    userId: feudUser._id,
                    profilePic: user.profilepic,
                    badge: user.badge,
                    message: `${user.first_name} ${user.last_name} Invited you to Moderate a Feud`,
                    title: feudUser.title,
                });
                return res.status(200).json({ status: true, message: "Feud created successfully!!!" });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({ status: false, message: "Internal server error!!" });
            }
        });
    }
}
exports.feudService = feudService;
