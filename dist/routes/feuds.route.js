"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = __importDefault(require("../controller/index.controller"));
const constant_1 = require("../constant/constant");
const authmiddleware_1 = __importDefault(require("../middleware/authmiddleware"));
// import feudsValidation from '../validation/createFeuds.validation';
const router = (0, express_1.Router)();
const { feudsExample } = index_controller_1.default;
router.post(constant_1.END_POINT.CREATEFEUD, authmiddleware_1.default, feudsExample.feudsVerify);
exports.default = router;
