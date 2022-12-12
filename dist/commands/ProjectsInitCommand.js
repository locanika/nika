"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsInitCommand = void 0;
class ProjectsInitCommand {
    constructor(config, systemService, fileSystemService, loggerService) {
        this.config = config;
        this.systemService = systemService;
        this.fileSystemService = fileSystemService;
        this.loggerService = loggerService;
    }
    invoke() {
        this.config.projects.forEach((project) => {
            if (!this.fileSystemService.existsSync(`./projects/${project.name}`)) {
                this.loggerService.info(`Clone ./projects/${project.name}`);
                this.systemService.execShellCommandSync(`git clone ${project.src} ./projects/${project.name}`);
            }
            else {
                this.loggerService.warning(`Folder ./projects/${project.name} already exists, skipped`);
            }
        });
    }
}
exports.ProjectsInitCommand = ProjectsInitCommand;
//# sourceMappingURL=ProjectsInitCommand.js.map