import {ConfigDTO, ProjectDTO} from "../services/ConfigService";
import {SystemService} from "../services/SystemService";
import {FileSystemService} from "../services/FileSystemService";
import {LoggerService} from "../services/LoggerService";

export class ProjectsInitCommand {
    constructor(
        private config: ConfigDTO,
        private systemService: SystemService,
        private fileSystemService: FileSystemService,
        private loggerService: LoggerService
    ) {
    }

    invoke(): void {
        this.config.projects.forEach((project: ProjectDTO) => {
            if (!this.fileSystemService.existsSync(`./projects/${project.name}`)) {
                this.loggerService.info(`Clone ./projects/${project.name}`);
                this.systemService.execShellCommandSync(`git clone ${project.src} ./projects/${project.name}`);
            } else {
                this.loggerService.warning(`Folder ./projects/${project.name} already exists, skipped`);
            }
        });
    }
}

