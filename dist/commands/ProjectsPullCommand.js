"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsPullCommand = void 0;
class ProjectsPullCommand {
    constructor(config, systemService, loggerService) {
        this.config = config;
        this.systemService = systemService;
        this.loggerService = loggerService;
    }
    invoke() {
        this.config.projects.forEach((project) => {
            this.loggerService.info(`Git pull ./projects/${project.name}`);
            this.systemService.execShellCommandSync(`cd ./projects/${project.name} && git pull`);
        });
    }
}
exports.ProjectsPullCommand = ProjectsPullCommand;
//# sourceMappingURL=ProjectsPullCommand.js.map