"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemService = void 0;
const child_process_1 = require("child_process");
class SystemService {
    exec(command) {
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                console.log(error.message);
                return;
            }
            if (stderr) {
                console.log(stderr);
                return;
            }
            console.log(stdout);
        });
    }
}
exports.SystemService = SystemService;
//# sourceMappingURL=SystemService.js.map