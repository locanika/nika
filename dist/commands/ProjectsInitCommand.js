"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsInitCommand = void 0;
class ProjectsInitCommand {
    constructor(config, systemService, fileSystemService) {
        this.config = config;
        this.systemService = systemService;
        this.fileSystemService = fileSystemService;
    }
    invoke() {
        this.config.projects.forEach((project) => {
            if (!this.fileSystemService.existsSync(`./projects/${project.name}`)) {
                this.systemService.execShellCommandSync(`git clone ${project.src} ./projects/${project.name}`);
            }
        });
    }
}
exports.ProjectsInitCommand = ProjectsInitCommand;
//# sourceMappingURL=ProjectsInitCommand.js.map