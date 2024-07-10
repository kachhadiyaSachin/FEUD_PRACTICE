"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("./user.controller");
const feuds_controller_1 = require("./feuds.controller");
exports.default = {
    userExample: new user_controller_1.userExample(),
    feudsExample: new feuds_controller_1.feudsExample(),
};
