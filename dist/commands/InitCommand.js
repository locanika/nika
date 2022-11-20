"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
const readline = require('readline');
class InitCommand {
    constructor(templateService, systemService, fileSystemService) {
        this.templateService = templateService;
        this.systemService = systemService;
        this.fileSystemService = fileSystemService;
    }
    invoke() {
        let self = this;
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Please specify path to new locanika project:\n", function (projectPath) {
            rl.close();
            // self.fileSystemService.createDirectorySync(`make services-init`);
            // self.fileSystemService.createDirectorySync(`make projects-init`);
        });
    }
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=InitCommand.js.map