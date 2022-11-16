import {ConfigDTO, FileSystem, ProjectDTO} from "../services/ConfigService";
import { SystemService } from "../services/SystemService";

export class ProjectsPullCommand {
    constructor(private config: ConfigDTO, private systemService: SystemService) {
    }

    invoke(): void {
        this.config.projects.forEach((project: ProjectDTO) => {
            this.systemService.execShellCommandSync(`cd ./projects/${project.name} && git pull`);
        });
    }
}

