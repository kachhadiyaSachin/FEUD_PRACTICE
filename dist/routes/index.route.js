"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_route_1 = __importDefault(require("./user.route"));
const feuds_route_1 = __importDefault(require("./feuds.route"));
const startPoint = "/api/v1";
const routes = (app) => {
    app.use(`${startPoint}/user`, user_route_1.default);
    app.use(`${startPoint}/feuds`, feuds_route_1.default);
};
exports.default = routes;
