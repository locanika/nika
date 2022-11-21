"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
const readline = require('readline');
class InitCommand {
    constructor(templateService, systemService) {
        this.templateService = templateService;
        this.systemService = systemService;
    }
    invoke() {
        let self = this;
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question("Please specify path to new locanika project:\n", function (projectPath) {
            rl.close();
            self.systemService.execShellCommandSync(`git clone git@github.com:locanika/demo.git ${projectPath}`);
            self.systemService.execShellCommandSync(`npm i`);
        });
    }
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=InitCommand.js.map