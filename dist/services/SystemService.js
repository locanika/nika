"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemService = void 0;
const child_process_1 = require("child_process");
class SystemService {
    execShellCommandSync(command) {
        (0, child_process_1.execSync)(command, { stdio: 'inherit' });
    }
}
exports.SystemService = SystemService;
//# sourceMappingURL=SystemService.js.map