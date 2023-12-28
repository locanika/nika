"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemService = void 0;
const child_process_1 = require("child_process");
const os_1 = __importDefault(require("os"));
class SystemService {
    execShellCommandSync(command) {
        (0, child_process_1.execSync)(command, { stdio: 'inherit' });
    }
    getPlatform() {
        return os_1.default.platform();
    }
    getCPUArchitecture() {
        return os_1.default.arch();
    }
}
exports.SystemService = SystemService;
//# sourceMappingURL=SystemService.js.map