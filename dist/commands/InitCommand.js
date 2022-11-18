"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
class InitCommand {
    constructor(templateService, systemService) {
        this.templateService = templateService;
        this.systemService = systemService;
    }
    invoke() {
        this.templateService.generateExampleMakefile();
        this.templateService.generateExampleConfig();
        this.templateService.generateExampleGitignore();
        this.systemService.execShellCommandSync('npm install locanika');
        this.systemService.execShellCommandSync('make services-init');
        this.systemService.execShellCommandSync('make services-deploy');
    }
}
exports.InitCommand = InitCommand;
//# sourceMappingURL=InitCommand.js.map