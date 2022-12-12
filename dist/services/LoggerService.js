"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const chalk_1 = __importDefault(require("chalk"));
class LoggerService {
    info(message) {
        console.log(chalk_1.default.green.bold(message));
    }
    warning(message) {
        console.log(chalk_1.default.yellow.bold(message));
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=LoggerService.js.map