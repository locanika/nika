"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsPullCommand = void 0;
class ProjectsPullCommand {
    constructor(config, systemService) {
        this.config = config;
        this.systemService = systemService;
    }
    invoke() {
        this.config.projects.forEach((project) => {
            this.systemService.execShellCommandSync(`cd ./projects/${project.name} && git pull`);
        });
    }
}
exports.ProjectsPullCommand = ProjectsPullCommand;
//# sourceMappingURL=ProjectsPullCommand.js.map