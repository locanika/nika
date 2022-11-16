import {ConfigDTO, ProjectDTO} from "../services/ConfigService";
import {SystemService} from "../services/SystemService";
import {FileSystemService} from "../services/FileSystemService";

export class ProjectsInitCommand {
    constructor(
        private config: ConfigDTO,
        private systemService: SystemService,
        private fileSystemService: FileSystemService
    ) {
    }

    invoke(): void {
        this.config.projects.forEach((project: ProjectDTO) => {
            if (!this.fileSystemService.existsSync(`./projects/${project.name}`)) {
                this.systemService.execShellCommandSync(`git clone ${project.src} ./projects/${project.name}`);
            }
        });
    }
}

