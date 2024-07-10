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
exports.feudsExample = void 0;
const feud_service_1 = require("../service/feud.service");
class feudsExample extends feud_service_1.feudService {
    constructor() {
        super();
    }
    feudsVerify(req, res) {
        const _super = Object.create(null, {
            createFeud: { get: () => super.createFeud }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.createFeud.call(this, req, res);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: 500, message: "Something went wrong" });
            }
        });
    }
}
exports.feudsExample = feudsExample;
